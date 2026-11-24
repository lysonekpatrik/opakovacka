import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Question, Quiz, WriteQuestion } from '../../lib/types';
import { JIHOCESKY, JIHOMORAVSKY, KARLOVARSKY, KRALOVEHRADECKY, KRAJ_NAMES, KRAJE, LIBERECKY, MORAVSKOSLEZSKY, OLOMOUCKY, PARDUBICKY, PLZENSKY, PRAHA, STREDOCESKY, USTECKY, VYSOCINA, ZLINSKY, type Kraj, type KrajId } from './kraje-data';

/* ------------------------------------------------------------------
   Kvízy o krajích ČR. Učivo je v kraje-data.ts, tady se z něj
   skládají otázky a režimy.
------------------------------------------------------------------- */

const LABEL = 'Víš, že…?';

/** Otázky o jednom kraji: krajské město (psaní), psané otázky a výběr z možností. */
function krajQuestions(k: Kraj, section: string): Question[] {
  const city: WriteQuestion = {
    kind: 'write',
    id: `${k.id}-mesto`,
    prompt: `Napiš krajské město ${k.gen}.`,
    answers: [k.city, ...(k.cityAlts ?? [])],
    section,
    explain: k.cityNote,
    explainLabel: LABEL,
  };
  const written: WriteQuestion[] = k.write.map(([prompt, a, explain, school], i) => {
    const o = Array.isArray(a) ? { answers: a } : a;
    return {
      kind: 'write',
      id: `${k.id}-w${i + 1}`,
      prompt,
      answers: o.answers ?? [o.show ?? ''],
      pool: o.pool,
      need: o.need,
      strictCase: o.strictCase,
      section,
      school: !!school,
      explain,
      explainLabel: LABEL,
    };
  });
  const chosen: ChoiceQuestion[] = k.choice.map(([prompt, options, explain, school], i) => ({
    kind: 'choice',
    id: `${k.id}-${i + 1}`,
    prompt,
    options,
    section,
    school: !!school,
    explain,
    explainLabel: LABEL,
  }));
  return [...(k.noCity ? [] : [city]), ...written, ...chosen];
}

/**
 * Otázky „Ve kterém kraji to je?“. Špatné možnosti jsou nejdřív kraje,
 * které se učí spolu (`prefer`), pak sousední kraje.
 */
function whereQuestions(kraje: Kraj[], prefer: KrajId[], section: string): ChoiceQuestion[] {
  return kraje.flatMap((k) => {
    const wrong = [...new Set([...prefer, ...k.near])].filter((id) => id !== k.id).slice(0, 3);
    return k.where.map(([prompt, explain], i) => ({
      kind: 'choice' as const,
      id: `kde-${k.id}-${i + 1}`,
      prompt,
      options: [k.name, ...wrong.map((id) => KRAJ_NAMES[id])],
      section,
      explain,
      explainLabel: LABEL,
    }));
  });
}

const items = (qs: Question[]): Item[] => qs.map((q) => ({ q, format: q.kind === 'write' ? 'write' : 'choice' }));
const pick = <T,>(qs: T[], n: number) => shuffle(qs).slice(0, n);
const sectionOf = (q: Question) => (q.kind === 'translate' ? undefined : q.section);

/* ---------- Písemka z několika krajů (jak se učí ve škole) ---------- */

type IconName = NonNullable<Quiz['sections']>[number]['icon'];

interface PisemkaOpts {
  id: string;
  title: string;
  description: string;
  /** Kraje v pořadí, v jakém jsou v učebnici, a ikona jejich části. */
  kraje: [Kraj, IconName][];
  /** Kolik otázek z každého kraje dát do písemky nanečisto a kolik „Ve kterém kraji“. */
  test: { choice: number; write: number; kde: number };
  /** „tří“, „čtyř“: do popisu písemky. */
  count: string;
}

