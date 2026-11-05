import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Quiz } from '../../lib/types';

/* ------------------------------------------------------------------
   Bě/bje, vě/vje, pě, 4. ročník (doplňovací cvičení)
   Každá otázka: [zadání, [správná, špatná, špatná…], vysvětlení]
   V zadání je místo k doplnění označené podtržítkem.
   Věty jsou vymyšlené, ne opsané z učebnice.
------------------------------------------------------------------- */

type Row = [string, string[], string];

const DATA: Record<string, Row[]> = {
  be: [
    ['Na ob_d jsme měli řízek s bramborem.', ['oběd', 'objed', 'obed'], 'Ve slově oběd není předpona ob- a slovo, které začíná na je-. Proto píšeme bě. Pomůcka: Na oběd nedáváme jed!'],
    ['Na kole jsme ob_li celý rybník.', ['objeli', 'oběli', 'obeli'], 'ob + jet = objet. Když se předpona ob- potká se slovem, které začíná na je-, píšeme bje.'],
    ['Kryštof Kolumbus ob_vil Ameriku.', ['objevil', 'oběvil', 'obevil'], 'Je tu předpona ob- a slovo jevit, proto bje. Kolumbus doplul k Americe v roce 1492, ale myslel si, že je v Indii.'],
    ['Maminka ob_dnala pizzu domů.', ['objednala', 'obědnala', 'obednala'], 'ob + jednat = objednat. Stejně se píše i objednávka.'],
    ['Pes celé odpoledne b_hal po zahradě.', ['běhal', 'bjehal', 'behal'], 'Ve slově běhat žádná předpona ob- není. Kde se nepotká ob- se slovem na je-, píšeme bě.'],
    ['V zimě jezdíme na b_žkách.', ['běžkách', 'bježkách', 'bežkách'], 'Běžky mají jméno podle toho, že se na nich běží. Běh, běžet, běžec i běžky píšeme s bě.'],
    ['Nad zelím poletuje bílý motýl b_lásek.', ['bělásek', 'bjelásek', 'belásek'], 'Bělásek dostal jméno podle bílých křídel. Předpona ob- tu není, proto píšeme bě.'],
    ['Ob_ kamarádky šly spolu do kina.', ['Obě', 'Obje', 'Obe'], 'Obě znamená jedna i druhá. Píšeme bě, stejně jako se dvě píše s vě.'],
    ['Hasiči jsou ob_taví, pomáhají ve dne i v noci.', ['obětaví', 'objetaví', 'obetaví'], 'Obětavý člověk pomáhá druhým, i když ho to stojí čas a sílu. Píšeme bě, stejně jako ve slově oběť.'],
    ['Odměrkou změříme ob_m vody v hrnci.', ['objem', 'oběm', 'obem'], 'Objem nám říká, kolik se do něčeho vejde, třeba kolik litrů vody. Je tu předpona ob- a za ní je-, proto bje.'],
    ['Kluci za minutu ob_hli celé hřiště.', ['oběhli', 'objehli', 'obehli'], 'Pozor, chyták! Oběhnout znamená běžet kolem něčeho. Patří ke slovu běh, a proto píšeme bě.'],
    ['Na stavb_ pracuje velký jeřáb.', ['stavbě', 'stavbje', 'stavbe'], 'Stavba, na stavbě. Když slovo skloňujeme, po b píšeme ě. Předpona ob- tu není.'],
  ],
  ve: [
    ['Kamion nemohl v_t do úzké uličky.', ['vjet', 'vět', 'vet'], 'v + jet = vjet. Pozor, slovo vět patří ke slovu věta. Tady jde o jízdu, proto vje.'],
    ['U brány je v_zd do dvora.', ['vjezd', 'vězd', 'vezd'], 'Vjezd je místo, kudy se vjíždí dovnitř. Je to předpona v- a jezd jako ve slově jezdit, proto vje.'],
    ['Tramvaj právě v_la do zastávky.', ['vjela', 'věla', 'vela'], 'Vjela je od slova vjet (v + jet). Stejně píšeme vjel, vjeli i vjezd.'],
    ['Do batohu si dej jen potřebné v_ci.', ['věci', 'vjeci', 'veci'], 'Věc nezačíná předponou v-. Kde se nepotká v- se slovem na je-, píšeme vě.'],
    ['Na hradě stojí vysoká v_ž.', ['věž', 'vjež', 'vež'], 'Věž, věže, věžička: všechna tato slova píšeme s vě.'],
    ['Rád bych v_děl, jak to dopadne.', ['věděl', 'vjeděl', 'veděl'], 'Vědět, věda a vědec patří k sobě. Všechna se píšou s vě.'],
    ['Silný vítr ulomil v_tev.', ['větev', 'vjetev', 'vetev'], 'Větev, větvička. Písmeno v tu není předpona, patří ke slovu. Proto vě.'],
    ['Na zahradě kvete krásná kv_tina.', ['květina', 'kvjetina', 'kvetina'], 'Květina je příbuzná se slovem květ. Obě slova píšeme s vě.'],
    ['Je to nejrychlejší auto na sv_tě.', ['světě', 'svjetě', 'svetě'], 'Svět, na světě. Ve slově svět není předpona v- se slovem na je-, proto vě.'],
    ['Napiš do sešitu celou v_tu.', ['větu', 'vjetu', 'vetu'], 'Věta začíná velkým písmenem a končí tečkou, otazníkem nebo vykřičníkem. Píšeme ji s vě.'],
    ['Na hlav_ má teplou čepici.', ['hlavě', 'hlavje', 'hlave'], 'Hlava, na hlavě. Když slovo skloňujeme, po v píšeme ě.'],
    ['Do třídy přišly dv_ nové žačky.', ['dvě', 'dvje', 'dve'], 'Dvě se píše s vě, stejně jako obě s bě.'],
  ],
  pe: [
    ['Na ruce máme p_t prstů.', ['pět', 'pjet', 'pet'], 'Po p píšeme vždycky ě. Skupina pje se v českých slovech nepíše.'],
    ['Ve vaně je spousta p_ny.', ['pěny', 'pjeny', 'peny'], 'Pěna je z malých bublinek. Po p je vždycky ě.'],
    ['To je ale p_kný obrázek!', ['pěkný', 'pjekný', 'pekný'], 'Pěkný znamená hezký. Pěkně, pěkný i nejpěknější píšeme s pě.'],
    ['Do školy chodím p_šky.', ['pěšky', 'pješky', 'pešky'], 'Pěšky znamená po svých nohou. Pěšina i pěší zóna se píšou také s pě.'],
    ['Babička p_stuje na zahradě rajčata.', ['pěstuje', 'pjestuje', 'pestuje'], 'Pěstovat znamená starat se o rostliny, aby rostly. Pěstujeme zeleninu, ovoce i květiny.'],
    ['V hudební výchově nás baví zp_v.', ['zpěv', 'zpjev', 'zpev'], 'Zpěv, zpěvák, zpěvačka: všude pě. Pozor, ve slově zpívat je í.'],
    ['Ráno jsme museli sp_chat na autobus.', ['spěchat', 'spjechat', 'spechat'], 'Spěchat znamená moc pospíchat. Spěch i spěchat píšeme s pě.'],
    ['Z diktátu jsem nedostal p_tku, ale jedničku.', ['pětku', 'pjetku', 'petku'], 'Pětka je od slova pět. Pětka, pětina i pětiletý se píšou s pě.'],
    ['Na líp_ sedí kos.', ['lípě', 'lípje', 'lípe'], 'Lípa, na lípě. I ve tvarech slov je po p vždycky ě. Lípa je národní strom České republiky.'],
    ['Potáp_č se ponořil hluboko pod vodu.', ['potápěč', 'potápječ', 'potápeč'], 'Potápěč se potápí. Po p píšeme ě i uprostřed slova.'],
    ['Op_t prší!', ['Opět', 'Opjet', 'Opet'], 'Opět znamená znovu. I v tak krátkém slově je po p ě.'],
    ['Na map_ najdi Brno.', ['mapě', 'mapje', 'mape'], 'Mapa, na mapě. Když slovo skloňujeme, po p je vždycky ě.'],
  ],
  proc: [
    ['Kdy píšeme bje?', ['Když se potká předpona ob- se slovem, které začíná na je-', 'Vždycky, když ve slově slyšíme hlásky b a j hned za sebou', 'Na začátku každého slova', 'Jen v názvech zvířat'], 'Třeba ob + jet = objet, ob + jednat = objednat. Ve všech ostatních slovech píšeme bě: oběd, běžet.'],
    ['Kdy píšeme vje?', ['Když se potká předpona v- se slovem na je-', 'Ve všech slovech, která začínají písmenem v', 'Když slovo končí písmenem t', 'Nikdy, vje se nepíše'], 'Třeba v + jet = vjet, v + jezd = vjezd. Jinak píšeme vě: věc, svět, květina.'],
    ['Co píšeme po písmenu p?', ['Vždycky pě', 'Vždycky pje', 'Někdy pě a někdy pje'], 'Skupina pje se v českých slovech nepíše. Pět, pěna, zpěv, na lípě: všude pě.'],
    ['Proč píšeme oběd s ě?', ['Není v něm předpona ob- a slovo na je-', 'Protože se oběd jí v poledne', 'Protože je to krátké slovo', 'Protože oběd je podstatné jméno'], 'Oběd nemá nic společného se slovem jed. Pomůcka: Na oběd nedáváme jed!'],
    ['Ze kterých dvou částí se skládá slovo objet?', ['ob + jet', 'o + bjet', 'obj + et', 'ob + et'], 'Předpona ob- a slovo jet. Tak se potkají b a je a vznikne objet.'],
    ['Ze kterých dvou částí se skládá slovo vjezd?', ['v + jezd', 'vj + ezd', 'vje + zd', 'v + ezd'], 'Předpona v- a jezd jako ve slově jezdit. Proto vje.'],
    ['Bě a bje zní úplně stejně. Jak poznáš, co napsat?', ['Zkusím oddělit ob-. Když zbytek začíná na je-, píšu bje.', 'Řeknu slovo pomalu a poslechnu si, jestli v něm slyším j.', 'Napíšu to, co se mi víc líbí.'], 'Bě i bje vyslovujeme stejně, sluch proto nepomůže. Musíš se podívat, jestli je ve slově předpona ob- a slovo na je-.'],
    ['Ve kterém řádku jsou všechna slova napsaná správně?', ['oběd, objet, věc', 'objed, objet, věc', 'oběd, obět, věc', 'oběd, objet, vjec'], 'Oběd a věc píšeme s ě. Objet je ob + jet, proto bje.'],
    ['Najdi řádek, kde je všechno napsané správně.', ['vjezd, pěna, svět', 'vězd, pěna, svět', 'vjezd, pjena, svět', 'vjezd, pěna, svjet'], 'Vjezd je v + jezd. Po p je vždycky ě, proto pěna. Svět nemá předponu v-, proto vě.'],
    ['Která skupina písmen se v českých slovech nikdy nepíše?', ['pje', 'bje', 'vje'], 'Bje a vje píšeme tam, kde se potká předpona ob- nebo v- se slovem na je-. Pje nepíšeme nikdy.'],
  ],
};

