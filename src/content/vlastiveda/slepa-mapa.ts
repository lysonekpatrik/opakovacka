import { shuffle } from '../../lib/random';
import type { FindQuestion, Item, Mode, Question, Quiz, WriteQuestion } from '../../lib/types';
import { KRAJE, KRAJ_NAMES, type KrajId } from './kraje-data';

/* ------------------------------------------------------------------
   Slepá mapa ČR: kraje na mapě.
   Lehčí: kraj je napsaný a dítě na něj klikne na mapě.
   Těžší: kraj je na mapě vybarvený a dítě napíše jeho celý název.
   Mapa je v mapa-kraju.ts (data ČÚZK), sousedé krajů ověřené z mapy.
------------------------------------------------------------------- */

const LABEL = 'Víš, že…?';

/** [kde hledat (nápověda), Víš, že…?] */
const POLOHA: Record<KrajId, [string, string]> = {
  praha: [
    'Hledej malý kraj uprostřed Čech.',
    'Hlavní město Praha je nejmenší kraj. Leží uprostřed Čech a ze všech stran ho obklopuje Středočeský kraj.',
  ],
  stredocesky: [
    'Hledej velký kraj uprostřed Čech, kolem Prahy.',
    'Středočeský kraj je největší kraj v Česku. Obklopuje Prahu a nesousedí s žádným cizím státem. Jeho krajským městem je Praha.',
  ],
  karlovarsky: [
    'Hledej úplně na západě republiky.',
    'Karlovarský kraj je nejzápadnější kraj. Sousedí s Německem a jen se dvěma kraji: Plzeňským a Ústeckým. Krajské město jsou Karlovy Vary.',
  ],
  ustecky: [
    'Hledej na severu Čech, u hranic s Německem.',
    'Ústecký kraj leží na severu Čech a protéká jím Labe. Hranici s Německem tvoří Krušné hory. Krajské město je Ústí nad Labem.',
  ],
  liberecky: [
    'Hledej na severu Čech, mezi Německem a Polskem.',
    'Liberecký kraj vybíhá na sever mezi Německo a Polsko. Krajské město je Liberec pod horou Ještěd.',
  ],
  kralovehradecky: [
    'Hledej na severovýchodě Čech, u hranic s Polskem.',
    'Královéhradecký kraj leží u hranic s Polskem. Na jeho severu jsou Krkonoše se Sněžkou. Krajské město je Hradec Králové.',
  ],
  pardubicky: [
    'Hledej na východě Čech, pod Královéhradeckým krajem.',
    'Pardubický kraj leží na východě Čech mezi Královéhradeckým krajem a Vysočinou. Na severovýchodě sousedí s Polskem. Krajské město jsou Pardubice.',
  ],
  olomoucky: [
    'Hledej na Moravě dlouhý úzký kraj, který začíná u Polska.',
    'Olomoucký kraj je dlouhý a úzký. Táhne se od hranic s Polskem na severu až do středu Moravy. Krajské město je Olomouc.',
  ],
  moravskoslezsky: [
    'Hledej úplně na východě republiky.',
    'Moravskoslezský kraj je nejvýchodnější kraj. Sousedí s Polskem i se Slovenskem. Krajské město je Ostrava.',
  ],
  zlinsky: [
    'Hledej na jihovýchodě Moravy, u hranic se Slovenskem.',
    'Zlínský kraj leží na jihovýchodě Moravy u hranic se Slovenskem. Krajské město je Zlín.',
  ],
  jihomoravsky: [
    'Hledej na jihu Moravy, u hranic s Rakouskem.',
    'Jihomoravský kraj leží na jihu Moravy. Sousedí s Rakouskem a se Slovenskem. Krajské město je Brno.',
  ],
  vysocina: [
    'Hledej uprostřed republiky, na pomezí Čech a Moravy.',
    'Kraj Vysočina leží mezi Čechami a Moravou a nesousedí s žádným cizím státem. Krajské město je Jihlava.',
  ],
  jihocesky: [
    'Hledej na jihu Čech, u hranic s Rakouskem.',
    'Jihočeský kraj je po Středočeském druhý největší. Na jihu sousedí s Rakouskem, na západě s Německem. Krajské město jsou České Budějovice.',
  ],
  plzensky: [
    'Hledej na západě Čech, u hranic s Německem.',
    'Plzeňský kraj leží na západě Čech a celou západní stranou sousedí s Německem. Krajské město je Plzeň.',
  ],
};

const IDS = KRAJE.map((k) => k.id);

const findQuestions: FindQuestion[] = IDS.map((id) => ({
  kind: 'find',
  id: `najdi-${id}`,
  prompt: `Klikni na mapě na ${KRAJ_NAMES[id]}.`,
  region: id,
  answers: [KRAJ_NAMES[id]],
  hint: POLOHA[id][0],
  section: 'najdi',
  explain: POLOHA[id][1],
  explainLabel: LABEL,
}));

const writeQuestions: WriteQuestion[] = IDS.map((id) => ({
  kind: 'write',
  id: `napis-${id}`,
  prompt: 'Který kraj je na mapě vybarvený? Napiš jeho celý název.',
  answers: [KRAJ_NAMES[id]],
  map: id,
  // Kraj Vysočina: velké K je pravopisné pravidlo z učebnice.
  strictCase: id === 'vysocina',
  section: 'napis',
  explain: POLOHA[id][1],
  explainLabel: LABEL,
}));

const questions: Question[] = [...findQuestions, ...writeQuestions];

const items = (qs: Question[]): Item[] => qs.map((q) => ({ q, format: q.kind === 'write' ? 'write' : 'choice' }));

const sections: NonNullable<Quiz['sections']> = [
  { id: 'najdi', name: 'Najdi kraj na mapě', icon: 'pin' },
  { id: 'napis', name: 'Napiš název kraje', icon: 'keyboard' },
];

const modes: Mode[] = [
  {
    id: 'mix',
    name: 'Mix ze všeho',
    description: 'Všech 14 krajů, někdy klikáš a někdy píšeš',
    icon: 'mix',
    featured: true,
    build: () =>
      items(shuffle(IDS.map((_, i) => (Math.random() < 0.5 ? findQuestions[i] : writeQuestions[i])))),
  },
  {
    id: 'najdi',
    name: 'Najdi kraj na mapě',
    description: 'Lehčí: kraj je napsaný, klikni na něj na mapě',
    icon: 'pin',
    build: () => items(shuffle(findQuestions)),
  },
  {
    id: 'napis',
    name: 'Napiš název kraje',
    description: 'Těžší: kraj je vybarvený, napiš jeho celý název',
    icon: 'keyboard',
    build: () => items(shuffle(writeQuestions)),
  },
];

export const slepaMapa: Quiz = {
  id: 'slepa-mapa',
  subject: 'vlastiveda',
  grade: 4,
  title: 'Slepá mapa ČR',
  description: 'Najdi kraje na slepé mapě a napiš jejich celé názvy.',
  sections,
  questions,
  modes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'Česká republika má 14 krajů. Název kraje píšeme celý a s velkým písmenem na začátku: Jihočeský kraj, Zlínský kraj. Dva kraje se jmenují jinak: Hlavní město Praha a Kraj Vysočina (s velkým K).',
    },
    {
      type: 'map',
      title: 'Mapa krajů',
      items: KRAJE.map((k): [string, string] => [k.id, k.id === 'praha' ? k.name : `${k.name} (${k.city})`]),
    },
  ],
};
