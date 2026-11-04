import { thirdPerson } from '../../lib/check';
import { balanced, shuffle, take } from '../../lib/random';
import type { ChoiceQuestion, Item, Quiz, TranslateQuestion } from '../../lib/types';

/* ------------------------------------------------------------------
   Sloveso CAN, 4. ročník
   Věty se zadávají jen česky + anglická stavba (kdo, typ věty, sloveso).
   Anglickou větu, chytáky i špatné možnosti si kvíz dopočítá sám.
------------------------------------------------------------------- */

type SentenceType = 'a' | 'n' | 'q'; // kladná, záporná, otázka

interface Sentence {
  cz: string;
  /** Kdo: u otázek malým písmenem („you“, „your brother“). */
  who: string;
  type: SentenceType;
  verb: string;
  /** Mluví se o on/ona/ono (he, she, it) – kvůli chytákům s -s. */
  third?: boolean;
  /** Can ve významu „můžu“. */
  permission?: boolean;
  alt?: string[];
  extra?: string;
}

const SENTENCES: Sentence[] = [
  { cz: 'Umím plavat.', who: 'I', type: 'a', verb: 'swim', extra: 'Swim = plavat. Swimming pool = bazén.' },
  { cz: 'Umím jezdit na kole.', who: 'I', type: 'a', verb: 'ride a bike', alt: ['I can ride a bicycle.'], extra: 'Jezdit na kole i na koni se řekne ride: ride a bike, ride a horse.' },
  { cz: 'Ona umí tancovat.', who: 'She', type: 'a', verb: 'dance', third: true, extra: 'Dance znamená tancovat i tanec. Tanečník je dancer.' },
  { cz: 'On umí hrát fotbal.', who: 'He', type: 'a', verb: 'play football', third: true, alt: ['He can play soccer.'], extra: 'U sportů se the nepíše: play football, play tennis.' },
  { cz: 'My umíme zpívat.', who: 'We', type: 'a', verb: 'sing', extra: 'Sing = zpívat, song = písnička, singer = zpěvák.' },
  { cz: 'Oni umí bruslit.', who: 'They', type: 'a', verb: 'skate', extra: 'Skate = bruslit. Brusle se řeknou skates.' },
  { cz: 'Moje sestra umí hrát na kytaru.', who: 'My sister', type: 'a', verb: 'play the guitar', third: true, extra: 'U hudebních nástrojů píšeme the: play the guitar, play the piano.' },
  { cz: 'Můj táta umí vařit.', who: 'My dad', type: 'a', verb: 'cook', third: true, alt: ['My father can cook.', 'My daddy can cook.'], extra: 'Cook znamená vařit i kuchař. A cooker je sporák!' },
  { cz: 'Pták umí létat.', who: 'A bird', type: 'a', verb: 'fly', third: true, alt: ['The bird can fly.', 'Birds can fly.'], extra: 'Fly znamená létat. A fly je ale taky moucha!' },
  { cz: 'Můj pes umí rychle běhat.', who: 'My dog', type: 'a', verb: 'run fast', third: true, extra: 'Fast = rychle. V angličtině ho dáváme až za sloveso: run fast.' },
  { cz: 'Umím mluvit anglicky.', who: 'I', type: 'a', verb: 'speak English', extra: 'Jazyky se v angličtině píšou s velkým písmenem: English, Czech.' },
  { cz: 'Ty umíš kreslit.', who: 'You', type: 'a', verb: 'draw', extra: 'Draw = kreslit tužkou. Paint = malovat barvami.' },
  { cz: 'Opice umí šplhat po stromech.', who: 'A monkey', type: 'a', verb: 'climb trees', third: true, alt: ['Monkeys can climb trees.', 'The monkey can climb trees.'], extra: 'Climb trees = šplhat po stromech. Slovíčko „po“ se nepřekládá.' },
  { cz: 'Můj bratr umí lyžovat.', who: 'My brother', type: 'a', verb: 'ski', third: true, extra: 'Ski znamená lyžovat i lyže. Lyžař je skier.' },

  { cz: 'Neumím lyžovat.', who: 'I', type: 'n', verb: 'ski', extra: "Can't je zkrácené cannot. Na písemce můžeš napsat obojí." },
  { cz: 'Neumím hrát na klavír.', who: 'I', type: 'n', verb: 'play the piano', extra: 'Piano = klavír. U nástrojů nezapomeň na the.' },
  { cz: 'Ona neumí plavat.', who: 'She', type: 'n', verb: 'swim', third: true, extra: "She = ona, he = on. U obou zůstává can't beze změny." },
  { cz: 'On neumí jezdit na koni.', who: 'He', type: 'n', verb: 'ride a horse', third: true, extra: 'Horse = kůň. Jezdit na koni = ride a horse.' },
  { cz: 'Tučňák neumí létat.', who: 'A penguin', type: 'n', verb: 'fly', third: true, alt: ["The penguin can't fly.", "Penguins can't fly."], extra: 'Tučňák je pták, ale létat neumí. Zato skvěle plave.' },
  { cz: 'Ryba neumí chodit.', who: 'A fish', type: 'n', verb: 'walk', third: true, alt: ["The fish can't walk.", "Fish can't walk."], extra: 'Walk = chodit. Fish je stejné pro jednu i více ryb.' },
  { cz: 'My neumíme vařit.', who: 'We', type: 'n', verb: 'cook', extra: "We = my. Can't zůstává pořád stejné, ať je to kdokoli." },
  { cz: 'Můj táta neumí tancovat.', who: 'My dad', type: 'n', verb: 'dance', third: true, alt: ["My father can't dance."], extra: 'Dad = táta, mum = máma.' },
  { cz: 'Moje máma neumí bruslit.', who: 'My mum', type: 'n', verb: 'skate', third: true, alt: ["My mom can't skate.", "My mother can't skate.", "My mummy can't skate."], extra: 'Mum se říká v Británii, mom v Americe. Obojí znamená máma.' },
  { cz: 'Kočka neumí mluvit.', who: 'A cat', type: 'n', verb: 'speak', third: true, alt: ["The cat can't speak.", "A cat can't talk.", "The cat can't talk.", "Cats can't speak.", "Cats can't talk."], extra: 'Speak i talk znamenají mluvit.' },

  { cz: 'Umíš plavat?', who: 'you', type: 'q', verb: 'swim', extra: 'You znamená ty i vy. Umíš? i Umíte? je proto Can you…?' },
  { cz: 'Umíš jezdit na kole?', who: 'you', type: 'q', verb: 'ride a bike', alt: ['Can you ride a bicycle?'], extra: 'Bike je zkrácené slovo bicycle.' },
  { cz: 'Umí tvůj bratr zpívat?', who: 'your brother', type: 'q', verb: 'sing', third: true, extra: 'Tvůj, tvoje = your. Můj, moje = my.' },
  { cz: 'Umí tvoje sestra hrát tenis?', who: 'your sister', type: 'q', verb: 'play tennis', third: true, extra: 'Tennis se píše se dvěma n.' },
  { cz: 'Umíte tancovat?', who: 'you', type: 'q', verb: 'dance', extra: 'Umíte (vy) i umíš (ty) se řekne stejně: Can you…?' },
  { cz: 'Umí tvůj pes skákat?', who: 'your dog', type: 'q', verb: 'jump', third: true, extra: 'Jump = skákat. Skok do dálky je long jump.' },
  { cz: 'Umí tvoje máma vařit?', who: 'your mum', type: 'q', verb: 'cook', third: true, alt: ['Can your mom cook?', 'Can your mother cook?'], extra: 'Your mum = tvoje máma.' },
  { cz: 'Umí kočky šplhat po stromech?', who: 'cats', type: 'q', verb: 'climb trees', alt: ['Can a cat climb trees?', 'Can the cat climb trees?'], extra: 'Cats = kočky. Když je jich víc, přidáme na konec -s.' },
  { cz: 'Můžu jít ven?', who: 'I', type: 'q', verb: 'go out', permission: true, alt: ['Can I go outside?'], extra: 'Ve škole se hodí: Can I go to the toilet? = Můžu jít na záchod?' },
  { cz: 'Můžu otevřít okno?', who: 'I', type: 'q', verb: 'open the window', permission: true, extra: 'Window = okno, door = dveře.' },
];

