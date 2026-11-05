import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Question, Quiz, WriteQuestion } from '../../lib/types';
import { JIHOCESKY, KRAJ_NAMES, PLZENSKY, VYSOCINA, type Kraj, type KrajId } from './kraje-data';

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
  return [city, ...written, ...chosen];
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

/* ---------- Písemka: Jihočeský, Plzeňský kraj a Kraj Vysočina ---------- */

const TRIO = [JIHOCESKY, PLZENSKY, VYSOCINA];

const trioSections: NonNullable<Quiz['sections']> = [
  { id: 'jihocesky', name: 'Jihočeský kraj', icon: 'fish' },
  { id: 'plzensky', name: 'Plzeňský kraj', icon: 'castle' },
  { id: 'vysocina', name: 'Kraj Vysočina', icon: 'mountain' },
  { id: 'kde', name: 'Ve kterém kraji to je?', icon: 'pin' },
];

const trioQuestions: Question[] = [
  ...TRIO.flatMap((k) => krajQuestions(k, k.id)),
  ...whereQuestions(
    TRIO,
    TRIO.map((k) => k.id),
    'kde',
  ),
];

const trioIn = (id: string) => trioQuestions.filter((q) => sectionOf(q) === id);
const trioWritten = trioQuestions.filter((q) => q.kind === 'write');
const trioSchool = trioQuestions.filter((q) => q.kind !== 'translate' && q.school);

/** Písemka nanečisto: z každého kraje 3 otázky s možnostmi a 2 na napsání, k tomu 3× „Ve kterém kraji“. */
const buildTrioTest = () =>
  shuffle([
    ...TRIO.flatMap((k) => {
      const qs = trioIn(k.id);
      return [...pick(qs.filter((q) => q.kind === 'choice'), 3), ...pick(qs.filter((q) => q.kind === 'write'), 2)];
    }),
    ...pick(trioIn('kde'), 3),
  ]);

const trioModes: Mode[] = [
  {
    id: 'mix',
    name: 'Mix ze všeho',
    description: `${trioSections.length * 4} otázek, z každé části čtyři`,
    icon: 'mix',
    featured: true,
    build: () => shuffle(trioSections.flatMap((s) => items(pick(trioIn(s.id), 4)))),
  },
  {
    id: 'pisemka',
    name: 'Písemka nanečisto',
    description: '18 otázek ze všech tří krajů, i s psaním',
    icon: 'pen',
    build: () => items(buildTrioTest()),
  },
  {
    id: 'napis',
    name: 'Napiš správně',
    description: `${trioWritten.length} odpovědí na napsání, hlídá i pravopis`,
    icon: 'keyboard',
    build: () => shuffle(items(trioWritten)),
  },
  {
    id: 'ucebnice',
    name: 'Otázky z učebnice',
    description: `${trioSchool.length} otázek z rámečků Zjisti a Vyhledej`,
    icon: 'sheet',
    build: () => shuffle(items(trioSchool)),
  },
  ...trioSections.map((s) => ({
    id: s.id,
    name: s.name,
    description: `${trioIn(s.id).length} otázek`,
    icon: s.icon,
    build: () => shuffle(items(trioIn(s.id))),
  })),
];

export const jihoceskyPlzenskyVysocina: Quiz = {
  id: 'jihocesky-plzensky-vysocina',
  subject: 'vlastiveda',
  grade: 4,
  title: 'Jihočeský, Plzeňský kraj a Vysočina',
  description: 'Na písemku: krajská města, řeky, sousední státy, památky a zajímavosti tří krajů.',
  sections: trioSections,
  questions: trioQuestions,
  modes: trioModes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'U každého kraje umět: krajské město, se kterými státy sousedí, hlavní řeky a hory, čím je kraj známý a jeho nejslavnější památky. Názvy měst, řek a hor píšeme s velkým písmenem.',
    },
    ...TRIO.map((k) => ({ type: 'note' as const, title: k.name, text: k.memo })),
  ],
};