/** Kvíz na písemku z několika krajů: každý kraj má svou část, k tomu „Ve kterém kraji to je?“. */
function pisemkaQuiz({ id, title, description, kraje, test, count }: PisemkaOpts): Quiz {
  const ks = kraje.map(([k]) => k);
  const sections: NonNullable<Quiz['sections']> = [
    ...kraje.map(([k, icon]) => ({ id: k.id, name: k.name, icon })),
    { id: 'kde', name: 'Ve kterém kraji to je?', icon: 'pin' },
  ];
  const questions: Question[] = [
    ...ks.flatMap((k) => krajQuestions(k, k.id)),
    ...whereQuestions(
      ks,
      ks.map((k) => k.id),
      'kde',
    ),
  ];
  const inSection = (sid: string) => questions.filter((q) => sectionOf(q) === sid);
  const written = questions.filter((q) => q.kind === 'write');
  const school = questions.filter((q) => q.kind !== 'translate' && q.school);
  const testSize = ks.length * (test.choice + test.write) + test.kde;

  /** Písemka nanečisto: z každého kraje pár otázek s možnostmi a na napsání, k tomu „Ve kterém kraji“. */
  const buildTest = () =>
    shuffle([
      ...ks.flatMap((k) => {
        const qs = inSection(k.id);
        return [...pick(qs.filter((q) => q.kind === 'choice'), test.choice), ...pick(qs.filter((q) => q.kind === 'write'), test.write)];
      }),
      ...pick(inSection('kde'), test.kde),
    ]);

  const modes: Mode[] = [
    {
      id: 'mix',
      name: 'Mix ze všeho',
      description: `${sections.length * 4} otázek, z každé části čtyři`,
      icon: 'mix',
      featured: true,
      build: () => shuffle(sections.flatMap((s) => items(pick(inSection(s.id), 4)))),
    },
    {
      id: 'pisemka',
      name: 'Písemka nanečisto',
      description: `${testSize} otázek ze všech ${count} krajů, i s psaním`,
      icon: 'pen',
      build: () => items(buildTest()),
    },
    {
      id: 'napis',
      name: 'Napiš správně',
      description: `${written.length} odpovědí na napsání, hlídá i pravopis`,
      icon: 'keyboard',
      build: () => shuffle(items(written)),
    },
    {
      id: 'ucebnice',
      name: 'Otázky z učebnice',
      description: `${school.length} otázek z rámečků Zjisti a Vyhledej`,
      icon: 'sheet',
      build: () => shuffle(items(school)),
    },
    ...sections.map((s) => ({
      id: s.id,
      name: s.name,
      description: `${inSection(s.id).length} otázek`,
      icon: s.icon,
      build: () => shuffle(items(inSection(s.id))),
    })),
  ];

  return {
    id,
    subject: 'vlastiveda',
    grade: 4,
    title,
    description,
    sections,
    questions,
    modes,
    cheatsheet: [
      {
        type: 'note',
        title: 'Zapamatuj si',
        text: 'U každého kraje umět: krajské město, se kterými státy sousedí, hlavní řeky a hory, čím je kraj známý a jeho nejslavnější památky. Názvy měst, řek a hor píšeme s velkým písmenem.',
      },
      ...ks.map((k) => ({ type: 'note' as const, title: k.name, text: k.memo })),
    ],
  };
}

export const jihoceskyPlzenskyVysocina = pisemkaQuiz({
  id: 'jihocesky-plzensky-vysocina',
  title: 'Jihočeský, Plzeňský kraj a Vysočina',
  description: 'Na písemku: krajská města, řeky, sousední státy, památky a zajímavosti tří krajů.',
  kraje: [
    [JIHOCESKY, 'fish'],
    [PLZENSKY, 'castle'],
    [VYSOCINA, 'mountain'],
  ],
  test: { choice: 3, write: 2, kde: 3 },
  count: 'tří',
});

export const moravskeKraje = pisemkaQuiz({
  id: 'moravske-kraje',
  title: 'Olomoucký, Moravskoslezský, Zlínský a Jihomoravský kraj',
  description: 'Na písemku: krajská města, řeky, hory, sousední státy, památky a zajímavosti čtyř krajů na Moravě.',
  kraje: [
    [OLOMOUCKY, 'clock'],
    [MORAVSKOSLEZSKY, 'factory'],
    [ZLINSKY, 'city'],
    [JIHOMORAVSKY, 'grape'],
  ],
  test: { choice: 2, write: 2, kde: 4 },
  count: 'čtyř',
});

/* ---------- Kraje ČR: všech 14 krajů na čtvrtletní práci ---------- */

