import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { fetchLeaderboard, flushPending, getMembership, leagueEnabled, pointsLabel } from '../lib/league';

/** Karta „Soutěž se třídou“ na úvodní obrazovce. */
export function LeagueCard() {
  const member = getMembership();
  const [summary, setSummary] = useState<{ points: number; rank: number; players: number } | null>(null);

  useEffect(() => {
    if (!leagueEnabled || !member) return;
    let alive = true;
    (async () => {
      await flushPending();
      try {
        const rows = await fetchLeaderboard(member.classCode);
        const sorted = [...rows].sort((a, b) => b.week_points - a.week_points);
        const me = sorted.find((r) => r.is_me);
        if (!alive || !me) return;
        const rank = sorted.filter((r) => Number(r.week_points) > Number(me.week_points)).length + 1;
        setSummary({ points: Number(me.week_points), rank, players: rows.length });
      } catch {
        /* bez internetu kartu ukážeme bez čísel */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!leagueEnabled) return null;

  return (
    <Link className="league" to="/trida">
      <span className="league-icon">
        <Icon name="trophy" size={26} />
      </span>
      <span className="league-text">
        <span className="league-title">Soutěž se třídou</span>
        {member ? (
          <span className="league-desc">
            {member.nickname}, třída {member.className}
            {summary && (
              <>
                <br />
                Tento týden {pointsLabel(summary.points)}, {summary.rank}. místo z {summary.players}
              </>
            )}
          </span>
        ) : (
          <span className="league-desc">Připoj se kódem třídy a sbírej body za správné odpovědi.</span>
        )}
      </span>
    </Link>
  );
}