/** Krátké odpovědi: anglická otázka + česká odpověď, kterou dítě přeloží. */
const SHORT_ANSWERS = [
  { q: 'Can you swim?', cz: 'Ano, umím.', en: 'Yes, I can.', verb: 'swim', wrong: ['Yes, I do.', 'Yes, you can.', 'Yes, I cans.'], why: 'Ptá se tebe: Can you…? (Umíš…?) Odpovídáš za sebe, proto I.' },
  { q: 'Can you ski?', cz: 'Ne, neumím.', en: "No, I can't.", verb: 'ski', wrong: ["No, I don't.", 'No, I can.', "Yes, I can't."], why: "Odpovídáš za sebe (I). Ne = no, neumím = can't." },
  { q: 'Can your sister dance?', cz: 'Ano, umí.', en: 'Yes, she can.', verb: 'dance', wrong: ['Yes, he can.', 'Yes, she does.', 'Yes, I can.'], why: 'Sestra je ona, proto she.' },
  { q: 'Can your dad cook?', cz: 'Ne, neumí.', en: "No, he can't.", verb: 'cook', wrong: ["No, she can't.", "No, he doesn't.", 'No, he can.'], why: 'Táta je on, proto he.' },
  { q: 'Can birds fly?', cz: 'Ano, umí.', en: 'Yes, they can.', verb: 'fly', wrong: ['Yes, it can.', 'Yes, they do.', 'Yes, he can.'], why: 'Birds je víc ptáků, tedy oni = they.' },
  { q: 'Can penguins fly?', cz: 'Ne, neumí.', en: "No, they can't.", verb: 'fly', wrong: ['No, they can.', "No, it can't.", "No, they don't."], why: 'Penguins (tučňáci) jsou oni = they.' },
  { q: 'Can you sing?', cz: 'Ano, umíme.', en: 'Yes, we can.', verb: 'sing', wrong: ['Yes, I can.', 'Yes, you can.', 'Yes, we do.'], why: 'Umíme = my = we. Ptali se vás obou, proto odpovídáš za vás.' },
  { q: 'Can he ride a horse?', cz: 'Ano, umí.', en: 'Yes, he can.', verb: 'ride a horse', wrong: ['Yes, she can.', 'Yes, he cans.', 'Yes, he does.'], why: 'He = on.' },
  { q: 'Can I go out?', cz: 'Ano, můžeš.', en: 'Yes, you can.', verb: 'go out', wrong: ['Yes, I can.', 'Yes, you do.', 'Yes, you cans.'], why: 'Někdo se ptá: Můžu? Ty odpovídáš: Můžeš. Proto you.' },
  { q: 'Can your brother play the guitar?', cz: 'Ne, neumí.', en: "No, he can't.", verb: 'play the guitar', wrong: ["No, he doesn't.", "No, she can't.", 'No, he can.'], why: 'Bratr je on, proto he.' },
];

