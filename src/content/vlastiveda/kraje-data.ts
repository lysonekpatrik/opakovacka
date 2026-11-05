/* ------------------------------------------------------------------
   Kraje ČR, 4. ročník: učivo o jednotlivých krajích.
   Otázky jsou napsané vlastními slovy podle učiva, ne opsané z učebnice.
   Fakta ověřená (ČSÚ, ČÚZK, UNESCO). true na konci = otázka z rámečků
   „Zjisti / Vyhledej“ v učebnici.
------------------------------------------------------------------- */

export type KrajId =
  | 'praha'
  | 'stredocesky'
  | 'karlovarsky'
  | 'ustecky'
  | 'liberecky'
  | 'kralovehradecky'
  | 'pardubicky'
  | 'olomoucky'
  | 'moravskoslezsky'
  | 'zlinsky'
  | 'jihocesky'
  | 'plzensky'
  | 'jihomoravsky'
  | 'vysocina';

/** [otázka, [správná, špatná, špatná…], Víš, že…?, z učebnice?] */
export type ChoiceRow = [string, string[], string, boolean?];

/** Psaná odpověď, kde je potřeba víc než seznam uznávaných odpovědí. */
export interface WriteOpts {
  answers?: string[];
  /** Výčet: dítě napíše `need` věcí v libovolném pořadí. Varianty oddělené |. */
  pool?: string[];
  need?: number;
  /** Co ukázat jako správnou odpověď u výčtu. */
  show?: string;
  strictCase?: boolean;
}

/** [otázka, uznávané odpovědi (nebo WriteOpts), Víš, že…?, z učebnice?] */
export type WriteRow = [string, string[] | WriteOpts, string, boolean?];

/** Ve kterém kraji to je? [otázka, Víš, že…?] Možnosti se doplní samy. */
export type WhereRow = [string, string];

export interface Kraj {
  id: KrajId;
  /** Jak se kraj jmenuje (Jihočeský kraj, Kraj Vysočina). */
  name: string;
  /** Druhý pád: „krajské město Jihočeského kraje“. */
  gen: string;
  city: string;
  /** Další uznávané tvary krajského města. */
  cityAlts?: string[];
  cityNote: string;
  /** Kraje do špatných možností u otázek „Ve kterém kraji…?“ (hlavně sousední). */
  near: KrajId[];
  write: WriteRow[];
  choice: ChoiceRow[];
  where: WhereRow[];
  /** Shrnutí do taháku. */
  memo: string;
}

