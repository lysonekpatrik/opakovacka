import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Quiz } from '../../lib/types';

/* ------------------------------------------------------------------
   Neživá příroda, 4. ročník
   Každá otázka: [otázka, [správná, špatná, špatná…], vysvětlení, ze školy?]
   Otázky jsou napsané vlastními slovy podle učiva, ne opsané z učebnice.
------------------------------------------------------------------- */

type Row = [string, string[], string, boolean?];

const DATA: Record<string, Row[]> = {
  voda: [
    ['V jaké podobě padá voda zpět na zem?', ['Jako srážky: déšť, sníh nebo kroupy', 'Jen jako vodní pára', 'Jen jako mlha'], 'Voda z oblaků padá jako srážky. Když je teplo, prší. Když mrzne, sněží. Kroupy jsou kousky ledu. Srážky tedy mohou být kapalné i pevné.', true],
    ['Kde se nachází většina sladké vody?', ['V ledovcích', 'V řekách', 'V rybnících', 'V mořích'], 'Většina sladké vody je zmrzlá v ledovcích, hlavně kolem severního a jižního pólu. Voda v mořích a oceánech je slaná.', true],
    ['Jaká skupenství může mít voda?', ['Pevné, kapalné a plynné', 'Jen kapalné', 'Jen kapalné a plynné'], 'Pevné skupenství je led a sníh. Kapalné je voda v řekách, rybnících i pod zemí. Plynné je vodní pára, třeba ta, co stoupá z hrnce, když se vaří voda.', true],
    ['Z kolika procent je lidské tělo tvořeno vodou?', ['Asi ze 70 %', 'Asi z 10 %', 'Asi z 30 %', 'Ze 100 %'], 'Voda tvoří velkou část těla, zhruba dvě třetiny. Proto je důležité pít. Bez vody člověk nevydrží déle než asi týden.', true],
    ['Jakou část povrchu Země pokrývá voda?', ['Asi tři čtvrtiny', 'Asi polovinu', 'Asi čtvrtinu'], 'Kdyby se povrch Země rozdělil na 4 stejné díly, 3 z nich by byly pod vodou. Proto se Zemi říká modrá planeta.'],
    ['Kolik vody na Zemi je slané?', ['97 %', '50 %', '10 %'], 'Skoro všechna voda je v mořích a oceánech a je slaná. Sladké vody je jen malá část a většina z ní je navíc zamrzlá v ledovcích.'],
    ['Jak se jmenuje voda, která vznikne smícháním sladké a slané vody?', ['Brakická', 'Minerální', 'Destilovaná'], 'Brakická voda je tam, kde se potkává řeka s mořem, tedy v místech, kde řeka ústí do moře.'],
    ['Co se stane s vodou v moři, když ji ohřeje Slunce?', ['Vypaří se a stoupá vzhůru', 'Zmrzne', 'Vsákne se do země'], 'Tím začíná oběh vody. Voda se vypaří, z páry vzniknou oblaka a z nich padají srážky. Voda pak teče v řekách nebo se vsákne do země a nakonec se znovu vypaří. A tak pořád dokola.'],
    ['Co je pramen?', ['Místo, kde podzemní voda vytéká na povrch', 'Mrak plný deště', 'Nejhlubší místo v moři'], 'Část dešťové vody se vsákne do země. Pod zemí se hromadí a na některém místě vyteče ven. Z pramenů vznikají potoky a z potoků řeky.'],
    ['Jak může voda člověku pomáhat?', ['Ve vodních elektrárnách vyrábí elektřinu', 'Způsobuje povodně', 'Vytváří tsunami'], 'Voda má obrovskou sílu. Umí ničit (záplavy, povodně, tsunami), ale umí i pomáhat. Ve vodních elektrárnách roztáčí turbíny, které vyrábějí elektřinu.'],
  ],
  vzduch: [
    ['Jak může vítr ublížit člověku?', ['Silný vítr, třeba tornádo, může zničit domy a vyvrátit stromy', 'Vítr člověku nikdy neublíží', 'Vítr vysuší všechny řeky'], 'Tornádo je silně rotující vítr ve tvaru nálevky. Hurikán (také tajfun nebo cyklón) je obrovská rotující bouře z tropů. Tornáda bývají i u nás: v roce 2021 velmi silné tornádo poničilo obce na jižní Moravě.', true],
    ['Jak člověk využívá větrnou energii?', ['Ve větrných elektrárnách a větrných mlýnech', 'V uhelných elektrárnách', 'K ohřívání vody v bojleru'], 'Vítr roztáčí vrtule (lopatky) větrných elektráren, které vyrábějí elektřinu. Dříve poháněl větrné mlýny. Pohání i plachetnice, balóny a bezmotorová letadla.', true],
    ['Co je atmosféra?', ['Plynný obal Země', 'Vrstva půdy', 'Mrak nad horami'], 'Atmosféra je vzduch, který obaluje celou Zemi. Chrání nás jako štít a udržuje na Zemi teplotu vhodnou pro život.', true],
    ['Kterého plynu je ve vzduchu nejvíc?', ['Dusíku', 'Kyslíku', 'Oxidu uhličitého'], 'Vzduch tvoří asi 78 % dusíku a 21 % kyslíku. Zbytek, asi 1 %, jsou ostatní plyny, třeba oxid uhličitý.', true],
    ['Kolik procent vzduchu tvoří kyslík?', ['Asi 21 %', 'Asi 78 %', '100 %', 'Asi 1 %'], 'Kyslík tvoří asi pětinu vzduchu. Dýcháme ho a většina živých organismů by bez něj nemohla existovat.'],
    ['Co je vítr?', ['Proudění vzduchu', 'Vodní pára', 'Pohyb mraků'], 'Vítr nevidíme, ale cítíme ho a vidíme, co dělá: ohýbá stromy a točí větrníkem. Jeho sílu umíme změřit.'],
    ['Kdo rozdělil sílu větru do 12 stupňů?', ['Sir Beaufort', 'Kryštof Kolumbus', 'Isaac Newton'], 'Francis Beaufort vytvořil svou stupnici na začátku 19. století. Původně podle ní námořníci poznali, kolik plachet mohou při daném větru napnout.'],
    ['Jak vítr pomáhá rostlinám?', ['Roznáší jejich semena', 'Zalévá je', 'Hnojí půdu'], 'Vzpomeň si na odkvetlou pampelišku. Když na chmýří fouká vítr, semínka odletí daleko a vyrostou z nich nové rostliny.'],
    ['Nafoukneš balónek, nezavážeš ho, zvedneš nad hlavu a pustíš. Co se stane?', ['Vyletí, protože ho pohání unikající vzduch', 'Hned spadne na zem jako kámen', 'Zůstane viset ve vzduchu'], 'Vzduch z balónku prudce uniká jedním směrem a balónek letí na druhou stranu. To je síla vzduchu. Zkus si to doma!'],
    ['Co se nafukuje stlačeným vzduchem?', ['Pneumatiky, míče a nafukovací čluny', 'Kameny', 'Okna'], 'Stlačený vzduch je vzduch natlačený do malého prostoru. Díky němu je pneumatika pevná a míč skáče.'],
  ],
  slunce: [
    ['Je Slunce planeta, nebo hvězda?', ['Hvězda', 'Planeta', 'Měsíc'], 'Slunce je obrovská žhavá koule z plynů. Je to nám nejbližší hvězda, proto ji vidíme i ve dne. Ostatní hvězdy jsou tak daleko, že je vidíme jen v noci jako malé tečky.', true],
    ['Jak se nazývá proces, při kterém rostliny tvoří kyslík?', ['Fotosyntéza', 'Zvětrávání', 'Vypařování', 'Eroze'], 'Při fotosyntéze rostliny pomocí slunečního světla a zeleného barviva (chlorofylu) mění vodu a oxid uhličitý na cukry. Kyslík vzniká navíc. A právě ten dýcháme.', true],
    ['Za jak dlouho se Země otočí kolem své osy?', ['Za 24 hodin (jeden den)', 'Za 1 hodinu', 'Za 1 týden', 'Za 1 rok'], 'Jedno otočení trvá asi 24 hodin. Na polovině Země, na kterou svítí Slunce, je den. Na druhé, neosvětlené polovině je noc.', true],
    ['Za jak dlouho Země oběhne kolem Slunce?', ['Za 1 rok (365 dní)', 'Za 1 den', 'Za 1 měsíc', 'Za 10 let'], 'Jeden oběh kolem Slunce trvá 365 dní, tedy jeden rok. Na každé narozeniny má Země za sebou další celý oběh.', true],
    ['Kolikátá planeta od Slunce je Země?', ['Třetí', 'První', 'Pátá'], 'Pořadí planet je Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran a Neptun. Země je od Slunce v příznivé vzdálenosti: není tu ani moc horko, ani moc zima, a proto je tu možný život.'],
    ['Co je zemská osa?', ['Pomyslná přímka, která spojuje severní a jižní pól', 'Silnice kolem rovníku', 'Kovová tyč uvnitř Země'], 'Zemskou osu nikdo nevidí, je jen pomyslná. Země se kolem ní točí jako káča. Osa je trochu nakloněná.'],
    ['Kterým směrem se Země otáčí kolem své osy?', ['Od západu k východu', 'Od východu k západu', 'Od jihu k severu'], 'Proto vidíme Slunce vycházet na východě a zapadat na západě. Vypadá to, že se pohybuje Slunce, ale ve skutečnosti se točí Země i s námi.'],
    ['Co chrání Zemi před škodlivými ultrafialovými paprsky?', ['Ozonová vrstva', 'Mraky', 'Oceány'], 'Ozonová vrstva je vysoko nad námi, asi 25 až 35 km nad zemí. Na některých místech se ztenčuje a vznikají ozonové díry. Může za to hlavně člověk. I proto v létě nosíme sluneční brýle a používáme opalovací krém.'],
    ['Která rostlina natáčí květ za Sluncem?', ['Slunečnice', 'Kopřiva', 'Mech'], 'Mladé slunečnice během dne otáčejí hlavu za Sluncem. Světlo a teplo ze Slunce ovlivňuje růst i pohyb rostlin.'],
    ['Proč je ve skleníku tepleji než venku?', ['Sluneční paprsky projdou sklem a teplo pak zůstane uvnitř', 'Ve skleníku je vždycky topení', 'Sklo ochlazuje vzduch venku'], 'Paprsky projdou sklem a ohřejí vnitřek. Teplo se pak ven dostává jen těžko a hromadí se. Tomu se říká skleníkový efekt.'],
  ],
  puda: [
    ['Jak se nazývá nejúrodnější část půdy?', ['Humus', 'Písek', 'Štěrk', 'Jíl'], 'Humus vzniká rozkladem těl rostlin a živočichů. Je tmavý a je v něm hodně živin, které rostliny potřebují k růstu.', true],
    ['Který typ půdy patří k nejúrodnějším?', ['Černozem', 'Podzol', 'Písčitá půda'], 'Černozem je tmavá, protože obsahuje hodně humusu. Na Moravě je jí hodně třeba na Hané a na jižní Moravě. Velmi rozšířená a také úrodná je hnědozem.', true],
    ['Jak vzniká půda?', ['Zvětráváním horniny a rozkladem zbytků rostlin a živočichů', 'Tak, že ji lidé navezou na pole', 'Táním sněhu'], 'Horninu rozrušuje déšť, vítr, mráz a sluneční záření. Rozpadá se na malé kousky, tomu se říká zvětrávání. K nim se přidají odumřelé části rostlin a živočichů a vzniká půda.', true],
    ['Jak se jmenuje nejméně úrodný typ půdy?', ['Podzol', 'Černozem', 'Hnědozem'], 'Podzol je světlý a chudý na živiny. Najdeme ho hlavně na horách pod jehličnatými lesy.', true],
    ['Jak dlouho trvá, než vznikne malá vrstvička půdy?', ['Stovky let', 'Jeden den', 'Jeden rok'], 'Půda vzniká velmi pomalu. Proto je vzácná a musíme ji chránit.'],
    ['Co je eroze?', ['Odnášení půdy vodou, větrem nebo činností člověka', 'Kypření půdy žížalami', 'Hnojení pole'], 'Při silném dešti voda odnáší hlínu z polí. Erozi zhoršuje špatná orba nebo pěstování nevhodných plodin. Pomáhají terasy, které půdu zachytí.'],
    ['Co je ornice?', ['Úrodná vrstva půdy na polích', 'Skála hluboko pod zemí', 'Nářadí na orání'], 'Ornice vzniká zemědělskou činností na polích. Obsahuje hodně humusu, a proto se v ní rostlinám dobře daří.'],
    ['Kteří živočichové žijí v půdě?', ['Žížala, krtonožka a hraboš', 'Kapr, štika a rak', 'Vrabec, sýkora a holub'], 'Půda je domovem mnoha živočichů. Žížaly ji provzdušňují a kypří. Krtonožka si hrabe chodbičky silnýma předníma nohama, podobně jako krtek. V norách žije i sysel.'],
    ['Když dáš žížalu na papír a pozorně posloucháš, uslyšíš šustění. Proč?', ['Na těle má drobné štětinky', 'Žížala zpívá', 'Papír se trhá'], 'Tělo žížaly není hladké. Má drobné štětinky, kterými se zachytává, když leze. Po papíře proto šustí.'],
    ['Co obsahuje půda kromě zvětralé horniny a humusu?', ['Vzduch, vodu a drobné živé organismy', 'Jen kameny', 'Jen písek'], 'V půdě je půdní vzduch, voda a spousta živých organismů. Většinu z nich ani nevidíme, protože jsou maličké.'],
    ['Co patří do neživé přírody?', ['Voda, vzduch, světlo a teplo, půda, horniny a nerosty', 'Houby, rostliny a živočichové', 'Jen kameny'], 'K živé přírodě patří houby, rostliny a živočichové. Živá a neživá příroda tvoří jeden celek, který musí být v rovnováze. Jen tehdy je na Zemi možný život.'],
  ],
  horniny: [
    ['Z čeho jsou složeny horniny?', ['Z nerostů', 'Z humusu', 'Z vody a vzduchu'], 'Hornina je složená z jednoho nebo více nerostů (minerálů). Třeba žula se skládá ze tří nerostů: živce, křemene a slídy. Když se na žulu podíváš zblízka, uvidíš různobarevná zrníčka.', true],
    ['Jak dělíme horniny podle vzniku?', ['Na vyvřelé, usazené a přeměněné', 'Na tvrdé a měkké', 'Na velké a malé'], 'Vyvřelé vznikly ztuhnutím žhavého magmatu nebo lávy (žula, čedič). Usazené vznikly usazováním drobných částic, často na dně moří (pískovec, vápenec). Přeměněné vznikly z jiných hornin působením velkého tlaku a teploty (mramor, rula).', true],
    ['Jak vznikly vyvřelé horniny?', ['Vychladnutím a ztuhnutím žhavého magmatu nebo lávy', 'Usazením na dně moře', 'Z odumřelých rostlin'], 'Hluboko pod zemí je žhavá roztavená hornina, magma. Když vychladne a ztuhne, vznikne vyvřelá hornina, třeba žula. Z lávy, která vyteče ze sopky, vzniká třeba čedič.'],
    ['Co řadíme mezi energetické suroviny?', ['Uhlí, ropu a zemní plyn', 'Žulu, mramor a pískovec', 'Písek, štěrk a jíl'], 'Spalováním uhlí, ropy a zemního plynu vzniká teplo a elektřina. Z ropy se vyrábí benzín a nafta. Tyto suroviny vznikaly miliony let, a proto jednou dojdou.', true],
    ['Jak lidé využívají horniny?', ['Na stavby, dlažbu, sochy i jako palivo', 'Jen na ozdobu', 'Vůbec je nevyužívají'], 'Žula se používá na dlažbu a obrubníky, mramor na sochy, vápenec na výrobu vápna a cementu. Uhlí slouží k vytápění a výrobě elektřiny.', true],
    ['Která hornina se často používá na sochy?', ['Mramor', 'Uhlí', 'Písek'], 'Mramor je přeměněná hornina, vzniká z vápence. Dobře se opracovává a krásně se leští.'],
    ['Z čeho se vyrábí benzín a nafta?', ['Z ropy', 'Z uhlí', 'Ze žuly'], 'Ropa je hustá tmavá kapalina, která se těží hluboko pod zemí. V rafinerii se z ní vyrábí benzín, nafta i suroviny pro výrobu plastů.'],
    ['Která z těchto hornin je usazená?', ['Pískovec', 'Žula', 'Mramor'], 'Pískovec vznikl z písku, který se dlouhou dobu usazoval a pevně se spojil. Žula je vyvřelá hornina a mramor přeměněná.'],
  ],
};