/** Z angličtiny do češtiny. První možnost je správná. */
const MEANINGS: { en: string; options: string[]; why: string }[] = [
  { en: "She can't ride a horse.", options: ['Ona neumí jezdit na koni.', 'Ona umí jezdit na koni.', 'Neumím jezdit na koni.', 'On neumí jezdit na koni.'], why: "She = ona, can't = neumí. Horse = kůň." },
  { en: 'Can you play the piano?', options: ['Umíš hrát na klavír?', 'Umím hrát na klavír.', 'Neumíš hrát na klavír.', 'Umíš hrát na kytaru?'], why: 'Can na začátku věty znamená otázku: Umíš…? Piano = klavír, guitar = kytara.' },
  { en: 'We can speak English.', options: ['Umíme mluvit anglicky.', 'Umím mluvit anglicky.', 'Neumíme mluvit anglicky.', 'Umíte mluvit anglicky?'], why: "We = my, proto umíme. Bez can't je to kladná věta." },
  { en: "Birds can fly, but penguins can't.", options: ['Ptáci umí létat, ale tučňáci ne.', 'Ptáci neumí létat, ale tučňáci ano.', 'Tučňáci umí létat, ale ptáci ne.', 'Ptáci i tučňáci umí létat.'], why: "But = ale. Na konci stačí can't, sloveso fly se už neopakuje." },
  { en: 'Can I open the window?', options: ['Můžu otevřít okno?', 'Můžeš otevřít okno?', 'Otevřu okno.', 'Umíš otevřít dveře?'], why: 'Tady can znamená můžu. Window = okno, door = dveře.' },
  { en: "My brother can't swim.", options: ['Můj bratr neumí plavat.', 'Moje sestra neumí plavat.', 'Můj bratr umí plavat.', 'Můj táta neumí plavat.'], why: 'Brother = bratr, sister = sestra, dad = táta.' },
  { en: 'Can your dog jump?', options: ['Umí tvůj pes skákat?', 'Umí můj pes skákat?', 'Tvůj pes umí skákat.', 'Umí tvoje kočka skákat?'], why: 'Your = tvůj, tvoje. My = můj, moje. Dog = pes, cat = kočka.' },
];

