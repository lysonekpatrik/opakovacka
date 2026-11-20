import { shuffle } from '../../lib/random';
import type { ChoiceQuestion, Item, Mode, Quiz } from '../../lib/types';

/* ------------------------------------------------------------------
   Vyjmenovaná slova po B a L, 4. ročník (doplňovací cvičení)
   Každá otázka: [zadání, [správná, špatná, špatná…], vysvětlení]
   V zadání je místo k doplnění označené podtržítkem.
   Věty jsou vymyšlené, ne opsané z učebnice.
------------------------------------------------------------------- */

type Row = [string, string[], string];

const DATA: Record<string, Row[]> = {
  b: [
    ['Na louce sbíráme léčivé b_liny.', ['byliny', 'biliny', 'bíliny'], 'Bylina je vyjmenované slovo. Byliny mají měkký zelený stonek, ne dřevěný jako stromy. Z máty nebo heřmánku se vaří čaj.'],
    ['Naše rodina b_dlí v paneláku.', ['bydlí', 'bidlí', 'býdlí'], 'Bydlit je vyjmenované slovo. Příbuzná slova bydliště a bydlení píšeme také s y.'],
    ['V našem městě žije hodně ob_vatel.', ['obyvatel', 'obivatel', 'obívatel'], 'Obyvatel je vyjmenované slovo. Obyvatel je ten, kdo někde bydlí. Česko má skoro 11 milionů obyvatel.'],
    ['Do pokoje jsme koupili nový náb_tek.', ['nábytek', 'nábitek', 'nábítek'], 'Nábytek je vyjmenované slovo. Patří sem stůl, židle, skříň i postel.'],
    ['Na statku chovají dob_tek.', ['dobytek', 'dobitek', 'dobýtek'], 'Dobytek je vyjmenované slovo. Tak se říká hlavně kravám, býkům a telatům.'],
    ['Na pastvině se pase kob_la s hříbětem.', ['kobyla', 'kobila', 'kobýla'], 'Kobyla je vyjmenované slovo. Kobyla je koňská maminka, tatínek je hřebec a mládě je hříbě.'],
    ['Na louce se pase velký b_k.', ['býk', 'bík', 'byk'], 'Býk je vyjmenované slovo a píše se s dlouhým ý. Býk je tatínek telete, maminka je kráva.'],
    ['Je to b_strý kluk, hned na to přišel.', ['bystrý', 'bistrý', 'býstrý'], 'Bystrý je vyjmenované slovo. Znamená chytrý a rychlý. Bystřina je zase rychlý horský potok.'],
    ['Pomlázka je starý velikonoční ob_čej.', ['obyčej', 'običej', 'obýčej'], 'Obyčej je vyjmenované slovo. Je to něco, co lidé dělají každý rok stejně.'],
    ['Ještěrka si našla příb_tek pod kamenem.', ['příbytek', 'příbitek', 'přibýtek'], 'Příbytek je vyjmenované slovo. Je to místo, kde někdo bydlí, třeba nora, hnízdo nebo chaloupka.'],
    ['Město Přib_slav leží na Vysočině.', ['Přibyslav', 'Přibislav', 'Přibýslav'], 'Přibyslav je vyjmenované slovo. Je to jméno města, proto ho píšeme s velkým P.'],
    ['Chtěl b_ch jet k moři.', ['bych', 'bich', 'bích'], 'By je vyjmenované slovo. S y píšeme i bys, bychom, byste a také aby a kdyby.'],
    ['Bydlíme v b_tě ve třetím patře.', ['bytě', 'bitě', 'bítě'], 'Byt je vyjmenované slovo. Byt, v bytě, bytový: všude píšeme y.'],
  ],
  l: [
    ['Za oknem jsem sl_šel ptáky.', ['slyšel', 'slišel', 'slýšel'], 'Slyšet je vyjmenované slovo. Sova slyší tak dobře, že najde myš i potmě.'],
    ['Ve ml_ně se mele obilí na mouku.', ['mlýně', 'mlíně', 'mlyně'], 'Mlýn je vyjmenované slovo. Dříve mlýny poháněla voda nebo vítr, proto známe vodní a větrné mlýny.'],
    ['Na obloze se bl_ská, přichází bouřka.', ['blýská', 'blíská', 'blyská'], 'Blýskat se je vyjmenované slovo. Blesk vidíme dřív, než uslyšíme hrom, protože světlo letí mnohem rychleji než zvuk.'],
    ['Had umí pol_kat kořist vcelku.', ['polykat', 'polikat', 'polýkat'], 'Polykat je vyjmenované slovo. Hadi kořist nekoušou na kousky, ale polykají ji celou.'],
    ['Řeka pomalu pl_ne k moři.', ['plyne', 'pline', 'plýne'], 'Plynout je vyjmenované slovo. Voda v řece teče vždycky z kopce dolů, až doteče do moře.'],
    ['Nepl_tvej vodou, zavři kohoutek!', ['Neplýtvej', 'Neplítvej', 'Neplytvej'], 'Plýtvat je vyjmenované slovo. Plýtvat znamená zbytečně utrácet nebo vyhazovat, třeba jídlo, vodu nebo papír.'],
    ['Malý bráška vzl_kal, protože upadl.', ['vzlykal', 'vzlikal', 'vzlýkal'], 'Vzlykat je vyjmenované slovo. Vzlyká ten, kdo pláče a přerývaně se nadechuje.'],
    ['Dědeček má l_sou hlavu.', ['lysou', 'lisou', 'lísou'], 'Lysý je vyjmenované slovo. Znamená bez vlasů nebo bez srsti. Lysá hora v Beskydech má jméno podle holého vrcholu.'],
    ['Po běhu mě bolí l_tko.', ['lýtko', 'lítko', 'lytko'], 'Lýtko je vyjmenované slovo. Lýtko je zadní část nohy pod kolenem.'],
    ['Pod kůrou stromu je l_ko.', ['lýko', 'líko', 'lyko'], 'Lýko je vyjmenované slovo. Je to vrstva pod kůrou stromu. Dříve se z lýka pletly košíky i boty.'],
    ['Na horách jsme jezdili na l_žích.', ['lyžích', 'lížích', 'lýžích'], 'Lyže je vyjmenované slovo. Lyžař, lyžovat i lyžování píšeme také s y.'],
    ['Pel_něk je velmi hořká bylina.', ['Pelyněk', 'Peliněk', 'Pelýněk'], 'Pelyněk je vyjmenované slovo. Je tak hořký, že se říká „hořký jako pelyněk“.'],
    ['Sestra spí s pl_šovým medvídkem.', ['plyšovým', 'plišovým', 'plýšovým'], 'Plyš je vyjmenované slovo a plyšový je slovo příbuzné. Plyš je hebká látka s krátkými chloupky.'],
  ],
  pribuzna: [
    ['Na talíři zůstal malý zb_tek.', ['zbytek', 'zbitek', 'zbýtek'], 'Zbytek je příbuzný se slovem být. Zbytek je to, co zbylo, proto y.'],
    ['Nechci nic zb_tečně vyhazovat.', ['zbytečně', 'zbitečně', 'zbýtečně'], 'Zbytečně je příbuzné se slovem být (zbytek). Zbytečné je to, co není potřeba.'],
    ['Na prázdninách jsme měli krásný pob_t u moře.', ['pobyt', 'pobit', 'pobít'], 'Pobyt je příbuzný se slovem být: na pobytu někde nějakou dobu jsme.'],
    ['To byl ob_čejný den, nic zvláštního se nestalo.', ['obyčejný', 'običejný', 'obýčejný'], 'Obyčejný je příbuzné se slovem obyčej. Znamená běžný, takový jako vždycky.'],
    ['Babička pije b_linkový čaj.', ['bylinkový', 'bilinkový', 'bílinkový'], 'Bylinkový je příbuzné se slovem bylina. Bylinkový čaj se vaří třeba z máty, šalvěje nebo lipového květu.'],
    ['Kráva je b_ložravec, žere trávu a seno.', ['býložravec', 'bíložravec', 'byložravec'], 'Býložravec je příbuzné se slovem bylina: je to zvíře, které jí rostliny. Proto ý.'],
    ['Ze sousedství jsme usl_šeli štěkot.', ['uslyšeli', 'uslišeli', 'uslýšeli'], 'Uslyšet je příbuzné se slovem slyšet, proto y.'],
    ['Ml_nář vozil mouku do pekárny.', ['Mlynář', 'Mlinář', 'Mlýnář'], 'Mlynář je příbuzné se slovem mlýn. Pozor: ve slově mlýn je dlouhé ý, ale v mlynář krátké y.'],
    ['Babička mele kávu v ručním ml_nku.', ['mlýnku', 'mlínku', 'mlynku'], 'Mlýnek je malý mlýn, proto ho píšeme s ý. Mlýnek na kávu nebo na pepř najdeš v mnoha kuchyních.'],
    ['Maminka vaří na pl_novém sporáku.', ['plynovém', 'plinovém', 'plýnovém'], 'Plynový je příbuzné se slovem plyn a plynout. Plyn není vidět, a tak se do něj přidává zápach, abychom poznali, že uniká.'],
    ['Nejlepší l_žař vyhrál zlatou medaili.', ['lyžař', 'lížař', 'lýžař'], 'Lyžař je příbuzné se slovem lyže. Lyžařka, lyžovat a lyžování píšeme také s y.'],
    ['Pes měl na zádech l_sinu bez srsti.', ['lysinu', 'lisinu', 'lýsinu'], 'Lysina je příbuzné se slovem lysý. Je to místo, kde chybí vlasy nebo srst.'],
    ['Za oknem se zabl_sklo.', ['zablýsklo', 'zablísklo', 'zablysklo'], 'Zablýsknout se je příbuzné se slovem blýskat se, proto ý.'],
  ],
  pozor: [
    ['Chtěl bych b_t kosmonautem.', ['být', 'bít', 'byt'], 'Být znamená existovat nebo někde se nacházet: být doma, být kosmonautem. Bít znamená udeřit, třeba bít na buben.'],
    ['Hodiny na věži b_jí poledne.', ['bijí', 'byjí', 'bíjí'], 'Bít znamená udeřit, třeba když hodiny odbíjejí nebo když bubeník bije do bubnu. Se slovem být nemá nic společného, proto i.'],
    ['Bubeník b_l do bubnu.', ['bil', 'byl', 'bíl'], 'Bil je od slova bít (udeřit), proto i. Byl s y je od slova být: byl jsem doma.'],
    ['Včera jsme b_li v divadle.', ['byli', 'bili', 'býli'], 'Byli je od slova být, proto y. Kdyby šlo o bubnování, napsali bychom bili.'],
    ['Ve třídě nám přib_l nový spolužák.', ['přibyl', 'přibil', 'přibíl'], 'Přibyl je od slova být: něčeho nebo někoho je víc než předtím. Proto y.'],
    ['Tatínek přib_l obraz na zeď.', ['přibil', 'přibyl', 'přibýl'], 'Přibít hřebík je od slova bít, proto i. Přibyl s y znamená, že něčeho přibylo.'],
    ['Musím dob_t baterii v telefonu.', ['dobít', 'dobýt', 'dobyt'], 'Dobít baterii je od slova bít, proto í. Dobýt s ý znamená zmocnit se něčeho, třeba dobýt hrad.'],
    ['Babička umí ml_t mák.', ['mlít', 'mlýt', 'mlyt'], 'Pozor, chyták! Mlít není vyjmenované slovo, píšeme ho s í. Ve mlýně se mele, ale samotné mlít je s í.'],
    ['Kočka si l_že packu.', ['líže', 'lyže', 'lýže'], 'Líže je od slova lízat, ne od lyže. Lízat není vyjmenované slovo, proto í. Kočka má na jazyku drobné háčky, kterými si čistí srst.'],
    ['Mám na sobě b_lé tričko.', ['bílé', 'bylé', 'býlé'], 'Bílý není vyjmenované ani příbuzné slovo, proto í. S bylinou nemá bílá barva nic společného.'],
    ['Bydlíme bl_zko parku.', ['blízko', 'blýzko', 'blyzko'], 'Blízko se píše s í. Nemá nic společného se slovem blýskat se.'],
    ['Kamarád mi sl_bil, že přijde.', ['slíbil', 'slýbil', 'slybil'], 'Slíbit se píše s í. Nemá nic společného se slovem slyšet.'],
    ['Pl_ce nám pomáhají dýchat.', ['Plíce', 'Plyce', 'Plýce'], 'Plíce nejsou vyjmenované slovo, proto í. Se slovem plynout nesouvisí.'],
  ],
  proc: [
    ['Které slovo patří mezi vyjmenovaná slova po B?', ['kobyla', 'bílý', 'bič', 'babička'], 'Kobyla je vyjmenované slovo. Bílý, bič ani babička vyjmenované nejsou, proto se v nich píše i nebo í.'],
    ['Které slovo patří mezi vyjmenovaná slova po L?', ['lýtko', 'líný', 'list', 'lilie'], 'Lýtko je vyjmenované slovo. Líný, list ani lilie vyjmenované nejsou.'],
    ['Které slovo NENÍ vyjmenované po B?', ['bít', 'býk', 'bystrý', 'bydlit'], 'Bít (udeřit) vyjmenované není, proto i. Býk, bystrý a bydlit vyjmenovaná jsou.'],
    ['Které slovo NENÍ vyjmenované po L?', ['lízat', 'lyže', 'lysý', 'lýko'], 'Lízat vyjmenované není, proto í. Lyže, lysý a lýko vyjmenovaná jsou.'],
    ['Ve kterém řádku jsou jen vyjmenovaná slova po B?', ['by, být, bydlit', 'by, bít, bydlit', 'býk, bílý, byt', 'bič, být, byt'], 'By, být a bydlit jsou první tři vyjmenovaná slova po B. Bít, bílý a bič mezi ně nepatří.'],
    ['Ve kterém řádku jsou jen vyjmenovaná slova po L?', ['slyšet, mlýn, plyš', 'slyšet, mlít, plyš', 'lyže, líný, plyš', 'mlýn, blízko, lyže'], 'Slyšet, mlýn i plyš jsou vyjmenovaná. Mlít, líný a blízko vyjmenovaná nejsou.'],
    ['Co jsou slova příbuzná?', ['Slova se stejným základem a podobným významem', 'Slova, která znějí stejně, ale znamenají něco jiného', 'Slova, která začínají stejným písmenem'], 'Příbuzná slova mají společný základ: mlýn, mlynář, mlýnek. Když se vyjmenované slovo píše s y, píšeme y i ve slovech příbuzných.'],
    ['Které slovo je příbuzné se slovem být?', ['zbytek', 'bít', 'bílý', 'bič'], 'Zbytek je to, co zbylo. Je příbuzný se slovem být, proto y.'],
    ['Které slovo je příbuzné se slovem plynout?', ['plyn', 'plíce', 'plést', 'plot'], 'Plyn se rozplyne do celé místnosti, tak jako voda plyne v řece. Proto se plyn i plynout píšou s y.'],
    ['Které slovo je příbuzné se slovem slyšet?', ['uslyšet', 'slíbit', 'slizký'], 'Uslyšet je slyšet s předponou u-. Slíbit a slizký se slyšením nesouvisí, proto í a i.'],
    ['Proč se Přibyslav píše s velkým P?', ['Je to jméno města', 'Je to první vyjmenované slovo', 'Je to hodně dlouhé slovo'], 'Jména měst, vesnic, řek a hor píšeme s velkým písmenem. Přibyslav je město na Vysočině.'],
    ['Ve kterém řádku je všechno napsané správně?', ['kobyla, bílý, lyže', 'kobila, bílý, lyže', 'kobyla, bylý, lyže', 'kobyla, bílý, liže'], 'Kobyla a lyže jsou vyjmenovaná slova, proto y. Bílý vyjmenovaný není, proto í.'],
  ],
};