/** Části jako v učebnici: vždy dva kraje z jedné dvoustrany. */
const PAIRS: { id: string; name: string; icon: NonNullable<Quiz['sections']>[number]['icon']; kraje: Kraj[] }[] = [
  { id: 'praha-stredocesky', name: 'Praha a Středočeský kraj', icon: 'castle', kraje: [PRAHA, STREDOCESKY] },
  { id: 'karlovarsky-ustecky', name: 'Karlovarský a Ústecký kraj', icon: 'drop', kraje: [KARLOVARSKY, USTECKY] },
  { id: 'liberecky-kralovehradecky', name: 'Liberecký a Královéhradecký kraj', icon: 'mountain', kraje: [LIBERECKY, KRALOVEHRADECKY] },
  { id: 'pardubicky-olomoucky', name: 'Pardubický a Olomoucký kraj', icon: 'clock', kraje: [PARDUBICKY, OLOMOUCKY] },
  { id: 'moravskoslezsky-zlinsky', name: 'Moravskoslezský a Zlínský kraj', icon: 'factory', kraje: [MORAVSKOSLEZSKY, ZLINSKY] },
  { id: 'jihocesky-plzensky', name: 'Jihočeský a Plzeňský kraj', icon: 'fish', kraje: [JIHOCESKY, PLZENSKY] },
  { id: 'jihomoravsky-vysocina', name: 'Jihomoravský kraj a Vysočina', icon: 'grape', kraje: [JIHOMORAVSKY, VYSOCINA] },
];

const allSections: NonNullable<Quiz['sections']> = [
  { id: 'mesta', name: 'Kraje a krajská města', icon: 'city' },
  ...PAIRS.map(({ id, name, icon }) => ({ id, name, icon })),
  { id: 'kde', name: 'Ve kterém kraji to je?', icon: 'pin' },
];

/** Přehled: kolik je krajů, sousední státy, krajská města. */
const OVERVIEW: [string, string[], string][] = [
  ['Kolik krajů má Česká republika?', ['14', '7', '10', '16'], 'Mezi 14 krajů patří i Hlavní město Praha. Každý kraj má své krajské město, kde sídlí krajský úřad.'],
  ['Co je krajské město?', ['Město, kde sídlí krajský úřad', 'Největší vesnice v kraji', 'Město na hranici kraje', 'Město s nejstarším hradem'], 'Krajský úřad se stará třeba o střední školy, silnice nebo autobusy v celém kraji.'],
  ['Které tři kraje nesousedí s žádným cizím státem?', ['Praha, Středočeský kraj a Kraj Vysočina', 'Praha, Pardubický kraj a Kraj Vysočina', 'Středočeský, Olomoucký a Zlínský kraj', 'Kraj Vysočina, Jihomoravský a Zlínský kraj'], 'Všechny ostatní kraje mají hranici s Německem, Polskem, Rakouskem nebo Slovenskem.'],
  ['Které kraje sousedí se Slovenskem?', ['Jihomoravský, Zlínský a Moravskoslezský', 'Jihočeský a Plzeňský', 'Liberecký a Královéhradecký', 'Olomoucký a Pardubický'], 'Slovensko leží na východě. Do roku 1993 jsme spolu tvořili jeden stát, Československo.'],
  ['Které krajské město je největší na Moravě?', ['Brno', 'Ostrava', 'Olomouc', 'Zlín'], 'Brno je po Praze druhé největší město v Česku. Ostrava je třetí.'],
  ['Který kraj má slovo kraj na začátku názvu?', ['Kraj Vysočina', 'Jihočeský kraj', 'Hlavní město Praha', 'Zlínský kraj'], 'Kraj Vysočina je vlastní jméno, proto píšeme velké K. U ostatních krajů píšeme kraj na konci s malým k.'],
];

