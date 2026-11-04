import { Link } from 'react-router-dom';
import { activeSubjects, quizzesIn } from '../content';
import { bestForQuiz } from '../lib/progress';
import { InstallHint } from '../components/InstallHint';

/** 1 téma, 2–4 témata, 5 a víc témat */
function topicsLabel(n: number) {
  if (n === 1) return '1 téma';
  if (n >= 2 && n <= 4) return `${n} témata`;
  return `${n} témat`;
}

export function Home() {
  const subjects = activeSubjects();
  return (
    <main className="wrap screen">
      <header className="home-head">
        <p className="grade-chip">4. ročník</p>
        <h1 className="wordmark">Opakovačka</h1>
        <p className="lead">Procvičuj učivo na písemky. Po každé odpovědi se dozvíš, proč je to tak.</p>
      </header>

      <div className="covers">
        {subjects.map((s) => {
          const quizzes = quizzesIn(s.id);
          return (
            <section key={s.id} className="cover" data-subject={s.id} aria-labelledby={`subj-${s.id}`}>
              <div className="label">
                <span className="label-key">Předmět</span>
                <h2 className="label-value" id={`subj-${s.id}`}>
                  {s.name}
                </h2>
                <span className="label-meta">{topicsLabel(quizzes.length)}</span>
              </div>
              <ul className="topics">
                {quizzes.map((q) => {
                  const best = bestForQuiz(q.id);
                  return (
                    <li key={q.id}>
                      <Link className="topic" to={`/${s.id}/${q.id}`}>
                        <span className="topic-text">
                          <span className="topic-title">{q.title}</span>
                          <span className="topic-desc">{q.description}</span>
                        </span>
                        {best !== null && (
                          <span className="topic-best" title="Nejlepší výsledek">
                            {best} %
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <InstallHint />

      <footer className="foot">
        <p>Opakovačka nesbírá žádné osobní údaje. Výsledky se ukládají jen v tomto zařízení.</p>
        <p>Otázky jsou napsané podle učiva 4. ročníku základní školy.</p>
      </footer>
    </main>
  );
}
