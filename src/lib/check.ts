import type { Diagnosis, TranslateQuestion } from './types';

export type Diagnose = (user: string, expected: string, q: TranslateQuestion) => string | null;

export const GENERIC_TIPS = {
  article: 'Chybí jen malé slovíčko a nebo the. Porovnej se správnou větou.',
  wordorder: 'Slova máš správná, jen jsou v jiném pořadí. Porovnej se správnou větou.',
  incomplete: 'Věta ještě není celá, některá slova chybí.',
  apostrophe: "Jen nezapomeň na apostrof: can't.",
  capitalI: 'Já se anglicky píše vždy velkým písmenem: I.',
};

/** Sjednotí zápis, aby se porovnával jen obsah: malá písmena, apostrofy, bez interpunkce. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\bcannot\b/g, "can't")
    .replace(/\bcan not\b/g, "can't")
    .replace(/[.,!?;:"„“]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Levenshteinova vzdálenost: kolik písmen je potřeba změnit, aby byla slova stejná. */
export function distance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Tvar slovesa pro he/she: swim → swims, fly → flies, watch → watches. */
export function thirdPerson(word: string): string {
  if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + 'ies';
  if (/(s|sh|ch|x|o)$/.test(word)) return word + 'es';
  return word + 's';
}

const PROTECTED = new Set(['can', "can't", 'cant', 'cans', 'he', 'she', 'i', 'you', 'we', 'they', 'it', 'yes', 'no', 'a', 'an', 'the', 'my', 'your', 'do', 'does', 'to', 'not']);

/** Pozná překlep v jednom delším slově (gitar → guitar). Vrací správné slovo, nebo null. */
export function findTypo(user: string, expected: string): string | null {
  const uw = user.split(' ');
  const ew = expected.split(' ');
  if (uw.length !== ew.length) return null;
  const diff = ew.map((w, k) => (w !== uw[k] ? k : -1)).filter((k) => k >= 0);
  if (diff.length !== 1) return null;
  const w = ew[diff[0]];
  const x = uw[diff[0]];
  if (w.length < 4 || PROTECTED.has(w) || PROTECTED.has(x)) return null;
  if (x === w + 's' || x === w + 'es' || x === thirdPerson(w)) return null;
  return distance(x, w) <= (w.length >= 7 ? 2 : 1) ? w : null;
}

const stripArticles = (s: string) =>
  s.split(' ').filter((w) => w !== 'a' && w !== 'an' && w !== 'the').join(' ');
const sameWords = (a: string, b: string) =>
  a.split(' ').sort().join(' ') === b.split(' ').sort().join(' ');

function originalWord(q: TranslateQuestion, lower: string): string {
  const words = q.answers[0].replace(/[.,!?]/g, '').split(' ');
  return words.find((w) => w.toLowerCase() === lower) ?? lower;
}

function closest(user: string, accepted: string[]): string {
  let best = accepted[0];
  let bestD = Infinity;
  for (const a of accepted) {
    const d = distance(user, a);
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return best;
}

/**
 * Vyhodnotí přeloženou větu.
 * `fromTiles` = věta poskládaná ze slovíček (překlepy tam vzniknout nemůžou).
 */
export function judgeTranslation(
  raw: string,
  q: TranslateQuestion,
  diagnose?: Diagnose,
  fromTiles = false,
): Diagnosis {
  const user = normalize(raw).replace(/\bcant\b/g, "can't");
  const accepted = q.answers.map(normalize);
  const notes: string[] = [];

  if (!fromTiles && /\bcant\b/i.test(raw)) notes.push(GENERIC_TIPS.apostrophe);
  if (!fromTiles && /(^|[\s,.!?])i(?=[\s,.!?']|$)/.test(raw)) notes.push(GENERIC_TIPS.capitalI);
  const note = notes.length ? notes.join(' ') : null;

  if (accepted.includes(user)) return { ok: true, note };

  const expected = closest(user, accepted);
  const tip = diagnose?.(user, expected, q) ?? null;
  if (tip) return { ok: false, tip, note };
  if (stripArticles(user) === stripArticles(expected)) return { ok: false, almost: true, tip: GENERIC_TIPS.article, note };
  if (sameWords(user, expected)) return { ok: false, almost: true, tip: GENERIC_TIPS.wordorder, note };
  const ew = expected.split(' ');
  const uw = user.split(' ');
  if (uw.length < ew.length && uw.every((w) => ew.includes(w))) return { ok: false, tip: GENERIC_TIPS.incomplete, note };

  if (!fromTiles) {
    const typo = findTypo(user, expected);
    if (typo) {
      const spelling = `Jen pozor na pravopis, správně se píše ${originalWord(q, typo)}.`;
      return { ok: true, note: note ? `${spelling} ${note}` : spelling };
    }
  }
  return { ok: false, tip: null, note };
}

/** Nápověda: první písmeno každého slova, zbytek podtržítka. */
export function hintFor(sentence: string): string {
  return sentence
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).replace(/[A-Za-z]/g, '_'))
    .join('  ');
}

/** Slova pro skládání (bez interpunkce). */
export function tileWords(sentence: string): string[] {
  return sentence.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
}