const SECTIONS: NonNullable<Quiz['sections']> = [
  { id: 'be', name: 'Bě, nebo bje?', icon: 'be' },
  { id: 've', name: 'Vě, nebo vje?', icon: 've' },
  { id: 'pe', name: 'Slova s pě', icon: 'pe' },
  { id: 'proc', name: 'Proč to tak je?', icon: 'blocks' },
];

const questions: ChoiceQuestion[] = SECTIONS.flatMap((sec) =>
  DATA[sec.id].map(([prompt, options, explain], i) => ({
    kind: 'choice' as const,
    id: `${sec.id}-${i + 1}`,
    prompt,
    options,
    section: sec.id,
    explain,
    explainLabel: 'Víš, že…?',
  })),
);

const items = (qs: ChoiceQuestion[]): Item[] => qs.map((q) => ({ q, format: 'choice' }));
const inSection = (id: string) => questions.filter((q) => q.section === id);

/** Písemka nanečisto: jen doplňování, ze všech tří skupin. */
const TEST_MIX: [string, number][] = [
  ['be', 7],
  ['ve', 7],
  ['pe', 6],
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
    description: `${testSize} slov na doplnění, jako v písemce`,
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

export const beVePe: Quiz = {
  id: 'be-ve-pe',
  subject: 'cestina',
  grade: 4,
  title: 'Bě/bje, vě/vje, pě',
  description: 'Kdy psát bě a vě, kdy bje a vje a proč po p píšeme vždycky ě.',
  sections: SECTIONS,
  questions,
  modes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'Bje a vje píšeme jen tam, kde se potká předpona ob- nebo v- se slovem, které začíná na je-: ob + jet = objet, v + jezd = vjezd. Ve všech ostatních slovech píšeme bě a vě: oběd, běžet, věc, svět. Po p píšeme vždycky ě: pět, pěna, zpěv.',
    },
    {
      type: 'note',
      title: 'Jak to poznáš?',
      text: 'Bě a bje (stejně jako vě a vje) zní úplně stejně, sluch ti nepomůže. Zkus od slova oddělit ob- nebo v-. Když zbytek začíná na je-, píšeš bje nebo vje. Když ne, píšeš bě nebo vě. Pomůcka: Na oběd nedáváme jed!',
    },
    {
      type: 'vocab',
      title: 'Slova s bje a vje',
      lang: 'cs',
      pairs: [
        ['objet', 'ob + jet'],
        ['objevit', 'ob + jevit'],
        ['objednat', 'ob + jednat'],
        ['objem', 'ob + jem'],
        ['vjet, vjela', 'v + jet'],
        ['vjezd', 'v + jezd'],
      ],
    },
    {
      type: 'vocab',
      title: 'Slova s bě, vě a pě',
      lang: 'cs',
      pairs: [
        ['bě', 'oběd, oběť, obě, běžet, běžky, bělásek, oběhnout, na stavbě'],
        ['vě', 'věc, věž, věta, vědět, větev, svět, květina, dvě, na hlavě'],
        ['pě', 'pět, pěna, pěkný, pěšky, zpěv, spěchat, opět, na mapě'],
      ],
    },
  ],
};