const SECTIONS: NonNullable<Quiz['sections']> = [
  { id: 'b', name: 'Po B', icon: 'by' },
  { id: 'l', name: 'Po L', icon: 'ly' },
  { id: 'pribuzna', name: 'Slova příbuzná', icon: 'blocks' },
  { id: 'pozor', name: 'Zní stejně, píše se jinak', icon: 'speaker' },
  { id: 'proc', name: 'Znáš vyjmenovaná slova?', icon: 'list' },
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

/** Písemka nanečisto: jen doplňování, ze všech skupin. */
const TEST_MIX: [string, number][] = [
  ['b', 6],
  ['l', 6],
  ['pribuzna', 4],
  ['pozor', 4],
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

export const vyjmenovanaSlovaBL: Quiz = {
  id: 'vyjmenovana-slova-b-l',
  subject: 'cestina',
  grade: 4,
  title: 'Vyjmenovaná slova po B a L',
  description: 'Doplňování i/y ve vyjmenovaných a příbuzných slovech po B a L. A pozor na chytáky jako být a bít.',
  sections: SECTIONS,
  questions,
  modes,
  cheatsheet: [
    {
      type: 'note',
      title: 'Zapamatuj si',
      text: 'Ve vyjmenovaných slovech píšeme po B a L tvrdé y nebo ý. Stejně tak ve slovech příbuzných, která mají stejný základ: mlýn, mlynář, mlýnek. Ve všech ostatních slovech píšeme po B a L měkké i nebo í: bílý, bič, list, líný.',
    },
    {
      type: 'vocab',
      title: 'Vyjmenovaná slova po B',
      lang: 'cs',
      stack: true,
      pairs: [
        ['by', 'aby, kdyby, bych, byste'],
        ['být', 'byl, zbytek, zbytečný, pobyt, přibyl'],
        ['bydlit', 'bydliště, bydlení'],
        ['obyvatel', 'obývat, obývací pokoj'],
        ['byt', 'bytový, v bytě'],
        ['příbytek', 'místo, kde někdo bydlí'],
        ['nábytek', 'stůl, židle, skříň…'],
        ['dobytek', 'krávy, býci, telata'],
        ['obyčej', 'obyčejný, obyčejně'],
        ['bystrý', 'bystřina'],
        ['bylina', 'bylinka, bylinkový, býložravec'],
        ['kobyla', 'kobylka'],
        ['býk', 'býček'],
        ['Přibyslav', 'město na Vysočině'],
      ],
    },
    {
      type: 'vocab',
      title: 'Vyjmenovaná slova po L',
      lang: 'cs',
      stack: true,
      pairs: [
        ['slyšet', 'uslyšet, slyšitelný'],
        ['mlýn', 'mlynář, mlýnek'],
        ['blýskat se', 'blýskavý, zablýsknout se'],
        ['polykat', 'spolykat'],
        ['plynout', 'plyn, plynový, plynulý'],
        ['plýtvat', 'plýtvání'],
        ['vzlykat', 'vzlyk'],
        ['lysý', 'lysina, Lysá hora'],
        ['lýtko', 'část nohy pod kolenem'],
        ['lýko', 'vrstva pod kůrou stromu'],
        ['lyže', 'lyžař, lyžovat'],
        ['pelyněk', 'hořká bylina'],
        ['plyš', 'plyšový'],
      ],
    },
    {
      type: 'vocab',
      title: 'Pozor, zní stejně',
      lang: 'cs',
      pairs: [
        ['být (byl doma)', 'bít (bil do bubnu)'],
        ['přibyl (nový žák)', 'přibil (obraz na zeď)'],
        ['dobýt (hrad)', 'dobít (baterii)'],
        ['mlýn', 'mlít (mák, kávu)'],
        ['lyže', 'líže (od lízat)'],
        ['slyšet', 'slíbit'],
        ['blýskat se', 'blízko'],
        ['bylina', 'bílý'],
      ],
    },
  ],
};