const overviewQuestions: Question[] = [
  ...OVERVIEW.map(([prompt, options, explain], i): ChoiceQuestion => ({
    kind: 'choice',
    id: `mesta-${i + 1}`,
    prompt,
    options,
    section: 'mesta',
    explain,
    explainLabel: LABEL,
  })),
  {
    kind: 'write',
    id: 'mesta-staty',
    prompt: 'Se kterými čtyřmi státy sousedí Česká republika?',
    answers: ['Německo, Polsko, Slovensko a Rakousko'],
    pool: ['Německo|Německem', 'Polsko|Polskem', 'Slovensko|Slovenskem', 'Rakousko|Rakouskem'],
    section: 'mesta',
    explain: 'Česko nemá moře, je to vnitrozemský stát. Nejdelší hranici má s Německem.',
    explainLabel: LABEL,
  },
  // Opačný směr: ke krajskému městu najdi kraj (Praha je krajským městem dvou krajů, proto chybí).
  ...KRAJE.filter((k) => k.city !== 'Praha').map(
    (k): ChoiceQuestion => ({
      kind: 'choice',
      id: `mesta-${k.id}`,
      prompt: `Krajským městem kterého kraje je ${k.city}?`,
      options: [k.name, ...k.near.slice(0, 3).map((id) => KRAJ_NAMES[id])],
      section: 'mesta',
      explain: k.cityNote,
      explainLabel: LABEL,
    }),
  ),
];

const allQuestions: Question[] = [
  ...overviewQuestions,
  ...PAIRS.flatMap((p) => p.kraje.flatMap((k) => krajQuestions(k, p.id))),
  ...whereQuestions(KRAJE, [], 'kde'),
];

const allIn = (id: string) => allQuestions.filter((q) => sectionOf(q) === id);
const ofKraj = (k: Kraj) => allQuestions.filter((q) => q.id.startsWith(`${k.id}-`));
const allWritten = allQuestions.filter((q) => q.kind === 'write');
const allSchool = allQuestions.filter((q) => q.kind !== 'translate' && q.school);

/** Čtvrtletka nanečisto: z každého kraje jedna otázka, k tomu přehled a „Ve kterém kraji“. */
const buildYearTest = () =>
  shuffle([...KRAJE.flatMap((k) => pick(ofKraj(k), 1)), ...pick(allIn('mesta'), 3), ...pick(allIn('kde'), 3)]);

const allModes: Mode[] = [
  {
    id: 'mix',
    name: 'Mix ze všeho',
    description: `${allSections.length * 2} otázek, z každé části dvě`,
    icon: 'mix',
    featured: true,
    build: () => shuffle(allSections.flatMap((s) => items(pick(allIn(s.id), 2)))),
  },
  {
    id: 'ctvrtletka',
    name: 'Čtvrtletka nanečisto',
    description: `${KRAJE.length + 6} otázek, ze všech 14 krajů`,
    icon: 'pen',
    build: () => items(buildYearTest()),
  },
  {
    id: 'napis',
    name: 'Napiš správně',
    description: `15 náhodných odpovědí na napsání (celkem ${allWritten.length})`,
    icon: 'keyboard',
    build: () => items(pick(allWritten, 15)),
  },
  {
    id: 'ucebnice',
    name: 'Otázky z učebnice',
    description: `15 náhodných z rámečků Zjisti a Vyhledej (celkem ${allSchool.length})`,
    icon: 'sheet',
    build: () => items(pick(allSchool, 15)),
  },
  ...allSections.map((s) => {
    const n = allIn(s.id).length;
    const max = 20;
    return {
      id: s.id,
      name: s.name,
      description: n > max ? `${max} náhodných otázek (celkem ${n})` : `${n} otázek`,
      icon: s.icon,
      build: () => items(pick(allIn(s.id), max)),
    };
  }),
];

export const krajeCr: Quiz = {
  id: 'kraje-cr',
  subject: 'vlastiveda',
  grade: 4,
  title: 'Kraje a krajská města ČR',
  description: 'Všech 14 krajů na čtvrtletní práci: krajská města, řeky, hory, sousední státy, památky a zajímavosti.',
  sections: allSections,
  questions: allQuestions,
  modes: allModes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'Česká republika má 14 krajů. Hlavní město Praha je samostatný kraj a zároveň krajské město Středočeského kraje. Kraj Vysočina jako jediný píšeme s velkým K na začátku. S cizím státem nesousedí Praha, Středočeský kraj a Kraj Vysočina.',
    },
    {
      type: 'vocab',
      title: 'Kraje a jejich krajská města',
      lang: 'cs',
      pairs: KRAJE.map((k): [string, string] => [k.name, k.id === 'praha' ? 'Praha (samostatný kraj)' : k.city]),
    },
    {
      type: 'vocab',
      title: 'Čím je který kraj známý',
      lang: 'cs',
      stack: true,
      pairs: KRAJE.map((k): [string, string] => [k.name, k.memo]),
    },
  ],
};