const RULES = {
  a: 'Kladná věta: kdo + <mark>can</mark> + sloveso. <b lang="en">I can swim.</b> Za can nikdy nepíšeme to.',
  a3: 'U on a ona (he, she) se can nemění: <b lang="en">She can dance.</b> Žádné cans a žádné -s na konci slovesa.',
  n: "Zápor: <mark>can't</mark>, celým slovem cannot. <b lang=\"en\">I can't ski.</b> Nikdy ne don't can.",
  q: 'Otázka: <mark>Can</mark> dáme na začátek. <b lang="en">Can you swim?</b> Žádné do.',
  sa: "Krátká odpověď: Yes, + kdo + <mark>can</mark>. No, + kdo + <mark>can't</mark>. Sloveso už opakovat nemusíš.",
  perm: '<mark>Can</mark> neznamená jen umět, ale i moct. <b lang="en">Can I go out?</b> = Můžu jít ven?',
};

const TIPS = {
  cans: 'Ke can nikdy nepřidáváme -s. I u he a she je to jen can: she can.',
  s: 'Za can je sloveso vždy v základním tvaru, bez -s. Třeba she can swim, ne she can swims.',
  to: 'Za can nikdy nepíšeme to. Správně je can swim, ne can to swim.',
  doo: "S can nepoužíváme do, does ani don't. Otázka je Can you…?, zápor I can't…",
  notcan: "Zápor se tvoří takto: can't nebo cannot. Ne not can.",
  order: 'V otázce dáváme can na začátek věty: Can you swim?',
  notq: 'Tohle není otázka. V oznamovací větě je can až za tím, kdo něco umí: I can…',
  neg: "Věta je záporná (neumím, neumí), takže potřebuješ can't.",
  pos: "Věta je kladná (umím, umí), takže stačí can. Can't by znamenalo neumí.",
  he: 'Pozor na osobu: ona = she. He znamená on.',
  she: 'Pozor na osobu: on = he. She znamená ona.',
  yesNo: 'Pozor: ano = yes, ne = no.',
};

/* ---------- stavba vět ---------- */

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerWho = (s: string) => (s === 'I' ? 'I' : s.charAt(0).toLowerCase() + s.slice(1));
const verbThird = (v: string) => {
  const [first, ...rest] = v.split(' ');
  return [thirdPerson(first), ...rest].join(' ');
};

function english(s: Sentence): string {
  if (s.type === 'a') return `${s.who} can ${s.verb}.`;
  if (s.type === 'n') return `${s.who} can't ${s.verb}.`;
  return `Can ${s.who} ${s.verb}?`;
}

function wrongChoices(s: Sentence): string[] {
  const { who: w, verb: v } = s;
  const v3 = verbThird(v);
  if (s.type === 'a')
    return s.third
      ? [`${w} cans ${v}.`, `${w} can ${v3}.`, `${w} can to ${v}.`]
      : [`${w} can to ${v}.`, `${w} can't ${v}.`, `Can ${lowerWho(w)} ${v}?`];
  if (s.type === 'n')
    return s.third
      ? [`${w} can ${v}.`, `${w} doesn't can ${v}.`, `${w} can't ${v3}.`]
      : [`${w} can ${v}.`, `${w} don't can ${v}.`, `${w} not can ${v}.`];
  return s.third
    ? [`${cap(w)} can ${v}?`, `Does ${w} can ${v}?`, `Can ${w} ${v3}?`]
    : [`${cap(w)} can ${v}?`, `Do ${w} can ${v}?`, `Can ${w} to ${v}?`];
}

function tileExtras(s: Sentence): string[] {
  const v3 = thirdPerson(s.verb.split(' ')[0]);
  if (s.type === 'a') return s.third ? ['cans', v3] : ['to', "can't"];
  if (s.type === 'n') return s.third ? ["doesn't", v3] : ["don't", 'to'];
  return s.third ? ['Does', v3] : ['Do', 'to'];
}

function ruleFor(s: Sentence): string {
  if (s.permission) return RULES.perm;
  if (s.type === 'a') return s.third ? RULES.a3 : RULES.a;
  return s.type === 'n' ? RULES.n : RULES.q;
}

