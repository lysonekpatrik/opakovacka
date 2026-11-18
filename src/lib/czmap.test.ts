import { describe, expect, it } from 'vitest';
import { KRAJ_NAMES, type KrajId } from '../content/vlastiveda/kraje-data';
import { judgeShort } from './check';
import { findKraj, judgeMapName } from './czmap';
import type { WriteQuestion } from './types';

const q = (id: KrajId): WriteQuestion => ({
  kind: 'write',
  id: 't',
  prompt: '?',
  answers: [KRAJ_NAMES[id]],
  map: id,
  strictCase: id === 'vysocina',
});
const IDS = Object.keys(KRAJ_NAMES) as KrajId[];

describe('slepá mapa: název kraje', () => {
  it('celý název je správně, malé písmeno jen s upozorněním', () => {
    expect(judgeMapName('Jihočeský kraj', q('jihocesky')).res).toEqual({ ok: true });
    const r = judgeMapName('jihočeský kraj', q('jihocesky')).res;
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/velké písmeno/);
  });
  it('bez slova kraj je to skoro správně', () => {
    const r = judgeMapName('Jihočeský', q('jihocesky')).res;
    expect(r.ok).toBe(false);
    expect(r.almost).toBe(true);
    expect(r.tip).toMatch(/celý název kraje: Jihočeský kraj/);
    expect(judgeMapName('Praha', q('praha')).res.almost).toBe(true);
    expect(judgeMapName('Vysočina', q('vysocina')).res.almost).toBe(true);
    expect(judgeMapName('jihocesky', q('jihocesky')).res.almost).toBe(true);
  });
  it('Kraj Vysočina musí mít velké K', () => {
    expect(judgeMapName('Kraj Vysočina', q('vysocina')).res.ok).toBe(true);
    expect(judgeMapName('kraj Vysočina', q('vysocina')).res).toMatchObject({ ok: false, almost: true });
  });
  it('jiný kraj je chyba a ukáže se na mapě', () => {
    const { res, named } = judgeMapName('Plzeňský kraj', q('jihocesky'));
    expect(res.ok).toBe(false);
    expect(res.almost).toBeFalsy();
    expect(named).toBe('plzensky');
    expect(res.tip).toMatch(/Plzeňský kraj je na mapě červeně/);
  });
  it('nesmysl je prostě špatně', () => {
    expect(judgeMapName('Brno', q('jihomoravsky'))).toEqual({ res: { ok: false }, named: null });
  });
  it('pozná každý kraj podle názvu i bez slova kraj', () => {
    for (const id of IDS) {
      expect(findKraj(KRAJ_NAMES[id]), id).toBe(id);
      expect(findKraj(KRAJ_NAMES[id].replace(/ kraj$|^Kraj |^Hlavní město /, '')), id).toBe(id);
    }
  });
  it('název jednoho kraje se nikdy neuzná za jiný kraj', () => {
    for (const a of IDS)
      for (const b of IDS) if (a !== b) expect(judgeShort(KRAJ_NAMES[a], q(b)).ok, `${a} jako ${b}`).toBe(false);
  });
});
