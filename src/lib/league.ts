import { SUPABASE_KEY, SUPABASE_URL } from '../config';

/**
 * Třídní soutěž: připojení přezdívkou, odesílání bodů a žebříček.
 * V telefonu se ukládá jen id hráče, jeho tajný klíč, přezdívka a kód třídy.
 */

export const leagueEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

export interface Membership {
  playerId: string;
  secret: string;
  nickname: string;
  classCode: string;
  className: string;
}

export interface LeaderboardRow {
  nickname: string;
  week_points: number;
  total_points: number;
  is_me: boolean;
  class_name: string;
}

interface Pending {
  quizId: string;
  modeId: string;
  points: number;
  total: number;
}

const KEY = 'opakovacka:league';
const PENDING_KEY = 'opakovacka:league-pending';

export const ERROR_TEXT: Record<string, string> = {
  class_not_found: 'Takový kód třídy neexistuje. Zkontroluj ho u toho, kdo ti ho dal.',
  nickname_taken: 'Tuhle přezdívku už ve třídě někdo má. Vymysli jinou.',
  nickname_invalid: 'Tuhle přezdívku nejde použít. Použij 3 až 16 písmen nebo číslic a žádná sprostá slova.',
  class_full: 'Třída je už plná. Řekni to tomu, kdo ti dal kód.',
  too_fast: 'Body se pošlou o chvilku později.',
  daily_limit: 'Na dnešek máš maximum bodů. Zítra můžeš sbírat dál.',
  unauthorized: 'Tvoje přezdívka už v soutěži není. Připoj se znovu.',
  invalid_score: 'Body se nepodařilo uložit.',
  offline: 'Teď nejde internet. Body se pošlou, až bude připojení.',
  server: 'Něco se pokazilo na serveru. Zkus to za chvíli.',
};

export class LeagueError extends Error {
  constructor(public code: string) {
    super(ERROR_TEXT[code] ?? ERROR_TEXT.server);
  }
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* úložiště není dostupné */
  }
}

export const getMembership = () => load<Membership | null>(KEY, null);

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: SUPABASE_KEY };
  // Starší klíč „anon“ (JWT) se posílá i jako Authorization, nový „sb_publishable_…“ jen jako apikey.
  if (!SUPABASE_KEY.startsWith('sb_')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    throw new LeagueError('offline');
  }
  if (!res.ok) {
    let code = 'server';
    try {
      const j = (await res.json()) as { message?: string };
      if (j.message && j.message in ERROR_TEXT) code = j.message;
    } catch {
      /* odpověď nebyla JSON */
    }
    throw new LeagueError(code);
  }
  return (await res.json()) as T;
}

export async function joinClass(code: string, nickname: string): Promise<Membership> {
  const rows = await rpc<{ player_id: string; secret: string; nickname: string; class_name: string }[]>('join_class', {
    p_code: code,
    p_nickname: nickname,
  });
  const r = rows[0];
  const m: Membership = {
    playerId: r.player_id,
    secret: r.secret,
    nickname: r.nickname,
    classCode: code.trim().toUpperCase(),
    className: r.class_name,
  };
  save(KEY, m);
  return m;
}

export async function fetchLeaderboard(code: string): Promise<LeaderboardRow[]> {
  const m = getMembership();
  return rpc<LeaderboardRow[]>('leaderboard', { p_code: code, p_player: m?.playerId ?? null });
}

/** Smaže přezdívku i body z databáze a zapomene je v telefonu. */
export async function leaveClass(): Promise<void> {
  const m = getMembership();
  if (!m) return;
  await rpc<boolean>('delete_player', { p_player: m.playerId, p_secret: m.secret });
  save(KEY, null);
  save(PENDING_KEY, null);
}

async function send(m: Membership, p: Pending) {
  const rows = await rpc<{ week_points: number; total_points: number }[]>('submit_score', {
    p_player: m.playerId,
    p_secret: m.secret,
    p_quiz: p.quizId,
    p_mode: p.modeId,
    p_points: p.points,
    p_total: p.total,
  });
  return { week: Number(rows[0]?.week_points ?? 0), total: Number(rows[0]?.total_points ?? 0) };
}

/** Pošle jeden odložený výsledek (třeba z doby bez internetu). */
export async function flushPending(): Promise<void> {
  const m = getMembership();
  const queue = load<Pending[]>(PENDING_KEY, []);
  if (!m || !queue.length) return;
  try {
    await send(m, queue[0]);
    save(PENDING_KEY, queue.slice(1));
  } catch (e) {
    const code = (e as LeagueError).code;
    if (code === 'unauthorized') {
      save(KEY, null);
      save(PENDING_KEY, null);
    } else if (code !== 'offline' && code !== 'too_fast' && code !== 'server') {
      save(PENDING_KEY, queue.slice(1));
    }
  }
}

export type SubmitResult =
  | { status: 'sent'; points: number; week: number; total: number }
  | { status: 'queued'; points: number; message: string }
  | { status: 'error'; message: string };

/** Pošle body za dokončený kvíz. Vrací null, když dítě v soutěži není. */
export async function submitScore(quizId: string, modeId: string, points: number, total: number): Promise<SubmitResult | null> {
  const m = getMembership();
  if (!leagueEnabled || !m || points <= 0) return null;
  const item: Pending = { quizId, modeId, points, total: Math.min(total, 30) };
  try {
    const r = await send(m, item);
    void flushPending();
    return { status: 'sent', points, ...r };
  } catch (e) {
    const code = (e as LeagueError).code;
    if (code === 'offline' || code === 'too_fast' || code === 'server') {
      save(PENDING_KEY, [...load<Pending[]>(PENDING_KEY, []), item].slice(-20));
      return { status: 'queued', points, message: ERROR_TEXT[code] };
    }
    if (code === 'unauthorized') save(KEY, null);
    return { status: 'error', message: ERROR_TEXT[code] ?? ERROR_TEXT.server };
  }
}

/** 1 bod, 2–4 body, 0 a 5+ bodů */
export function pointsLabel(n: number): string {
  if (n === 1) return '1 bod';
  if (n >= 2 && n <= 4) return `${n} body`;
  return `${n} bodů`;
}
