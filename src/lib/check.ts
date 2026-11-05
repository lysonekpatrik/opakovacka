import type { Diagnosis, TranslateQuestion, WriteQuestion } from './types';

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

/* ---------- krátké odpovědi v češtině ---------- */

/** Slova, která dítě může napsat před odpověď: „řeka Vltava“, „v Písku“, „s Německem“. */
const LEAD = /^(?:řeka|řeky|město|hora|hrad|zámek|zřícenina|jezero|rybník|v|ve|na|s|se)\s+/i;

/** Sjednotí zápis české odpovědi: uvozovky, pomlčky, mezery, tečka na konci. */
export function tidy(s: string): string {
  return s
    .replace(/[„“”"']/g, '')
    .replace(/\s*[–—-]\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[.!?]+$/, '');
}

/** Bez háčků a čárek, malými písmeny. */
export const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Jak moc se odpověď shoduje: přesně, jen jiná velká písmena, chybí háčky, překlep. */
type Match = 'exact' | 'case' | 'accent' | 'typo';
const RANK: Record<Match, number> = { exact: 0, case: 1, accent: 2, typo: 3 };

interface Hit {
  m: Match;
  /** Odpověď dítěte (bez úvodního slova), se kterou se to shodlo. */
  user: string;
  /** Správný tvar, se kterým se to shodlo. */
  expected: string;
}

function matchOne(user: string, expected: string): Hit | null {
  let best: Hit | null = null;
  for (const u of new Set([user, user.replace(LEAD, '')])) {
    let m: Match | null = null;
    if (u === expected) m = 'exact';
    else if (u.toLowerCase() === expected.toLowerCase()) m = 'case';
    else if (plain(u) === plain(expected)) m = 'accent';
    else {
      const e = plain(expected);
      if (e.length >= 5 && distance(plain(u), e) <= (e.length >= 10 ? 2 : 1)) m = 'typo';
    }
    if (m && (!best || RANK[m] < RANK[best.m])) best = { m, user: u, expected };
  }
  return best;
}

function matchAny(user: string, variants: string[]): Hit | null {
  let best: Hit | null = null;
  for (const v of variants) {
    const h = matchOne(user, tidy(v));
    if (h && (!best || RANK[h.m] < RANK[best.m])) best = h;
  }
  return best;
}

/** Napsalo dítě malé písmeno tam, kde má být velké? */
function lostCapital(h: Hit): boolean {
  if (h.m !== 'case') return false;
  for (let i = 0; i < h.expected.length; i++) {
    const c = h.expected[i];
    if (c !== c.toLowerCase() && h.user[i] === c.toLowerCase()) return true;
  }
  return false;
}

const CAPITAL_TIP = (w: string) => `Pozor na velké písmeno, správně se píše ${w}.`;
const ACCENT_TIP = (w: string) => `Chybí háčky nebo čárky, správně se píše ${w}.`;
const TYPO_TIP = (w: string) => `Pozor na pravopis, správně se píše ${w}.`;

/** Rozdělí výčet „Mže a Radbuza“, „Vltava, Otava“ na jednotlivé položky. */
const splitList = (s: string) => s.split(/\s*[,;+&/]\s*|\s+(?:a|i|nebo|a také)\s+/i).map(tidy).filter(Boolean);

/** Vyhodnotí krátkou odpověď v češtině. */
export function judgeShort(raw: string, q: WriteQuestion): Diagnosis {
  const user = tidy(raw);
  if (q.pool) return judgeList(user, q, q.pool);

  const hit = matchAny(user, q.answers);
  if (!hit) return { ok: false };
  const shown = q.answers.find((a) => tidy(a) === hit.expected) ?? q.answers[0];
  if (hit.m === 'exact') return { ok: true };
  if (hit.m === 'case') {
    if (!lostCapital(hit)) return { ok: true };
    return q.strictCase ? { ok: false, almost: true, tip: CAPITAL_TIP(shown) } : { ok: true, note: CAPITAL_TIP(shown) };
  }
  if (hit.m === 'accent') return { ok: false, almost: true, tip: ACCENT_TIP(shown) };
  return { ok: false, almost: true, tip: TYPO_TIP(shown) };
}

function judgeList(user: string, q: WriteQuestion, pool: string[]): Diagnosis {
  const need = Math.min(q.need ?? pool.length, pool.length);
  const entries = pool.map((p) => p.split('|'));
  const found = new Map<number, Hit>();
  const wrong: string[] = [];

  const place = (part: string): boolean => {
    let i = -1;
    let h: Hit | null = null;
    for (let k = 0; k < entries.length; k++) {
      const hk = matchAny(part, entries[k]);
      if (hk && (!h || RANK[hk.m] < RANK[h.m])) {
        h = hk;
        i = k;
      }
    }
    if (!h) return false;
    const prev = found.get(i);
    if (!prev || RANK[h.m] < RANK[prev.m]) found.set(i, h);
    return true;
  };

  for (const part of splitList(user)) {
    if (place(part)) continue;
    // „Mže Radbuza“ bez čárky: zkusíme jednotlivá slova
    const words = part.split(' ');
    if (words.length > 1 && words.every((w) => entries.some((v) => matchAny(w, v)))) words.forEach(place);
    else wrong.push(part);
  }

  const hits = [...found.values()];
  const good = hits.filter((h) => h.m === 'exact' || h.m === 'case');
  const rough = hits.filter((h) => h.m === 'accent' || h.m === 'typo');
  const canon = (h: Hit) => entries.find((v) => v.some((x) => tidy(x) === h.expected))?.[0] ?? h.expected;

  if (!hits.length) return { ok: false };
  if (wrong.length) {
    const tip = `${wrong.join(', ')} sem nepatří.`;
    return { ok: false, almost: good.length >= need, tip };
  }
  if (good.length >= need) {
    const caps = good.filter(lostCapital).map(canon);
    return { ok: true, note: caps.length ? `Pozor na velká písmena: ${caps.join(', ')}.` : null };
  }
  if (good.length + rough.length >= need)
    return { ok: false, almost: true, tip: `Pozor na pravopis, správně se píše ${rough.map(canon).join(', ')}.` };
  return { ok: false, tip: `Správně máš ${hits.length} z ${need}. Zkus si vzpomenout i na ostatní.` };
}

/** Nápověda v češtině: první písmeno každého slova, zbytek podtržítka. */
export function czHint(text: string): string {
  return text
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).replace(/\p{L}/gu, '_'))
    .join('  ');
}

/** Nápověda k otázce s psanou odpovědí. */
export function writeHint(q: WriteQuestion): string {
  if (!q.pool) return czHint(q.answers[0]);
  const need = Math.min(q.need ?? q.pool.length, q.pool.length);
  return q.pool
    .slice(0, need)
    .map((p) => czHint(p.split('|')[0]))
    .join(',   ');
}
