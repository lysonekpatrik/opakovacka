import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizById } from '../content';
import { recordResult } from '../lib/progress';
import { gradeFor } from '../lib/grade';
import type { Diagnosis, Item, Mode, Quiz } from '../lib/types';
import { ChoiceAnswer, TilesAnswer, WriteAnswer } from '../components/Answers';
import { Feedback } from '../components/Feedback';
import { SpeakButton } from '../components/SpeakButton';
import { NotFoundQuiz } from '../components/NotFoundQuiz';

export function Play() {
  const { subjectId = '', quizId = '', modeId = '' } = useParams();
  const quiz = quizById(quizId);
  const mode = quiz?.modes.find((m) => m.id === modeId);
  if (!quiz || !mode || quiz.subject !== subjectId) return <NotFoundQuiz />;
  return <Game key={`${quiz.id}/${mode.id}`} quiz={quiz} mode={mode} />;
}

const LANG_NAME = { en: 'angličtiny', cs: 'češtiny' } as const;

function pillFor(item: Item, quiz: Quiz): string {
  const q = item.q;
  if (q.kind === 'choice' && q.section) return quiz.sections?.find((s) => s.id === q.section)?.name ?? quiz.title;
  const answer = q.kind === 'translate' && q.context;
  if (item.format === 'choice') {
    if (q.kind === 'choice') return q.promptLang === 'en' ? 'Co ta věta znamená?' : 'Vyber správnou odpověď';
    return answer ? 'Vyber správnou odpověď' : 'Vyber správný překlad';
  }
  if (item.format === 'tiles') return answer ? 'Poskládej odpověď' : 'Poskládej větu';
  return answer ? 'Odpověz anglicky' : `Přelož do ${LANG_NAME[quiz.targetLang ?? 'en']}`;
}

interface Round {
  items: Item[];
  retry: boolean;
  n: number;
}

function Game({ quiz, mode }: { quiz: Quiz; mode: Mode }) {
  const [round, setRound] = useState<Round>(() => ({ items: mode.build(), retry: false, n: 0 }));
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [missed, setMissed] = useState<Item[]>([]);
  const [answer, setAnswer] = useState<{ res: Diagnosis; user: string | null } | null>(null);
  const [done, setDone] = useState(false);
  const [quitArmed, setQuitArmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const item = round.items[idx];
  const total = round.items.length;
  const quizPath = `/${quiz.subject}/${quiz.id}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!done && item && item.format !== 'write') heading.current?.focus({ preventScroll: true });
  }, [idx, round.n, done, item]);

  useEffect(() => {
    if (!quitArmed) return;
    const t = window.setTimeout(() => setQuitArmed(false), 3000);
    return () => window.clearTimeout(t);
  }, [quitArmed]);

  const start = (items: Item[], retry: boolean) => {
    setRound((r) => ({ items, retry, n: r.n + 1 }));
    setIdx(0);
    setResults([]);
    setMissed([]);
    setAnswer(null);
    setDone(false);
  };

  const onAnswer = (res: Diagnosis, user: string | null) => {
    setAnswer({ res, user });
    setResults((r) => [...r, res.ok]);
    if (!res.ok) setMissed((m) => [...m, item]);
  };

  const next = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
      setAnswer(null);
      return;
    }
    const score = results.filter(Boolean).length;
    if (!round.retry) recordResult(quiz.id, mode.id, Math.round((score / total) * 100));
    setDone(true);
  };

  if (done) {
    const score = results.filter(Boolean).length;
    const pct = Math.round((score / total) * 100);
    const g = gradeFor(pct);
    return (
      <main className="wrap screen">
        <section className="score" aria-labelledby="score-title">
          <p className="pill">{round.retry ? 'Oprava chyb' : mode.name}</p>
          <div className="stamp" aria-hidden="true">
            {g.grade !== null && <span className="stamp-grade">{g.grade}</span>}
            <span className="stamp-word">{g.word}</span>
          </div>
          <h1 className="big" id="score-title">
            {score}
            <span className="of"> z {total}</span>
          </h1>
          <p className="score-msg">{g.message}</p>
          <div className="dots" aria-hidden="true">
            {results.map((r, i) => (
              <span key={i} className={`dot${r ? '' : ' bad'}`} />
            ))}
          </div>
        </section>

        {missed.length > 0 && (
          <section className="screen tight">
            <h2 className="section-title">Na tohle se ještě podívej</h2>
            <ol className="missed">
              {missed.map((it, i) => {
                const q = it.q;
                return (
                  <li key={i}>
                    {q.kind === 'translate' && q.context && (
                      <span className="missed-q" lang="en">
                        {q.context}
                      </span>
                    )}
                    <span className="missed-q">{q.prompt}</span>
                    <span className="missed-a">{q.kind === 'choice' ? q.options[0] : q.answers[0]}</span>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <div className="actions">
          {missed.length > 0 && (
            <button type="button" className="primary" onClick={() => start(missed, true)}>
              Opravit chyby
            </button>
          )}
          <button type="button" className="secondary" onClick={() => start(mode.build(), false)}>
            {round.retry ? 'Hrát celé znovu' : 'Hrát znovu'}
          </button>
          <Link className="secondary as-link" to={quizPath}>
            Zpět na téma
          </Link>
        </div>
      </main>
    );
  }

  const q = item.q;
  const promptLang = q.kind === 'choice' ? q.promptLang ?? 'cs' : 'cs';
  const AnswerView = item.format === 'choice' ? ChoiceAnswer : item.format === 'tiles' ? TilesAnswer : WriteAnswer;
  const key = `${round.n}-${idx}`;

  return (
    <main className="wrap screen">
      <div className="bar">
        {quitArmed ? (
          <Link className="ghost armed" to={quizPath}>
            Opravdu skončit?
          </Link>
        ) : (
          <button type="button" className="ghost" onClick={() => setQuitArmed(true)}>
            Skončit
          </button>
        )}
        <span className="pill">{pillFor(item, quiz)}</span>
        <span className="count">
          {idx + 1} / {total}
        </span>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((idx + (answer ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <article className="qcard">
        {q.kind === 'choice' && q.school && <span className="school">Ze školy</span>}
        {q.kind === 'translate' && q.context && (
          <p className="ask">
            <span className="ask-label">Otázka</span>
            <span className="ask-text" lang="en">
              {q.context}
            </span>
            <SpeakButton text={q.context} />
          </p>
        )}
        <div className="prompt">
          <h2 className="qtext" ref={heading} tabIndex={-1} lang={promptLang}>
            {q.prompt}
          </h2>
          {promptLang === 'en' && <SpeakButton text={q.prompt} />}
        </div>

        <AnswerView key={key} item={item} quiz={quiz} onAnswer={onAnswer} />

        {answer && (
          <Feedback key={`fb-${key}`} item={item} quiz={quiz} res={answer.res} user={answer.user} last={idx === total - 1} onNext={next} />
        )}
      </article>
    </main>
  );
}