export const JIHOCESKY: Kraj = {
  id: 'jihocesky',
  name: 'Jihočeský kraj',
  gen: 'Jihočeského kraje',
  city: 'České Budějovice',
  cityNote: 'České Budějovice leží na soutoku Vltavy a Malše. Mají obrovské čtvercové náměstí a slavný pivovar Budvar.',
  near: ['plzensky', 'vysocina', 'stredocesky', 'jihomoravsky'],
  write: [
    ['Která velká řeka pramení na Šumavě v Jihočeském kraji?', ['Vltava'], 'Vltava je nejdelší česká řeka. Teče z jižních Čech na sever přes Prahu a u Mělníka se vlévá do Labe.'],
    ['Napiš dvě řeky, které tečou Jihočeským krajem.', { pool: ['Vltava', 'Otava', 'Lužnice', 'Malše', 'Nežárka', 'Blanice'], need: 2, show: 'třeba Vltava, Otava, Lužnice nebo Malše' }, 'Na mapě kraje najdeš Vltavu, Otavu, Lužnici a Malši. Otava, Lužnice i Malše se nakonec vlévají do Vltavy.'],
    ['Se kterými dvěma státy sousedí Jihočeský kraj?', { pool: ['Německo|Německem', 'Rakousko|Rakouskem'], show: 'Německo a Rakousko' }, 'Na západě, na Šumavě, sousedí s Německem a na jihu s Rakouskem.'],
    ['Jak se jmenuje největší rybník v České republice?', ['Rožmberk'], 'Rožmberk je u Třeboně. Postavil ho před více než 400 lety rybníkář Jakub Krčín. Hráz rybníka je dlouhá skoro dva a půl kilometru.'],
    ['Ve kterém městě najdeš nejstarší dochovaný kamenný most v Česku?', ['Písek', 'Písku'], 'Kamenný most v Písku vede přes řeku Otavu. Postavili ho už ve 13. století, takže je starší než Karlův most v Praze.', true],
    ['Napiš jméno některého hradu nebo zámku v Jihočeském kraji.', { pool: ['Hluboká|Hluboká nad Vltavou', 'Český Krumlov|Krumlov', 'Zvíkov', 'Orlík', 'Rožmberk nad Vltavou|Rožmberk', 'Jindřichův Hradec', 'Třeboň', 'Kratochvíle', 'Červená Lhota', 'Landštejn'], need: 1, show: 'třeba Hluboká, Český Krumlov, Zvíkov nebo Orlík' }, 'Zámek Hluboká vypadá jako z pohádky, zámek v Českém Krumlově je druhý největší u nás a hradu Zvíkov se říká král českých hradů.', true],
  ],
  choice: [
    ['Které město je krajským městem Jihočeského kraje?', ['České Budějovice', 'Český Krumlov', 'Tábor', 'Písek'], 'Český Krumlov, Tábor i Písek jsou krásná jihočeská města, ale krajský úřad sídlí v Českých Budějovicích.'],
    ['Čím je Jihočeský kraj známý ze všeho nejvíc?', ['Spoustou rybníků', 'Těžbou uhlí', 'Výrobou automobilů', 'Pěstováním vinné révy'], 'Rybníků jsou tu tisíce. Nejvíc jich je kolem Třeboně a Českých Budějovic. Kraj také není moc zalidněný, je tu hodně lesů a chráněné přírody.'],
    ['K čemu slouží rybníky?', ['K chovu ryb a zadržování vody v krajině', 'K výrobě elektřiny', 'K zavlažování vinic', 'Jen ke koupání'], 'Rybníky postavili lidé. Chovají se v nich hlavně kapři. Rybníky také zadržují vodu, chrání před povodněmi a u vody žije spousta ptáků, žab a hmyzu.', true],
    ['Co je výlov rybníka?', ['Vypuštění vody a vylovení ryb do sítí', 'Závody v chytání ryb na udici', 'Stavba nového rybníka', 'Zimní krmení ryb'], 'Výlovy bývají hlavně na podzim. Rybáři vypustí vodu, ryby stáhnou sítí a vyloví. Jihočeští kapři se pak prodávají třeba na Vánoce.'],
    ['Historické centrum kterého jihočeského města je na seznamu UNESCO?', ['Český Krumlov', 'České Budějovice', 'Tábor', 'Písek'], 'Nad Českým Krumlovem stojí obrovský zámek s barevnou věží, druhý největší u nás po Pražském hradě. Vltava se tu kroutí ve velkých obloucích.'],
    ['Čím jsou zajímavé Holašovice?', ['Statky ve stylu selského baroka', 'Nejstarším kamenným mostem', 'Jadernou elektrárnou', 'Největší přehradou'], 'Bohatší sedláci si tu stavěli statky se zdobenými štíty. Celá vesnice je na seznamu UNESCO.'],
    ['Který zámek najdeš v Jihočeském kraji?', ['Hluboká', 'Lednice', 'Litomyšl', 'Kroměříž'], 'Bílý zámek Hluboká se inspiroval anglickým královským hradem Windsor. Lednice je na jižní Moravě, Litomyšl v Pardubickém a Kroměříž ve Zlínském kraji.', true],
    ['Které pohoří leží na hranici Jihočeského kraje s Německem?', ['Šumava', 'Krkonoše', 'Jeseníky', 'Krušné hory'], 'Šumava je náš největší národní park. Jsou tu hluboké lesy, rašeliniště a ledovcová jezera. V jihočeské části Šumavy je i Boubínský prales se stromy starými stovky let.'],
    ['Jak se jmenuje jaderná elektrárna v Jihočeském kraji?', ['Temelín', 'Dukovany', 'Mělník', 'Lipno'], 'Temelín je naše druhá jaderná elektrárna. Ta první, Dukovany, stojí v Kraji Vysočina.'],
    ['Které přehradě na Vltavě se kvůli její velikosti říká jihočeské moře?', ['Lipno', 'Orlík', 'Slapy', 'Rožmberk'], 'Lipno má největší plochu ze všech našich vodních nádrží. V létě se tu jezdí na lodích, v zimě se po zamrzlé hladině bruslí.'],
    ['Které jihočeské město založili husité?', ['Tábor', 'České Budějovice', 'Písek', 'Prachatice'], 'Husité založili Tábor v roce 1420 a pojmenovali ho podle hory Tábor z Bible. Pod městem jsou dodnes dlouhé podzemní chodby.'],
  ],
  where: [
    ['Ve kterém kraji najdeš rybník Rožmberk?', 'Rožmberk leží u Třeboně v Jihočeském kraji. Je to náš největší rybník.'],
    ['Ve kterém kraji leží Český Krumlov?', 'Český Krumlov je na Vltavě v Jihočeském kraji, kousek od hranic s Rakouskem.'],
    ['Ve kterém kraji jsou Holašovice se statky ve stylu selského baroka?', 'Holašovice jsou vesnice nedaleko Českých Budějovic v Jihočeském kraji.'],
    ['Ve kterém kraji pramení Vltava?', 'Vltava pramení na Šumavě v Jihočeském kraji a pak teče na sever až do Prahy.'],
    ['Ve kterém kraji stojí jaderná elektrárna Temelín?', 'Temelín je v Jihočeském kraji, nedaleko Týna nad Vltavou.'],
  ],
  memo: 'Krajské město České Budějovice. Sousedí s Německem a Rakouskem. Spousta rybníků, největší je Rožmberk. Pramení tu Vltava, tečou tu i Otava, Lužnice a Malše. Šumava, přehrada Lipno, jaderná elektrárna Temelín. Památky: Český Krumlov, Holašovice (selské baroko), zámek Hluboká, nejstarší kamenný most v Písku.',
};

