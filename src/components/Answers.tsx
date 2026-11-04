import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hintFor, judgeTranslation, normalize, tileWords } from '../lib/check';
import { shuffle } from '../lib/random';
import type { Diagnosis, Item, Quiz, TranslateQuestion } from '../lib/types';

export interface AnswerProps {
  item: Item;
  quiz: Quiz;
  onAnswer: (res: Diagnosis, user: string | null) => void;
}

/* ---------- výběr z možností ---------- */

export function ChoiceAnswer({ item, quiz, onAnswer }: AnswerProps) {
  const q = item.q;
  const options = useMemo(() => {
    const texts = q.kind === 'choice' ? q.options : [q.answers[0], ...q.wrongChoices];
    return shuffle(texts.map((t, k) => ({ t, correct: k === 0 })));
  }, [q]);
  const lang = q.kind === 'choice' ? q.optionsLang ?? 'cs' : quiz.targetLang ?? 'en';
  const [picked, setPicked] = useState<number | null>(null);

  const choose = useCallback(
    (i: number) => {
      if (picked !== null || i >= options.length) return;
      setPicked(i);
      const ok = options[i].correct;
      let tip: string | null = null;
      if (!ok && q.kind === 'translate') tip = quiz.diagnose?.(normalize(options[i].t), normalize(q.answers[0]), q) ?? null;
      onAnswer({ ok, tip }, null);
    },
    [picked, options, q, quiz, onAnswer],
  );

  // klávesy 1–4 nebo A–D
  useEffect(() => {
    if (picked !== null) return;
    const keys: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = keys[e.key.toLowerCase()];
      if (k === undefined) return;
      e.preventDefault();
      choose(k);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [picked, choose]);

  return (
    <div className="options" role="group" aria-label="Možnosti odpovědi">
      {options.map((o, i) => {
        let cls = 'opt';
        if (picked !== null) cls += o.correct ? ' is-correct' : i === picked ? ' is-wrong' : ' is-dim';
        return (
          <button key={i} type="button" className={cls} disabled={picked !== null} onClick={() => choose(i)}>
            <span className="key">{'ABCD'.charAt(i)}</span>
            <span className="opt-text" lang={lang}>
              {o.t}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- skládání ze slovíček ---------- */

export function TilesAnswer({ item, quiz, onAnswer }: AnswerProps) {
  const q = item.q as TranslateQuestion;
  const bank = useMemo(() => {
    const words = tileWords(q.answers[0]);
    let b = shuffle([...words, ...q.tileExtras]);
    for (let t = 0; t < 6 && b.slice(0, words.length).join(' ') === words.join(' '); t++) b = shuffle(b);
    return b.map((w, id) => ({ id, w }));
  }, [q]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [state, setState] = useState<'open' | 'ok' | 'bad'>('open');
  const open = state === 'open';

  const check = () => {
    if (!open || !placed.length) return;
    const built = placed.map((id) => bank[id].w).join(' ');
    const res = judgeTranslation(built, q, quiz.diagnose, true);
    setState(res.ok ? 'ok' : 'bad');
    onAnswer(res, built);
  };

  return (
    <div className="tiles">
      <div className={`zone${open ? '' : state === 'ok' ? ' ok' : ' bad'}`} lang="en" aria-label="Tvoje věta">
        {placed.length === 0 && <span className="placeholder">Klepej na slovíčka ve správném pořadí.</span>}
        {placed.map((id) => (
          <button
            key={id}
            type="button"
            className="tile"
            disabled={!open}
            aria-label={`${bank[id].w}, odebrat`}
            onClick={() => setPlaced((p) => p.filter((x) => x !== id))}
          >
            {bank[id].w}
          </button>
        ))}
      </div>
      <div className="bank" lang="en">
        {bank.map((t) => {
          const used = placed.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={`tile${used ? ' used' : ''}`}
              disabled={used || !open}
              onClick={() => setPlaced((p) => [...p, t.id])}
            >
              {t.w}
            </button>
          );
        })}
      </div>
      {open && (
        <div className="row">
          <button type="button" className="ghost" disabled={!placed.length} onClick={() => setPlaced([])}>
            Smazat
          </button>
          <button type="button" className="primary" disabled={!placed.length} onClick={check}>
            Zkontrolovat
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- psaní ---------- */

export function WriteAnswer({ item, quiz, onAnswer }: AnswerProps) {
  const q = item.q as TranslateQuestion;
  const [value, setValue] = useState('');
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const [nudge, setNudge] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (done) return;
    if (!value.trim()) {
      setNudge(true);
      input.current?.focus();
      window.setTimeout(() => setNudge(false), 600);
      return;
    }
    setDone(true);
    onAnswer(judgeTranslation(value, q, quiz.diagnose), value.trim());
  };

  return (
    <form className="write" noValidate autoComplete="off" onSubmit={submit}>
      <label className="sr" htmlFor="answer-input">
        Tvůj překlad
      </label>
      <input
        id="answer-input"
        ref={input}
        className={nudge ? 'nudge' : undefined}
        type="text"
        lang="en"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="sentences"
        spellCheck={false}
        enterKeyHint="done"
        placeholder="Napiš to anglicky"
        value={value}
        readOnly={done}
        onChange={(e) => setValue(e.target.value)}
      />
      {hint && (
        <p className="hint" lang="en">
          {hintFor(q.answers[0])}
        </p>
      )}
      {!done && (
        <div className="row">
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setHint(true);
              input.current?.focus();
            }}
          >
            Nápověda
          </button>
          <button type="submit" className="primary">
            Zkontrolovat
          </button>
        </div>
      )}
    </form>
  );
}
