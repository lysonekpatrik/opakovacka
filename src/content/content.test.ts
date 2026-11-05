import { describe, expect, it } from 'vitest';
import { QUIZZES, SUBJECTS } from '.';
import { judgeShort } from '../lib/check';

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
          if (q.kind === 'write') continue;
          const opts = q.kind === 'choice' ? q.options : [q.answers[0], ...q.wrongChoices];
          expect(opts.length, q.id).toBeGreaterThanOrEqual(2);
          expect(new Set(opts).size, q.id).toBe(opts.length);
        }
      });
      it('psané otázky uznají vlastní správnou odpověď', () => {
        for (const q of quiz.questions) {
          if (q.kind !== 'write') continue;
          expect(q.answers.length, q.id).toBeGreaterThan(0);
          if (q.pool) {
            const need = q.need ?? q.pool.length;
            expect(need, q.id).toBeLessThanOrEqual(q.pool.length);
            expect(new Set(q.pool).size, q.id).toBe(q.pool.length);
            const all = q.pool.map((p) => p.split('|')[0]);
            expect(judgeShort(all.slice(0, need).join(', '), q).ok, q.id).toBe(true);
            expect(judgeShort(all.slice(-need).join(' a '), q).ok, q.id).toBe(true);
          } else {
            for (const a of q.answers) expect(judgeShort(a, q).ok, `${q.id}: ${a}`).toBe(true);
          }
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
