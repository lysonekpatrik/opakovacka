import type { CheatBlock } from '../lib/types';
import { CzMap } from './CzMap';

/** Tahák k tématu: pravidla, slovíčka nebo poznámka „Zapamatuj si“. */
export function Cheatsheet({ blocks }: { blocks: CheatBlock[] }) {
  return (
    <div className="screen cheats">
      {blocks.map((b, i) => {
        if (b.type === 'note')
          return (
            <section key={i} className="memo">
              <h2 className="memo-title">{b.title}</h2>
              <p>{b.text}</p>
            </section>
          );
        if (b.type === 'rules')
          return (
            <details key={i} className="cheat" open>
              <summary>{b.title}</summary>
              <div className="rules">
                {b.rules.map((r) => (
                  <div key={r.label} className="rule">
                    <span className="rule-label">{r.label}</span>
                    <span className="rule-example" lang="en" dangerouslySetInnerHTML={{ __html: r.example }} />
                    <span className="rule-translation">{r.translation}</span>
                    <span className="rule-tip">{r.tip}</span>
                  </div>
                ))}
              </div>
            </details>
          );
        if (b.type === 'map')
          return (
            <details key={i} className="cheat" open>
              <summary>{b.title}</summary>
              <CzMap
                label="Mapa České republiky s očíslovanými kraji"
                numbers={Object.fromEntries(b.items.map(([id], n) => [id, n + 1]))}
              />
              <ol className="map-legend">
                {b.items.map(([id, text]) => (
                  <li key={id}>{text}</li>
                ))}
              </ol>
              <p className="map-credit">Podklad mapy: © ČÚZK, licence CC BY 4.0</p>
            </details>
          );
        return (
          <details key={i} className="cheat">
            <summary>{b.title}</summary>
            <dl className={b.stack ? 'vocab stack' : 'vocab'}>
              {b.pairs.map(([a, c]) => (
                <div key={a}>
                  <dt lang={b.lang}>{a}</dt>
                  <dd>{c}</dd>
                </div>
              ))}
            </dl>
          </details>
        );
      })}
    </div>
  );
}