export const PLZENSKY: Kraj = {
  id: 'plzensky',
  name: 'Plzeňský kraj',
  gen: 'Plzeňského kraje',
  city: 'Plzeň',
  cityNote: 'Plzeň je čtvrté největší město v Česku. Je známá pivovarem Prazdroj a Škodovými závody.',
  near: ['karlovarsky', 'stredocesky', 'jihocesky', 'ustecky'],
  write: [
    ['Napiš dvě řeky, jejichž soutokem vzniká řeka Berounka.', { pool: ['Mže', 'Radbuza'], show: 'Mže a Radbuza' }, 'Mže a Radbuza se spojí přímo v Plzni a dál už teče Berounka. Plzni se říká město čtyř řek, protože tu tečou ještě Úhlava a Úslava.', true],
    ['Která řeka vzniká v Plzni a protéká Plzeňským krajem?', ['Berounka'], 'Berounka teče z Plzně na východ do Středočeského kraje a v Praze se vlévá do Vltavy.'],
    ['Jak se jmenují slavné loutky, které pocházejí z Plzně?', { pool: ['Spejbl', 'Hurvínek'], show: 'Spejbl a Hurvínek' }, 'Spejbl je táta a Hurvínek jeho syn. Mají i psa Žeryka a kamarádku Máničku.', true],
    ['Jak se jmenuje národopisná oblast v Plzeňském kraji?', ['Chodsko'], 'Chodové kdysi hlídali hranice českého království. Centrem Chodska jsou Domažlice, kde se každý rok konají Chodské slavnosti.', true],
    ['Se kterým státem sousedí Plzeňský kraj?', ['Německo', 'Německem'], 'Hranici s Německem tvoří lesy Šumavy a Českého lesa.'],
    ['Jak se jmenuje největší jezero v Česku? Najdeš ho na Šumavě v Plzeňském kraji.', ['Černé jezero', 'Černé'], 'Černé jezero vzniklo v době ledové, kdy na Šumavě ležel ledovec. Je naše největší přírodní jezero a je hluboké asi 40 metrů.'],
  ],
  choice: [
    ['Které město je krajským městem Plzeňského kraje?', ['Plzeň', 'Klatovy', 'Domažlice', 'Rokycany'], 'Plzeň leží v západních Čechách. V roce 2015 byla Evropským hlavním městem kultury.'],
    ['Čím je Plzeň slavná po celém světě?', ['Pivovarem Prazdroj', 'Výrobou porcelánu', 'Lázněmi', 'Výrobou bižuterie'], 'Pivovar Prazdroj vznikl v roce 1842. Podle Plzně se tomuto druhu piva po celém světě říká pils.'],
    ['Co se vyrábí ve Škodových závodech v Plzni?', ['Lokomotivy, turbíny a lodní šrouby', 'Osobní auta Octavia', 'Klavíry', 'Perník'], 'Turbína je stroj, který pomáhá vyrábět elektřinu. Pozor, osobní auta Škoda se vyrábějí jinde, v Mladé Boleslavi ve Středočeském kraji.'],
    ['Co je soutok?', ['Místo, kde se spojí dvě řeky', 'Místo, kde řeka pramení', 'Místo, kde řeka teče do moře', 'Most přes řeku'], 'V Plzni se spojí Mže a Radbuza a vznikne Berounka. Soutok je i v Českých Budějovicích (Vltava a Malše) nebo v Brně (Svratka a Svitava).'],
    ['Co je národopis?', ['Nauka o životě, zvycích a kultuře lidí', 'Nauka o horninách', 'Popis všech řek', 'Seznam měst a obcí'], 'Národopis zkoumá, jak lidé dřív bydleli, oblékali se, jaké zpívali písně a jak slavili svátky. Každá národopisná oblast má své kroje a zvyky.'],
    ['Co je typické pro Chodsko?', ['Dudy, kroje a chodská keramika', 'Vinice a vinné sklepy', 'Uhelné doly', 'Lázně a kolonády'], 'Chodská keramika je zdobená barevnými květy. K chodským písničkám se hraje na dudy.'],
    ['Jak se jmenuje největší zřícenina hradu v Čechách, která je v Plzeňském kraji?', ['Rabí', 'Bezděz', 'Karlštejn', 'Špilberk'], 'Zřícenina znamená, že z hradu zbyly jen zdi a věže. Karlštejn a Špilberk naopak stojí celé.'],
    ['Které pohoří leží na jihu Plzeňského kraje?', ['Šumava', 'Krkonoše', 'Jeseníky', 'Beskydy'], 'Na plzeňské straně Šumavy jsou ledovcová jezera Černé a Čertovo, nedaleko města Železná Ruda.'],
    ['Co je zajímavé na katedrále sv. Bartoloměje v Plzni?', ['Má nejvyšší kostelní věž v Česku', 'Je celá ze dřeva', 'Stojí na ostrově', 'Je postavená pod zemí'], 'Věž měří přes 100 metrů. Po schodech se dá vystoupat na vyhlídku a vidět celé město.'],
    ['Kdo vymyslel loutky Spejbla a Hurvínka?', ['Josef Skupa', 'Josef Lada', 'Zdeněk Miler', 'Karel Čapek'], 'Josef Skupa byl plzeňský loutkář. Jeho divadlo vzniklo v Plzni a dnes hraje v Praze. Zdeněk Miler nakreslil Krtečka.'],
  ],
  where: [
    ['Ve kterém kraji je pivovar Prazdroj?', 'Prazdroj je v Plzni, krajském městě Plzeňského kraje.'],
    ['Ve kterém kraji najdeš Chodsko a chodskou keramiku?', 'Chodsko je kolem Domažlic v Plzeňském kraji, u hranic s Německem.'],
    ['Ve kterém kraji je zřícenina hradu Rabí?', 'Rabí je v Plzeňském kraji, nedaleko Šumavy.'],
    ['Ve kterém kraji leží Černé jezero?', 'Černé jezero je na Šumavě u Železné Rudy v Plzeňském kraji.'],
    ['Ve kterém kraji vzniká řeka Berounka?', 'Berounka vzniká v Plzni soutokem Mže a Radbuzy.'],
  ],
  memo: 'Krajské město Plzeň. Sousedí s Německem. Pivovar Prazdroj a Škodovy závody (lokomotivy, turbíny, lodní šrouby). V Plzni vzniká Berounka soutokem Mže a Radbuzy. Na Šumavě je Černé jezero, naše největší. Zřícenina hradu Rabí. Národopisná oblast Chodsko (Domažlice, chodská keramika, dudy). Z Plzně pocházejí Spejbl a Hurvínek.',
};

