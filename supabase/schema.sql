-- ==========================================================================
--  Opakovačka: třídní soutěž
--  Spustit jednou v Supabase: SQL Editor → New query → vložit → Run.
--
--  Ukládá se jen: kód třídy, přezdívka a body. Žádné jméno, e-mail ani heslo.
--  Tabulky nejsou přístupné přímo z internetu (RLS bez pravidel).
--  Aplikace smí volat jen funkce níže, které hlídají kód třídy,
--  tajný klíč hráče, přezdívky a limity proti podvádění.
-- ==========================================================================

create table if not exists public.classes (
  code text primary key check (code ~ '^[A-Z0-9-]{4,16}$'),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  class_code text not null references public.classes (code) on delete cascade,
  nickname text not null,
  secret uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create unique index if not exists players_class_nickname on public.players (class_code, lower(nickname));

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  player_id uuid not null references public.players (id) on delete cascade,
  quiz_id text not null,
  mode_id text not null,
  points int not null check (points >= 0),
  total int not null check (total between 1 and 30),
  created_at timestamptz not null default now()
);
create index if not exists scores_player_time on public.scores (player_id, created_at desc);

alter table public.classes enable row level security;
alter table public.players enable row level security;
alter table public.scores enable row level security;

-- ---------- pomocné funkce ----------

-- Začátek týdne (pondělí 0:00 českého času).
create or replace function public.week_start()
returns timestamptz
language sql stable
set search_path = public
as $$
  select date_trunc('week', now() at time zone 'Europe/Prague') at time zone 'Europe/Prague';
$$;

-- Přezdívka: 3–16 znaků, písmena, číslice, mezera a pomlčka, bez sprostých slov.
-- Stejný seznam je v aplikaci v src/lib/nickname.ts.
create or replace function public.nickname_ok(n text)
returns boolean
language sql immutable
set search_path = public
as $$
  select char_length(n) between 3 and 16
     and n ~ '^[A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž0-9 -]+$'
     and lower(translate(n, 'ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž', 'ACDEEINORSTUUYZacdeeinorstuuyz'))
         !~ '(kurv|pica|pico|picu|pice|prdel|hovn|srac|sral|serou|kokot|curak|debil|idiot|mrd|jeb|zmrd|buzn|kreten|hajzl|chcan|kund|dement|retard|negr|cikan|fuck|shit|bitch|dick|porn|sex|nazi|hitler|penis|vagin)';
$$;

-- ---------- funkce pro aplikaci ----------

-- Připojení ke třídě: vrátí id hráče a tajný klíč, který si telefon uloží.
create or replace function public.join_class(p_code text, p_nickname text)
returns table (player_id uuid, secret uuid, nickname text, class_name text)
language plpgsql security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_code text := upper(btrim(p_code));
  v_nick text := regexp_replace(btrim(p_nickname), '\s+', ' ', 'g');
  v_name text;
begin
  select c.name into v_name from public.classes c where c.code = v_code;
  if not found then raise exception 'class_not_found'; end if;
  if not public.nickname_ok(v_nick) then raise exception 'nickname_invalid'; end if;
  if exists (select 1 from public.players p where p.class_code = v_code and lower(p.nickname) = lower(v_nick)) then
    raise exception 'nickname_taken';
  end if;
  if (select count(*) from public.players p where p.class_code = v_code) >= 60 then
    raise exception 'class_full';
  end if;
  return query
    insert into public.players as p (class_code, nickname)
    values (v_code, v_nick)
    returning p.id, p.secret, p.nickname, v_name;
end;
$$;

-- Odeslání bodů po kvízu. Bod = správná odpověď.
create or replace function public.submit_score(
  p_player uuid, p_secret uuid, p_quiz text, p_mode text, p_points int, p_total int
)
returns table (week_points bigint, total_points bigint)
language plpgsql security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_last timestamptz;
  v_today bigint;
begin
  if not exists (select 1 from public.players p where p.id = p_player and p.secret = p_secret) then
    raise exception 'unauthorized';
  end if;
  if p_total < 1 or p_total > 30 or p_points < 0 or p_points > p_total then
    raise exception 'invalid_score';
  end if;
  select max(s.created_at) into v_last from public.scores s where s.player_id = p_player;
  if v_last is not null and v_last > now() - interval '8 seconds' then
    raise exception 'too_fast';
  end if;
  select coalesce(sum(s.points), 0) into v_today
  from public.scores s where s.player_id = p_player and s.created_at > now() - interval '1 day';
  if v_today + p_points > 400 then
    raise exception 'daily_limit';
  end if;

  insert into public.scores (player_id, quiz_id, mode_id, points, total)
  values (p_player, left(p_quiz, 60), left(p_mode, 40), p_points, p_total);

  return query
    select coalesce(sum(s.points) filter (where s.created_at >= public.week_start()), 0)::bigint,
           coalesce(sum(s.points), 0)::bigint
    from public.scores s where s.player_id = p_player;
end;
$$;

-- Žebříček třídy. Vrací jen přezdívky a body, nikdy id ani tajné klíče.
create or replace function public.leaderboard(p_code text, p_player uuid default null)
returns table (nickname text, week_points bigint, total_points bigint, is_me boolean, class_name text)
language sql stable security definer
set search_path = public
as $$
  select p.nickname,
         coalesce(sum(s.points) filter (where s.created_at >= public.week_start()), 0)::bigint,
         coalesce(sum(s.points), 0)::bigint,
         coalesce(p.id = p_player, false),
         c.name
  from public.players p
  join public.classes c on c.code = p.class_code
  left join public.scores s on s.player_id = p.id
  where p.class_code = upper(btrim(p_code))
  group by p.id, p.nickname, c.name
  order by 2 desc, 3 desc, p.nickname;
$$;

-- Smazání přezdívky i všech bodů (hráč to udělá sám v aplikaci).
create or replace function public.delete_player(p_player uuid, p_secret uuid)
returns boolean
language plpgsql security definer
set search_path = public
as $$
begin
  delete from public.players p where p.id = p_player and p.secret = p_secret;
  return found;
end;
$$;

-- ---------- práva ----------

revoke all on function public.week_start() from public;
revoke all on function public.nickname_ok(text) from public;
revoke all on function public.join_class(text, text) from public;
revoke all on function public.submit_score(uuid, uuid, text, text, int, int) from public;
revoke all on function public.leaderboard(text, uuid) from public;
revoke all on function public.delete_player(uuid, uuid) from public;

grant execute on function public.join_class(text, text) to anon, authenticated;
grant execute on function public.submit_score(uuid, uuid, text, text, int, int) to anon, authenticated;
grant execute on function public.leaderboard(text, uuid) to anon, authenticated;
grant execute on function public.delete_player(uuid, uuid) to anon, authenticated;

-- ---------- nová třída ----------
-- Kód rozdej dětem ve třídě. Další třídy přidáš stejným příkazem s jiným kódem.
-- insert into public.classes (code, name) values ('4B-XXXX', '4.B');
