import { describe, expect, it } from 'vitest';
import { czHint, judgeShort, writeHint } from './check';
import type { WriteQuestion } from './types';

const q = (answers: string[], extra: Partial<WriteQuestion> = {}): WriteQuestion => ({
  kind: 'write',
  id: 't',
  prompt: '?',
  answers,
  ...extra,
});

describe('krátké odpovědi v češtině', () => {
  const city = q(['České Budějovice']);

  it('uzná přesnou odpověď i s tečkou a mezerami navíc', () => {
    expect(judgeShort('České Budějovice', city).ok).toBe(true);
    expect(judgeShort('  České   Budějovice. ', city).ok).toBe(true);
  });
  it('malé písmeno uzná, ale upozorní', () => {
    const r = judgeShort('české budějovice', city);
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/velké písmeno/);
  });
  it('velké písmeno navíc nevadí', () => {
    const r = judgeShort('Rybníky', q(['rybníky']));
    expect(r).toEqual({ ok: true });
  });
  it('bez háčků a čárek je to skoro správně', () => {
    const r = judgeShort('Ceske Budejovice', city);
    expect(r.ok).toBe(false);
    expect(r.almost).toBe(true);
    expect(r.tip).toMatch(/háčky/);
  });
  it('drobný překlep je skoro správně', () => {
    const r = judgeShort('České Budějovce', city);
    expect(r.ok).toBe(false);
    expect(r.almost).toBe(true);
  });
  it('úplně jiná odpověď je špatně', () => {
    expect(judgeShort('Tábor', city)).toEqual({ ok: false });
  });
  it('ignoruje úvodní slovo (řeka, v, s)', () => {
    expect(judgeShort('řeka Vltava', q(['Vltava'])).ok).toBe(true);
    expect(judgeShort('v Písku', q(['Písek', 'Písku'])).ok).toBe(true);
  });
  it('u Kraje Vysočina se velké K počítá', () => {
    const strict = q(['Kraj Vysočina'], { strictCase: true });
    expect(judgeShort('Kraj Vysočina', strict).ok).toBe(true);
    const r = judgeShort('kraj Vysočina', strict);
    expect(r.ok).toBe(false);
    expect(r.almost).toBe(true);
  });

  describe('výčet', () => {
    const rivers = q(['Mže a Radbuza'], { pool: ['Mže', 'Radbuza'] });
    it('pořadí nevadí', () => {
      expect(judgeShort('Radbuza a Mže', rivers).ok).toBe(true);
      expect(judgeShort('Mže, Radbuza', rivers).ok).toBe(true);
      expect(judgeShort('mže radbuza', rivers).ok).toBe(true);
    });
    it('když něco chybí, není to správně', () => {
      const r = judgeShort('Mže', rivers);
      expect(r.ok).toBe(false);
      expect(r.tip).toMatch(/1 z 2/);
    });
    it('něco navíc, co tam nepatří, je chyba', () => {
      const r = judgeShort('Mže, Radbuza, Vltava', rivers);
      expect(r.ok).toBe(false);
      expect(r.tip).toMatch(/Vltava/);
    });
    it('stačí jen část, když to otázka chce', () => {
      const some = q(['Vltava, Otava, Lužnice'], { pool: ['Vltava', 'Otava', 'Lužnice'], need: 2 });
      expect(judgeShort('Otava a Lužnice', some).ok).toBe(true);
      expect(judgeShort('Otava', some).ok).toBe(false);
    });
    it('uzná i jiný tvar slova', () => {
      const states = q(['Německo a Rakousko'], { pool: ['Německo|Německem', 'Rakousko|Rakouskem'] });
      expect(judgeShort('S Německem a Rakouskem', states).ok).toBe(true);
    });
    it('bez háčků je to skoro správně', () => {
      const r = judgeShort('Mze a Radbuza', rivers);
      expect(r.almost).toBe(true);
      expect(r.tip).toMatch(/Mže/);
    });
  });

  it('nápověda ukáže první písmena i s háčky', () => {
    expect(czHint('České Budějovice')).toBe('Č____  B_________');
    expect(writeHint(q(['x'], { pool: ['Mže', 'Radbuza'] }))).toBe('M__,   R______');
  });
});
