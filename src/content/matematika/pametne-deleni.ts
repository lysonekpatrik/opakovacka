import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Quiz } from '../../lib/types';

/* ------------------------------------------------------------------
   Pamětné dělení s rozkladem, 4. ročník
   Výsledky, rozklady i vysvětlení se počítají z čísel níže,
   takže v nich nemůže být početní chyba. Ručně jsou jen špatné možnosti
   (typické chyby dětí) a slovní úlohy. Kontrolu dělá pametne-deleni.test.ts.
------------------------------------------------------------------- */

const join = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} a ${xs[xs.length - 1]}`);

/** Celé vysvětlení rozkladu: rozlož, vyděl části, sečti, zkouška. */
export function steps(a: number, b: number, parts: number[]): string {
  const q = a / b;
  const partial = parts.map((p) => `${p} : ${b} = ${p / b}`);
  return (
    `Rozlož ${a} = ${parts.join(' + ')}. ` +
    `Pak ${join(partial)}. ` +
    `Sečti: ${parts.map((p) => p / b).join(' + ')} = ${q}. ` +
    `Zkouška: ${q} · ${b} = ${a}.`
  );
}

/* ---------- Jak rozložit? [dělenec, dělitel, správný rozklad, špatné rozklady] ---------- */

export type SplitRow = [number, number, [number, number], [number, number][]];

export const SPLITS: SplitRow[] = [
  [72, 3, [60, 12], [[70, 2], [50, 22], [62, 10]]],
  [96, 4, [80, 16], [[90, 6], [86, 10], [70, 26]]],
  [91, 7, [70, 21], [[90, 1], [80, 11], [60, 31]]],
  [78, 6, [60, 18], [[70, 8], [50, 28], [68, 10]]],
  [68, 4, [40, 28], [[50, 18], [30, 38], [66, 2]]],
  [84, 7, [70, 14], [[80, 4], [60, 24], [74, 10]]],
  [57, 3, [30, 27], [[50, 7], [40, 17], [37, 20]]],
  [98, 7, [70, 28], [[90, 8], [80, 18], [60, 38]]],
  [76, 4, [40, 36], [[70, 6], [50, 26], [30, 46]]],
  [87, 3, [60, 27], [[80, 7], [70, 17], [50, 37]]],
  [92, 4, [80, 12], [[90, 2], [70, 22], [50, 42]]],
];

const fmt = ([x, y]: [number, number]) => `${x} + ${y}`;

const splitQuestions: ChoiceQuestion[] = SPLITS.map(([a, b, good, bad], i) => ({
  kind: 'choice',
  id: `rozklad-${i + 1}`,
  prompt: `Počítáš ${a} : ${b}. Jak si rozložíš číslo ${a}? Obě části musí jít vydělit ${b}.`,
  options: [fmt(good), ...bad.map(fmt)],
  section: 'rozklad',
  explain: `${good[0]} : ${b} = ${good[0] / b} a ${good[1]} : ${b} = ${good[1] / b}. Dohromady ${a / b}. U ostatních rozkladů nejde aspoň jedna část vydělit ${b} beze zbytku.`,
  explainLabel: 'Jak na to',
}));

/** Otázky k postupu (bez počítání). */
const ROZKLAD_EXTRA: [string, string[], string][] = [
  [
    'Jak zkontroluješ, že 96 : 4 = 24?',
    ['Vynásobím 24 · 4 a musí vyjít 96', 'Sečtu 24 + 4 a musí vyjít 96', 'Odečtu 96 − 24 a musí vyjít 4'],
    'Násobení je opak dělení. Když 24 · 4 = 96, víme, že 96 : 4 = 24.',
  ],
  [
    'Co uděláš s výsledky obou částí rozkladu?',
    ['Sečtu je', 'Vynásobím je', 'Odečtu je', 'Vydělím je'],
    'Třeba 84 : 4 = 80 : 4 + 4 : 4 = 20 + 1 = 21. Výsledky částí na konci sečteme.',
  ],
];

const rozkladExtra: ChoiceQuestion[] = ROZKLAD_EXTRA.map(([prompt, options, explain], i) => ({
  kind: 'choice',
  id: `rozklad-postup-${i + 1}`,
  prompt,
  options,
  section: 'rozklad',
  explain,
  explainLabel: 'Jak na to',
}));

/* ---------- Doplň chybějící číslo [dělenec, dělitel, rozklad] ---------- */

export const FILLS: [number, number, [number, number]][] = [
  [64, 4, [40, 24]],
  [75, 3, [60, 15]],
  [84, 6, [60, 24]],
  [95, 5, [50, 45]],
  [72, 4, [40, 32]],
  [81, 3, [60, 21]],
  [90, 6, [60, 30]],
  [56, 4, [40, 16]],
  [84, 7, [70, 14]],
  [96, 8, [80, 16]],
  [65, 5, [50, 15]],
  [78, 3, [60, 18]],
];

/** Vybere tři různé špatné možnosti, které nejsou správné a jsou kladné. */
function pickWrong(correct: number, candidates: number[]): number[] {
  const out: number[] = [];
  for (const c of [...candidates, correct + 2, correct + 3, correct + 20]) {
    if (c > 0 && c !== correct && !out.includes(c)) out.push(c);
    if (out.length === 3) break;
  }
  return out;
}

export const fillQuestions: ChoiceQuestion[] = FILLS.map(([a, b, [p1, p2]], i) => {
  const q1 = p1 / b;
  const q2 = p2 / b;
  const q = a / b;
  const slot = i % 4;
  const shown = [String(p2), String(q1), String(q2), String(q)];
  shown[slot] = '?';
  const prompt = `Doplň číslo místo otazníku: ${a} : ${b} = ${p1} : ${b} + ${shown[0]} : ${b} = ${shown[1]} + ${shown[2]} = ${shown[3]}`;
  const [correct, candidates] = (
    [
      [p2, [p2 + 10, p2 > 10 ? p2 - 10 : p2 + 20, p2 + b]],
      [q1, [q1 + 10, q1 + 1, p1]],
      [q2, [q2 + 1, q2 > 1 ? q2 - 1 : q2 + 2, p2]],
      [q, [q + 10, q1 + p2, q - 1]],
    ] as [number, number[]][]
  )[slot];
  return {
    kind: 'choice',
    id: `dopln-${i + 1}`,
    prompt,
    options: [correct, ...pickWrong(correct, candidates)].map(String),
    section: 'dopln',
    explain: `Celý rozklad: ${a} : ${b} = ${p1} : ${b} + ${p2} : ${b} = ${q1} + ${q2} = ${q}.`,
    explainLabel: 'Jak na to',
  };
});

/* ---------- Vypočítej [dělenec, dělitel, rozklad, špatné výsledky] ---------- */

export type CalcRow = [number, number, number[], number[]];

export const TWO_DIGIT: CalcRow[] = [
  [84, 4, [80, 4], [24, 22, 20]],
  [96, 4, [80, 16], [36, 26, 22]],
  [72, 3, [60, 12], [32, 34, 21]],
  [91, 7, [70, 21], [31, 14, 12]],
  [78, 6, [60, 18], [28, 23, 12]],
  [68, 4, [40, 28], [38, 16, 18]],
  [57, 3, [30, 27], [37, 18, 21]],
  [98, 7, [70, 28], [38, 24, 12]],
  [76, 4, [40, 36], [46, 18, 21]],
  [87, 3, [60, 27], [47, 28, 19]],
  [92, 4, [80, 12], [32, 13, 24]],
  [85, 5, [50, 35], [45, 15, 18]],
  [96, 6, [60, 36], [46, 14, 18]],
  [52, 4, [40, 12], [22, 12, 14]],
];

export const THREE_DIGIT: CalcRow[] = [
  [248, 2, [200, 40, 8], [122, 142, 104]],
  [369, 3, [300, 60, 9], [133, 213, 132]],
  [432, 4, [400, 32], [18, 180, 118]],
  [156, 3, [150, 6], [62, 50, 56]],
  [624, 6, [600, 24], [14, 124, 140]],
  [255, 5, [250, 5], [55, 15, 510]],
  [735, 7, [700, 35], [15, 135, 150]],
  [816, 8, [800, 16], [12, 116, 120]],
  [144, 3, [120, 24], [64, 38, 46]],
  [963, 3, [900, 60, 3], [312, 231, 323]],
  [728, 7, [700, 28], [14, 128, 140]],
  [484, 4, [400, 80, 4], [112, 211, 122]],
];

const calc = (rows: CalcRow[], section: string): ChoiceQuestion[] =>
  rows.map(([a, b, parts, wrong], i) => ({
    kind: 'choice',
    id: `${section}-${i + 1}`,
    prompt: `${a} : ${b} = ?`,
    options: [a / b, ...wrong].map(String),
    section,
    explain: steps(a, b, parts),
    explainLabel: 'Jak na to',
  }));

/* ---------- Slovní úlohy [zadání, [správná, špatné…], vysvětlení] ---------- */

const WORD: [string, string[], string][] = [
  ['84 jablek rozdělíme rovným dílem do 4 košíků. Kolik jablek bude v jednom košíku?', ['21', '22', '24', '20'], '84 = 80 + 4. 80 : 4 = 20 a 4 : 4 = 1, dohromady 21 jablek. Zkouška: 21 · 4 = 84.'],
  ['Na výlet jede vlakem 72 dětí. V jednom kupé je místo pro 6 dětí. Kolik kupé potřebují?', ['12', '13', '11', '14'], '72 = 60 + 12. 60 : 6 = 10 a 12 : 6 = 2, dohromady 12 kupé. Zkouška: 12 · 6 = 72.'],
  ['Babička upekla 96 koláčků a spravedlivě je rozdělila mezi 8 vnoučat. Kolik koláčků dostalo každé?', ['12', '11', '14', '16'], '96 = 80 + 16. 80 : 8 = 10 a 16 : 8 = 2, dohromady 12 koláčků. Zkouška: 12 · 8 = 96.'],
  ['Kniha má 78 stran. Když přečteš každý den 6 stran, za kolik dní přečteš celou knihu?', ['13', '12', '14', '18'], '78 = 60 + 18. 60 : 6 = 10 a 18 : 6 = 3, dohromady 13 dní. Zkouška: 13 · 6 = 78.'],
  ['Provázek dlouhý 91 cm rozstřihneme na 7 stejných kousků. Jak dlouhý bude jeden kousek?', ['13 cm', '12 cm', '14 cm', '17 cm'], '91 = 70 + 21. 70 : 7 = 10 a 21 : 7 = 3, dohromady 13 cm. Zkouška: 13 · 7 = 91.'],
  ['Za 4 stejné sešity jsme zaplatili 92 Kč. Kolik stál jeden sešit?', ['23 Kč', '22 Kč', '24 Kč', '32 Kč'], '92 = 80 + 12. 80 : 4 = 20 a 12 : 4 = 3, dohromady 23 Kč. Zkouška: 23 · 4 = 92.'],
  ['V sadu roste 156 stromů ve 3 stejně dlouhých řadách. Kolik stromů je v jedné řadě?', ['52', '53', '56', '62'], '156 = 150 + 6. 150 : 3 = 50 a 6 : 3 = 2, dohromady 52 stromů. Zkouška: 52 · 3 = 156.'],
  ['Týden má 7 dní. Kolik týdnů je 98 dní?', ['14', '13', '12', '16'], '98 = 70 + 28. 70 : 7 = 10 a 28 : 7 = 4, dohromady 14 týdnů. To je víc než tři měsíce.'],
  ['Na hrad přijelo 85 turistů. Na prohlídku chodí ve skupinách po 5. Kolik bude skupin?', ['17', '16', '15', '18'], '85 = 50 + 35. 50 : 5 = 10 a 35 : 5 = 7, dohromady 17 skupin. Zkouška: 17 · 5 = 85.'],
  ['Tři kamarádi si rovným dílem rozdělili 369 Kč. Kolik dostal každý?', ['123 Kč', '133 Kč', '113 Kč', '321 Kč'], '369 = 300 + 60 + 9. Každou část vydělíme třemi: 100 + 20 + 3 = 123 Kč. Zkouška: 123 · 3 = 369.'],
  ['Trenér má 432 míčků a rozdělí je rovným dílem do 4 beden. Kolik míčků bude v jedné bedně?', ['108', '18', '180', '118'], '432 = 400 + 32. 400 : 4 = 100 a 32 : 4 = 8, dohromady 108. Pozor na nulu uprostřed! Zkouška: 108 · 4 = 432.'],
];

const wordQuestions: ChoiceQuestion[] = WORD.map(([prompt, options, explain], i) => ({
  kind: 'choice',
  id: `slovni-${i + 1}`,
  prompt,
  options,
  section: 'slovni',
  explain,
  explainLabel: 'Jak na to',
}));

/* ---------- Kvíz ---------- */

const SECTIONS: NonNullable<Quiz['sections']> = [
  { id: 'rozklad', name: 'Jak rozložit?', icon: 'split' },
  { id: 'dopln', name: 'Doplň rozklad', icon: 'blocks' },
  { id: 'dvojciferne', name: 'Dvojciferná čísla', icon: 'divide' },
  { id: 'trojciferne', name: 'Trojciferná čísla', icon: 'hundreds' },
  { id: 'slovni', name: 'Slovní úlohy', icon: 'list' },
];

export const questions: ChoiceQuestion[] = [
  ...splitQuestions,
  ...rozkladExtra,
  ...fillQuestions,
  ...calc(TWO_DIGIT, 'dvojciferne'),
  ...calc(THREE_DIGIT, 'trojciferne'),
  ...wordQuestions,
];

const items = (qs: ChoiceQuestion[]): Item[] => qs.map((q) => ({ q, format: 'choice' }));
const inSection = (id: string) => questions.filter((q) => q.section === id);

/** Písemka nanečisto: hlavně počítání, k tomu doplňování a slovní úlohy. */
const TEST_MIX: [string, number][] = [
  ['dvojciferne', 6],
  ['trojciferne', 3],
  ['dopln', 3],
  ['slovni', 3],
];
const testSize = TEST_MIX.reduce((sum, [, n]) => sum + n, 0);

const modes: Mode[] = [
  {
    id: 'mix',
    name: 'Mix ze všeho',
    description: `${SECTIONS.length * 4} otázek, z každé části čtyři`,
    icon: 'mix',
    featured: true,
    build: () => shuffle(SECTIONS.flatMap((s) => items(shuffle(inSection(s.id)).slice(0, 4)))),
  },
  {
    id: 'pisemka',
    name: 'Písemka nanečisto',
    description: `${testSize} příkladů, jako v písemce`,
    icon: 'pen',
    build: () => shuffle(TEST_MIX.flatMap(([id, n]) => items(shuffle(inSection(id)).slice(0, n)))),
  },
  ...SECTIONS.map((s) => ({
    id: s.id,
    name: s.name,
    description: `${inSection(s.id).length} otázek`,
    icon: s.icon,
    build: () => shuffle(items(inSection(s.id))),
  })),
];

export const pametneDeleni: Quiz = {
  id: 'pametne-deleni',
  subject: 'matematika',
  grade: 4,
  title: 'Pamětné dělení (rozklad)',
  description: 'Dělení zpaměti tak, že si číslo rozložíš na dvě části, které jdou snadno vydělit. Třeba 96 : 4 = 80 : 4 + 16 : 4.',
  sections: SECTIONS,
  questions,
  modes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Jak na to',
      text: '1. Rozlož dělence na dvě části, které obě jdou vydělit dělitelem. Nejlépe vezmi co nejvíc desítek. 2. Vyděl každou část zvlášť. 3. Výsledky sečti. 4. Udělej zkoušku násobením.',
    },
    {
      type: 'vocab',
      title: 'Příklady',
      lang: 'cs',
      pairs: [
        ['84 : 4', '80 : 4 + 4 : 4 = 20 + 1 = 21'],
        ['96 : 4', '80 : 4 + 16 : 4 = 20 + 4 = 24'],
        ['72 : 3', '60 : 3 + 12 : 3 = 20 + 4 = 24'],
        ['91 : 7', '70 : 7 + 21 : 7 = 10 + 3 = 13'],
        ['432 : 4', '400 : 4 + 32 : 4 = 100 + 8 = 108'],
      ],
    },
    {
      type: 'note',
      title: 'Jak se čemu říká',
      text: 'V příkladu 96 : 4 = 24 je 96 dělenec, 4 dělitel a 24 podíl. Zkouška: podíl krát dělitel musí dát dělence, 24 · 4 = 96.',
    },
  ],
};
