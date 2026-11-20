import { describe, expect, it } from 'vitest';
import { FILLS, SPLITS, THREE_DIGIT, TWO_DIGIT, fillQuestions } from './pametne-deleni';

// Hlídá, aby v rozkladech a výsledcích nebyla početní chyba.
describe('pamětné dělení: data', () => {
  it('rozklady k výběru: jen jeden jde vydělit celý', () => {
    for (const [a, b, good, bad] of SPLITS) {
      expect(good[0] + good[1], `${a}`).toBe(a);
      expect(good[0] % b === 0 && good[1] % b === 0, `${a}: ${good}`).toBe(true);
      for (const [x, y] of bad) {
        expect(x + y, `${a}: ${x} + ${y}`).toBe(a);
        expect(x % b === 0 && y % b === 0, `${a}: ${x} + ${y} jde vydělit, není to chyba`).toBe(false);
      }
    }
  });

  it('příklady k výpočtu: dělí se beze zbytku a rozklad sedí', () => {
    for (const [a, b, parts, wrong] of [...TWO_DIGIT, ...THREE_DIGIT]) {
      expect(a % b, `${a} : ${b}`).toBe(0);
      expect(parts.reduce((s, p) => s + p, 0), `${a}`).toBe(a);
      for (const p of parts) expect(p % b, `${a}: ${p}`).toBe(0);
      expect(wrong, `${a} : ${b}`).not.toContain(a / b);
    }
  });

  it('doplňovačky: rozklad sedí a správná možnost je první', () => {
    FILLS.forEach(([a, b, [p1, p2]], i) => {
      expect(p1 + p2).toBe(a);
      expect(p1 % b + p2 % b).toBe(0);
      const q = fillQuestions[i];
      expect(q.options.length).toBe(4);
      const slot = i % 4;
      const expected = [p2, p1 / b, p2 / b, a / b][slot];
      expect(q.options[0], q.id).toBe(String(expected));
    });
  });
});