const SECTIONS: NonNullable<Quiz['sections']> = [
  { id: 'voda', name: 'Voda', icon: 'drop' },
  { id: 'vzduch', name: 'Vzduch', icon: 'wind' },
  { id: 'slunce', name: 'Slunce', icon: 'sun' },
  { id: 'puda', name: 'Půda', icon: 'soil' },
  { id: 'horniny', name: 'Horniny a nerosty', icon: 'rock' },
];

const questions: ChoiceQuestion[] = SECTIONS.flatMap((sec) =>
  DATA[sec.id].map(([prompt, options, explain, school], i) => ({
    kind: 'choice' as const,
    id: `${sec.id}-${i + 1}`,
    prompt,
    options,
    section: sec.id,
    school: !!school,
    explain,
    explainLabel: 'Víš, že…?',
  })),
);

const items = (qs: ChoiceQuestion[]): Item[] => qs.map((q) => ({ q, format: 'choice' }));
const inSection = (id: string) => questions.filter((q) => q.section === id);

const modes: Mode[] = [
  {
    id: 'mix',
    name: 'Mix ze všeho',
    description: `${SECTIONS.length * 3} otázek, z každého tématu tři`,
    icon: 'mix',
    featured: true,
    build: () => shuffle(SECTIONS.flatMap((s) => items(shuffle(inSection(s.id)).slice(0, 3)))),
  },
  {
    id: 'pracovni-list',
    name: 'Pracovní list',
    description: `${questions.filter((q) => q.school).length} otázek, které byly ve škole`,
    icon: 'sheet',
    build: () => shuffle(items(questions.filter((q) => q.school))),
  },
  ...SECTIONS.map((s) => ({
    id: s.id,
    name: s.name,
    description: `${inSection(s.id).length} otázek`,
    icon: s.icon,
    build: () => shuffle(items(inSection(s.id))),
  })),
];

export const nezivaPriroda: Quiz = {
  id: 'neziva-priroda',
  subject: 'prirodoveda',
  grade: 4,
  title: 'Neživá příroda',
  description: 'Voda, vzduch, Slunce, půda, horniny a nerosty.',
  sections: SECTIONS,
  questions,
  modes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'Přírodu dělíme na živou a neživou. Do neživé přírody patří voda, vzduch, světlo a teplo, půda, nerosty a horniny. K živé přírodě patří houby, rostliny a živočichové.',
    },
  ],
};
