import { describe, expect, it } from 'vitest';
import { QUIZZES, SUBJECTS } from '.';

// Hlídá, aby nový kvíz neobsahoval chyby v datech.
describe('obsah všech kvízů', () => {
  for (const quiz of QUIZZES) {
    describe(quiz.title, () => {
      it('patří do známého předmětu', () => {
        expect(SUBJECTS.some((s) => s.id === quiz.subject)).toBe(true);
      });
      it('má jedinečná id otázek', () => {
        const ids = quiz.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
      it('každá otázka má aspoň dvě různé možnosti', () => {
        for (const q of quiz.questions) {
          const opts = q.kind === 'choice' ? q.options : [q.answers[0], ...q.wrongChoices];
          expect(opts.length, q.id).toBeGreaterThanOrEqual(2);
          expect(new Set(opts).size, q.id).toBe(opts.length);
        }
      });
      it('každý režim vytvoří otázky', () => {
        for (const m of quiz.modes) expect(m.build().length, m.id).toBeGreaterThan(0);
      });
    });
  }
  it('id kvízů se neopakují', () => {
    const ids = QUIZZES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
