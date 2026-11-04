import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import {
  fetchLeaderboard,
  getMembership,
  joinClass,
  leagueEnabled,
  leaveClass,
  LeagueError,
  pointsLabel,
  type LeaderboardRow,
  type Membership,
} from '../lib/league';
import { cleanNickname, nicknameIdea, nicknameProblem } from '../lib/nickname';

export function ClassPage() {
  const [member, setMember] = useState<Membership | null>(() => getMembership());

  return (
    <main className="wrap screen">
      <nav className="topnav">
        <Link className="ghost back" to="/">
          <Icon name="back" size={18} />
          Všechna témata
        </Link>
      </nav>
      {!leagueEnabled ? (
        <header className="page">
          <h1 className="page-title">Soutěž se třídou</h1>
          <p className="lead">Soutěž zatím není zapnutá.</p>
        </header>
      ) : member ? (
        <Board member={member} onLeft={() => setMember(null)} />
      ) : (
        <JoinForm onJoined={setMember} />
      )}
    </main>
  );
}

function JoinForm({ onJoined }: { onJoined: (m: Membership) => void }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.trim().length < 4) return setError('Napiš kód třídy. Dostaneš ho od paní učitelky nebo od rodičů.');
    const problem = nicknameProblem(nick);
    if (problem) return setError(problem);
    setBusy(true);
    try {
      onJoined(await joinClass(code, cleanNickname(nick)));
    } catch (err) {
      setError((err as LeagueError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="page">
        <h1 className="page-title">Soutěž se třídou</h1>
        <p className="lead">
          Za každou správnou odpověď dostaneš bod. Žebříček vidí jen tvoje třída a každé pondělí začíná nový týden.
        </p>
      </header>

      <form className="join" noValidate onSubmit={submit}>
        <div className="field">
          <label htmlFor="class-code">Kód třídy</label>
          <input
            id="class-code"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="třeba 4B-K7MR"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>
        <div className="field">
          <label htmlFor="nickname">Přezdívka</label>
          <input
            id="nickname"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={16}
            placeholder="třeba Bystrá vydra 27"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <p className="field-help">Nepiš svoje skutečné jméno. Ostatní uvidí jen přezdívku.</p>
          <div className="row">
            <button type="button" className="ghost" onClick={() => setNick(nicknameIdea())}>
              Vymysli mi přezdívku
            </button>
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="primary" disabled={busy}>
          {busy ? 'Připojuji…' : 'Připojit se ke třídě'}
        </button>
        <p className="field-help">
          Ukládá se jen přezdívka a body. Přezdívka zůstane v tomhle telefonu a kdykoli ji tu můžeš smazat.
        </p>
      </form>
    </>
  );
}

type Tab = 'week' | 'total';

function Board({ member, onLeft }: { member: Membership; onLeft: () => void }) {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('week');
  const [confirmLeave, setConfirmLeave] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setRows(await fetchLeaderboard(member.classCode));
    } catch (e) {
      setError((e as LeagueError).message);
    }
  }, [member.classCode]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = rows
    ? [...rows].sort((a, b) =>
        tab === 'week'
          ? b.week_points - a.week_points || b.total_points - a.total_points
          : b.total_points - a.total_points || b.week_points - a.week_points,
      )
    : null;
  const value = (r: LeaderboardRow) => Number(tab === 'week' ? r.week_points : r.total_points);

  // stejný počet bodů = stejné místo
  const ranks: number[] = [];
  sorted?.forEach((r, i) => {
    ranks.push(i > 0 && value(r) === value(sorted[i - 1]) ? ranks[i - 1] : i + 1);
  });

  const leave = async () => {
    try {
      await leaveClass();
      onLeft();
    } catch (e) {
      setError((e as LeagueError).message);
      setConfirmLeave(false);
    }
  };

  return (
    <>
      <header className="page">
        <p className="subject-name">Třída {member.className}</p>
        <h1 className="page-title">Žebříček</h1>
        <p className="lead">
          Hraješ jako <b>{member.nickname}</b>. Za každou správnou odpověď v kterémkoli kvízu dostaneš bod.
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Období">
        <button type="button" role="tab" aria-selected={tab === 'week'} className={tab === 'week' ? 'tab on' : 'tab'} onClick={() => setTab('week')}>
          Tento týden
        </button>
        <button type="button" role="tab" aria-selected={tab === 'total'} className={tab === 'total' ? 'tab on' : 'tab'} onClick={() => setTab('total')}>
          Celkem
        </button>
      </div>

      {error && (
        <div className="install">
          <p className="form-error">{error}</p>
          <div className="row">
            <button type="button" className="ghost" onClick={load}>
              Zkusit znovu
            </button>
          </div>
        </div>
      )}

      {!sorted && !error && <p className="lead">Načítám žebříček…</p>}

      {sorted && (
        <ol className="board" aria-label={tab === 'week' ? 'Žebříček tento týden' : 'Žebříček celkem'}>
          {sorted.map((r, i) => (
            <li key={r.nickname} className={r.is_me ? 'me' : undefined}>
              <span className="board-rank">{ranks[i]}.</span>
              <span className="board-name">
                {r.nickname}
                {r.is_me && <span className="board-you"> (ty)</span>}
              </span>
              <span className="board-points">{pointsLabel(value(r))}</span>
            </li>
          ))}
        </ol>
      )}
      {sorted && sorted.every((r) => value(r) === 0) && (
        <p className="lead">{tab === 'week' ? 'Tento týden zatím nikdo nebodoval. Můžeš být první!' : 'Zatím nikdo nebodoval.'}</p>
      )}

      <div className="row">
        <Link className="primary as-link" to="/">
          Jdu procvičovat
        </Link>
      </div>

      <section className="leave">
        {confirmLeave ? (
          <>
            <p>Opravdu smazat přezdívku {member.nickname} a všechny body? Nejde to vrátit.</p>
            <div className="row">
              <button type="button" className="ghost armed" onClick={leave}>
                Ano, smazat
              </button>
              <button type="button" className="ghost" onClick={() => setConfirmLeave(false)}>
                Nechat
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="ghost" onClick={() => setConfirmLeave(true)}>
            Smazat přezdívku
          </button>
        )}
      </section>
    </>
  );
}