const sentenceQuestions: TranslateQuestion[] = SENTENCES.map((s, i) => ({
  kind: 'translate',
  id: `veta-${i + 1}`,
  prompt: s.cz,
  answers: [english(s), ...(s.alt ?? [])],
  wrongChoices: wrongChoices(s),
  tileExtras: tileExtras(s),
  group: s.type,
  verb: s.verb,
  rule: ruleFor(s),
  extra: s.extra,
}));

const shortAnswerQuestions: TranslateQuestion[] = SHORT_ANSWERS.map((s, i) => {
  const right = new Set(s.en.replace(/[.,]/g, '').toLowerCase().split(' '));
  const extras: string[] = [];
  for (const o of s.wrong)
    for (const w of o.replace(/[.,]/g, '').split(' '))
      if (!right.has(w.toLowerCase()) && !extras.some((e) => e.toLowerCase() === w.toLowerCase())) extras.push(w);
  return {
    kind: 'translate',
    id: `odpoved-${i + 1}`,
    prompt: s.cz,
    context: s.q,
    answers: [s.en, s.en.replace(/\.$/, ` ${s.verb}.`)],
    wrongChoices: s.wrong,
    tileExtras: extras,
    group: 'sa',
    verb: s.verb,
    rule: RULES.sa,
    extra: s.why,
    extraLabel: 'Proč zrovna tahle osoba',
  };
});

const meaningQuestions: ChoiceQuestion[] = MEANINGS.map((m, i) => ({
  kind: 'choice',
  id: `vyznam-${i + 1}`,
  prompt: m.en,
  promptLang: 'en',
  options: m.options,
  optionsLang: 'cs',
  explain: m.why,
  explainLabel: 'Vysvětlení',
}));

/* ---------- typické chyby ---------- */

const DO_WORDS = ['do', 'does', 'did', "don't", "doesn't", "didn't", 'dont', 'doesnt'];

export function diagnoseCan(user: string, expected: string, q: TranslateQuestion): string | null {
  const uw = user.split(' ');
  const ew = expected.split(' ');
  const has = (w: string, arr: string[]) => arr.includes(w);

  if (has('cans', uw)) return TIPS.cans;
  if (/\bcan('t)? to\b/.test(user) && !/\bcan('t)? to\b/.test(expected)) return TIPS.to;
  if (uw.some((w) => DO_WORDS.includes(w)) && !ew.some((w) => DO_WORDS.includes(w))) return TIPS.doo;
  if (/\bnot can\b/.test(user)) return TIPS.notcan;
  if (q.verb) {
    const v3 = thirdPerson(q.verb.split(' ')[0]);
    if (has(v3, uw) && !has(v3, ew)) return TIPS.s;
  }
  const expQuestion = ew[0] === 'can';
  const userQuestion = uw[0] === 'can';
  if (expQuestion && !userQuestion && (has('can', uw) || has("can't", uw))) return TIPS.order;
  if (!expQuestion && userQuestion && q.group !== 'sa') return TIPS.notq;
  const expNeg = has("can't", ew);
  const userNeg = has("can't", uw);
  if (expNeg && !userNeg && has('can', uw)) return TIPS.neg;
  if (!expNeg && userNeg) return TIPS.pos;
  if (has('she', ew) && has('he', uw) && !has('she', uw)) return TIPS.he;
  if (has('he', ew) && has('she', uw) && !has('he', uw)) return TIPS.she;
  if ((ew[0] === 'yes' && uw[0] === 'no') || (ew[0] === 'no' && uw[0] === 'yes')) return TIPS.yesNo;
  if (q.group === 'sa') return q.extra ?? null;
  return null;
}

/* ---------- režimy ---------- */

const asItems = (qs: (TranslateQuestion | ChoiceQuestion)[], format: Item['format']): Item[] =>
  qs.map((q) => ({ q, format }));
const pickSentences = (n: number) => balanced(sentenceQuestions, (q) => q.group ?? '', n);

