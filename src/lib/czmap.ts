import { KRAJ_NAMES, type KrajId } from '../content/vlastiveda/kraje-data';
import { distance, judgeShort, plain, tidy } from './check';
import type { Diagnosis, WriteQuestion } from './types';

/** Jádro názvu kraje bez slov „kraj“ a „hlavní město“: „jihocesky“, „praha“, „vysocina“. */
const core = (s: string) =>
  plain(tidy(s))
    .replace(/\bkraj[ei]?\b/g, ' ')
    .replace(/\bhlavni\s+mesto\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const CORES = (Object.keys(KRAJ_NAMES) as KrajId[]).map((id) => [id, core(KRAJ_NAMES[id])] as const);

/** Který kraj dítě napsalo (i bez slova „kraj“ a s drobnou chybou). Jinak null. */
export function findKraj(text: string): KrajId | null {
  const c = core(text);
  if (!c) return null;
  for (const [id, k] of CORES) if (c === k) return id;
  for (const [id, k] of CORES) if (k.length >= 6 && distance(c, k) <= 1) return id;
  return null;
}

/**
 * Vyhodnotí název kraje na slepé mapě. Navíc vrátí kraj, který dítě napsalo,
 * když je to jiný kraj, aby se dal ukázat na mapě.
 */
export function judgeMapName(raw: string, q: WriteQuestion): { res: Diagnosis; named: KrajId | null } {
  const res = judgeShort(raw, q);
  if (res.ok || res.almost) return { res, named: null };
  const named = findKraj(raw);
  if (named && named === q.map)
    return { res: { ok: false, almost: true, tip: `Napiš celý název kraje: ${q.answers[0]}.` }, named: null };
  if (named) return { res: { ok: false, tip: `${KRAJ_NAMES[named]} je na mapě červeně. Hledaný kraj je zelený.` }, named };
  return { res, named: null };
}