export const VYSOCINA: Kraj = {
  id: 'vysocina',
  name: 'Kraj Vysočina',
  gen: 'Kraje Vysočina',
  city: 'Jihlava',
  cityNote: 'Jihlava leží na řece Jihlavě, která má stejné jméno jako město. Kdysi tu byly slavné stříbrné doly.',
  near: ['jihocesky', 'jihomoravsky', 'pardubicky', 'stredocesky'],
  write: [
    ['Napiš celý název kraje, jehož krajským městem je Jihlava. Pozor na velké písmeno!', { answers: ['Kraj Vysočina'], strictCase: true }, 'Kraj Vysočina je jediný kraj, který má slovo kraj na začátku. Je to vlastní jméno, proto píšeme velké K. Ostatní kraje mají kraj na konci s malým k: Jihočeský kraj.'],
    ['Jak se jmenuje řeka, která protéká Jihlavou?', ['Jihlava'], 'Řeka má stejné jméno jako město. Říkáme, že je stejnojmenná.'],
    ['Jak se jmenuje vrchovina, která pokrývá skoro celý Kraj Vysočina?', ['Českomoravská vrchovina'], 'Vrchovina je krajina s mírnými kopci. Českomoravská se jmenuje proto, že leží na pomezí Čech a Moravy.'],
    ['Jaký kov se kdysi těžil v Jihlavě?', ['stříbro'], 'Jihlavské stříbro bylo ve středověku slavné a město díky němu zbohatlo. Pod Jihlavou jsou dodnes dlouhé podzemní chodby.'],
    ['Jak se jmenuje naše první jaderná elektrárna, která stojí na Vysočině?', ['Dukovany'], 'Dukovany stojí nedaleko Třebíče a elektřinu vyrábějí od roku 1985.'],
    ['Napiš dvě místa na Vysočině, kde jsou památky zapsané v UNESCO.', { pool: ['Telč', 'Třebíč', 'Žďár nad Sázavou|Zelená hora|Žďár'], need: 2, show: 'Telč, Třebíč a Žďár nad Sázavou (Zelená hora)' }, 'Na Vysočině jsou tři památky UNESCO: historické centrum Telče, bazilika sv. Prokopa se židovskou čtvrtí v Třebíči a kostel sv. Jana Nepomuckého na Zelené hoře u Žďáru nad Sázavou.'],
  ],
  choice: [
    ['Které město je krajským městem Kraje Vysočina?', ['Jihlava', 'Třebíč', 'Havlíčkův Brod', 'Žďár nad Sázavou'], 'Jihlava leží přesně na pomezí Čech a Moravy. Má jedno z největších náměstí u nás a oblíbenou ZOO.'],
    ['Proč píšeme Kraj Vysočina s velkým K?', ['Slovo kraj je na začátku jeho vlastního jména', 'Je to největší kraj', 'Leží uprostřed republiky', 'Píše se tak každý kraj'], 'Ostatní kraje mají slovo kraj na konci a píšou ho s malým k: Zlínský kraj. Jen Kraj Vysočina má Kraj na začátku.'],
    ['Co jsou Dukovany?', ['Naše první jaderná elektrárna', 'Hrad na Vysočině', 'Řeka u Třebíče', 'Lázeňské město'], 'Jaderná elektrárna vyrábí elektřinu. Druhá česká jaderná elektrárna, Temelín, je v Jihočeském kraji.'],
    ['Čím je slavné náměstí v Telči?', ['Barevnými renesančními domy s podloubím', 'Vysokou televizní věží', 'Orlojem', 'Rotundou'], 'Podloubí je krytá chodba v přízemí domů. Dá se pod ní projít suchou nohou i za deště. Telč je na seznamu UNESCO.'],
    ['Kde stojí kostel sv. Jana Nepomuckého na Zelené hoře?', ['Ve Žďáru nad Sázavou', 'V Jihlavě', 'V Telči', 'V Třebíči'], 'Shora má kostel tvar pěticípé hvězdy. Podle pověsti se nad tělem sv. Jana Nepomuckého objevilo pět hvězd.'],
    ['Která památka stojí v Třebíči?', ['Bazilika sv. Prokopa', 'Rotunda sv. Kateřiny', 'Hrad Špilberk', 'Zámek Hluboká'], 'Bazilika sv. Prokopa je přes 750 let stará. Spolu se židovskou čtvrtí je na seznamu UNESCO. Rotunda sv. Kateřiny je ve Znojmě.'],
    ['Se kterým cizím státem sousedí Kraj Vysočina?', ['S žádným', 'S Rakouskem', 'S Německem', 'S Polskem'], 'Kraj Vysočina leží uvnitř republiky. S cizím státem nesousedí ani Středočeský kraj a Praha.'],
    ['Jak se jmenuje nejvyšší hora Kraje Vysočina?', ['Javořice', 'Praděd', 'Ještěd', 'Sněžka'], 'Javořice měří 837 metrů a stojí na ní vysoký televizní vysílač. Je to nejvyšší vrchol celé Českomoravské vrchoviny.'],
    ['Které řeky pramení na Vysočině?', ['Sázava, Jihlava a Svratka', 'Labe, Vltava a Odra', 'Morava a Bečva', 'Ohře a Teplá'], 'Přes Vysočinu vede hlavní evropské rozvodí. Voda ze Sázavy doteče až do Severního moře, voda z Jihlavy a Svratky do Černého moře.'],
    ['Kraj Vysočina sousedí se čtyřmi kraji. Který z nich mezi ně nepatří?', ['Zlínský kraj', 'Jihočeský kraj', 'Pardubický kraj', 'Jihomoravský kraj'], 'Kraj Vysočina sousedí s Jihočeským, Středočeským, Pardubickým a Jihomoravským krajem.'],
    ['Které město na Vysočině je známé jako město rekordů?', ['Pelhřimov', 'Telč', 'Jihlava', 'Třebíč'], 'V Pelhřimově je muzeum rekordů a kuriozit. Každý rok se tu koná festival, kde se lidé snaží překonat různé rekordy.'],
  ],
  where: [
    ['Ve kterém kraji je jaderná elektrárna Dukovany?', 'Dukovany jsou v Kraji Vysočina, nedaleko Třebíče.'],
    ['Ve kterém kraji leží Telč s barevnými domy na náměstí?', 'Telč je na jihu Kraje Vysočina.'],
    ['Ve kterém kraji najdeš kostel na Zelené hoře?', 'Zelená hora je u Žďáru nad Sázavou v Kraji Vysočina.'],
    ['Ve kterém kraji je bazilika sv. Prokopa?', 'Bazilika sv. Prokopa stojí v Třebíči v Kraji Vysočina.'],
    ['Ve kterém kraji je město rekordů Pelhřimov?', 'Pelhřimov je v Kraji Vysočina, mezi Jihlavou a Táborem.'],
  ],
  memo: 'Krajské město Jihlava na řece Jihlavě. Kraj Vysočina píšeme s velkým K. Nesousedí s žádným státem. Českomoravská vrchovina, pramení tu hodně řek. V Jihlavě se kdysi těžilo stříbro. Jaderná elektrárna Dukovany u Třebíče. UNESCO: Telč, bazilika sv. Prokopa v Třebíči, kostel na Zelené hoře ve Žďáru nad Sázavou.',
};

export const KRAJE: Kraj[] = [JIHOCESKY, PLZENSKY, VYSOCINA];

/** Jména krajů, aby šla doplnit i do chytáků u krajů, které ještě nemají data. */
export const KRAJ_NAMES: Record<KrajId, string> = {
  praha: 'Hlavní město Praha',
  stredocesky: 'Středočeský kraj',
  karlovarsky: 'Karlovarský kraj',
  ustecky: 'Ústecký kraj',
  liberecky: 'Liberecký kraj',
  kralovehradecky: 'Královéhradecký kraj',
  pardubicky: 'Pardubický kraj',
  olomoucky: 'Olomoucký kraj',
  moravskoslezsky: 'Moravskoslezský kraj',
  zlinsky: 'Zlínský kraj',
  jihocesky: 'Jihočeský kraj',
  plzensky: 'Plzeňský kraj',
  jihomoravsky: 'Jihomoravský kraj',
  vysocina: 'Kraj Vysočina',
};
