import { useEffect, useRef } from 'react';
import type { Diagnosis, Item, Quiz } from '../lib/types';
import { SpeakButton } from './SpeakButton';

interface Props {
  item: Item;
  quiz: Quiz;
  res: Diagnosis;
  user: string | null;
  last: boolean;
  onNext: () => void;
}

export function Feedback({ item, quiz, res, user, last, onNext }: Props) {
  const q = item.q;
  const nextRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    boxRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const correct = q.kind === 'choice' ? q.options[0] : q.answers[0];
  const correctLang = q.kind === 'choice' ? q.optionsLang ?? 'cs' : quiz.targetLang ?? 'en';
  const spoken = q.kind === 'translate' ? q.answers[0] : q.promptLang === 'en' ? q.prompt : null;
  const verdict = res.ok ? 'Správně!' : res.almost ? 'Skoro!' : 'Tentokrát ne.';
  const verdictCls = res.ok ? 'ok' : res.almost ? 'almost' : 'bad';

  return (
    <div className="feedback" ref={boxRef} aria-live="polite">
      <p className={`verdict ${verdictCls}`}>{verdict}</p>

      {!res.ok && (
        <p className="answerline">
          <span className="answerline-label">Správně je</span>
          <span className="answerline-value" lang={correctLang}>
            {correct}
          </span>
        </p>
      )}
      {!res.ok && user && item.format !== 'choice' && (
        <p className="answerline yours">
          <span className="answerline-label">Tvoje odpověď</span>
          <span className="answerline-value" lang="en">
            {user}
          </span>
        </p>
      )}
      {spoken && (
        <div className="row">
          <SpeakButton text={spoken} label="Poslechnout anglicky" />
        </div>
      )}

      {res.tip && (
        <div className="note pen">
          <span className="note-label">Pozor!</span>
          <p>{res.tip}</p>
        </div>
      )}
      {res.note && (
        <div className="note pen">
          <span className="note-label">{res.ok ? 'Drobnost' : 'A ještě'}</span>
          <p>{res.note}</p>
        </div>
      )}

      {q.kind === 'choice' && q.explain && (
        <div className="note did-you-know">
          <span className="note-label">{q.explainLabel ?? 'Víš, že…?'}</span>
          <p>{q.explain}</p>
        </div>
      )}
      {q.kind === 'choice' && q.rule && (
        <div className="note rulebox">
          <span className="note-label">Pravidlo</span>
          <p dangerouslySetInnerHTML={{ __html: q.rule }} />
        </div>
      )}
      {q.kind === 'translate' && q.rule && (
        <div className="note rulebox">
          <span className="note-label">Pravidlo</span>
          <p dangerouslySetInnerHTML={{ __html: q.rule }} />
        </div>
      )}
      {q.kind === 'translate' && q.extra && q.extra !== res.tip && (
        <div className="note extra">
          <span className="note-label">{q.extraLabel ?? 'Slovíčko navíc'}</span>
          <p>{q.extra}</p>
        </div>
      )}

      <button ref={nextRef} type="button" className="primary" onClick={onNext}>
        {last ? 'Ukázat výsledek' : 'Další otázka'}
      </button>
    </div>
  );
}