export const slovesoCan: Quiz = {
  id: 'sloveso-can',
  subject: 'anglictina',
  grade: 4,
  title: 'Sloveso CAN',
  description: 'Překlad vět: umím, neumím, umíš? A krátké odpovědi Yes, I can.',
  targetLang: 'en',
  questions: [...sentenceQuestions, ...shortAnswerQuestions, ...meaningQuestions],
  diagnose: diagnoseCan,
  modes: [
    {
      id: 'pisemka',
      name: 'Zkušební písemka',
      description: '12 úkolů jako na písemce: výběr, skládání i psaní',
      icon: 'pen',
      featured: true,
      build: () => {
        const s = pickSentences(8);
        return [
          ...asItems(take(meaningQuestions, 2), 'choice'),
          ...asItems(s.slice(0, 2), 'choice'),
          ...asItems(s.slice(2, 5), 'tiles'),
          ...shuffle([...asItems(s.slice(5, 8), 'write'), ...asItems(take(shortAnswerQuestions, 2), 'write')]),
        ];
      },
    },
    {
      id: 'vyber',
      name: 'Vyber správně',
      description: '12 otázek s výběrem z možností',
      icon: 'list',
      build: () =>
        shuffle([
          ...asItems(pickSentences(6), 'choice'),
          ...asItems(take(shortAnswerQuestions, 3), 'choice'),
          ...asItems(take(meaningQuestions, 3), 'choice'),
        ]),
    },
    {
      id: 'skladani',
      name: 'Poskládej větu',
      description: '12 vět poskládaných ze slovíček',
      icon: 'blocks',
      build: () => shuffle([...asItems(pickSentences(9), 'tiles'), ...asItems(take(shortAnswerQuestions, 3), 'tiles')]),
    },
    {
      id: 'psani',
      name: 'Napiš překlad',
      description: '12 vět, které napíšeš celé',
      icon: 'keyboard',
      build: () => shuffle([...asItems(pickSentences(9), 'write'), ...asItems(take(shortAnswerQuestions, 3), 'write')]),
    },
  ],
  cheatsheet: [
    {
      type: 'rules',
      title: 'Tahák: jak na can',
      rules: [
        { label: 'Kladná věta', example: 'I <mark>can</mark> swim.', translation: 'Umím plavat.', tip: 'Za can hned sloveso, bez to.' },
        { label: 'On, ona', example: 'She <mark>can</mark> dance.', translation: 'Ona umí tancovat.', tip: 'Can se nemění. Žádné cans ani dances.' },
        { label: 'Zápor', example: "I <mark>can't</mark> ski.", translation: 'Neumím lyžovat.', tip: "can't = cannot. Nikdy don't can." },
        { label: 'Otázka', example: '<mark>Can</mark> you swim?', translation: 'Umíš plavat?', tip: 'Can jde na začátek. Žádné do.' },
        { label: 'Krátká odpověď', example: "Yes, I <mark>can</mark>. / No, I <mark>can't</mark>.", translation: 'Ano, umím. / Ne, neumím.', tip: 'Sloveso se už neopakuje.' },
        { label: 'Can = můžu', example: '<mark>Can</mark> I go out?', translation: 'Můžu jít ven?', tip: 'Can znamená umět i moct.' },
      ],
    },
    {
      type: 'vocab',
      title: 'Co umíme',
      lang: 'en',
      pairs: [
        ['swim', 'plavat'], ['run', 'běhat'], ['jump', 'skákat'], ['dance', 'tancovat'], ['sing', 'zpívat'],
        ['draw', 'kreslit'], ['cook', 'vařit'], ['skate', 'bruslit'], ['ski', 'lyžovat'], ['fly', 'létat'],
        ['walk', 'chodit'], ['climb', 'šplhat, lézt'], ['speak', 'mluvit'], ['ride a bike', 'jezdit na kole'],
        ['ride a horse', 'jezdit na koni'], ['play football', 'hrát fotbal'], ['play tennis', 'hrát tenis'],
        ['play the guitar', 'hrát na kytaru'], ['play the piano', 'hrát na klavír'], ['go out', 'jít ven'],
        ['open the window', 'otevřít okno'],
      ],
    },
    {
      type: 'vocab',
      title: 'Kdo',
      lang: 'en',
      pairs: [
        ['I', 'já'], ['you', 'ty, vy'], ['he', 'on'], ['she', 'ona'], ['we', 'my'], ['they', 'oni'],
        ['my mum', 'moje máma'], ['my dad', 'můj táta'], ['my sister', 'moje sestra'], ['my brother', 'můj bratr'],
        ['your', 'tvůj, tvoje'], ['a bird', 'pták'], ['a penguin', 'tučňák'], ['a fish', 'ryba'],
        ['a monkey', 'opice'], ['a cat', 'kočka'], ['a dog', 'pes'],
      ],
    },
  ],
};
