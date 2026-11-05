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
  /** Bez otázky „Napiš krajské město“ (Praha je sama krajem). */
  noCity?: boolean;
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

export const PRAHA: Kraj = {
  id: 'praha',
  name: 'Hlavní město Praha',
  gen: 'Hlavního města Prahy',
  city: 'Praha',
  noCity: true,
  cityNote: 'Praha je hlavní město a zároveň samostatný kraj.',
  near: ['stredocesky', 'ustecky', 'plzensky'],
  write: [
    ['Jak se jmenuje kraj, který tvoří samotné hlavní město?', ['Hlavní město Praha'], 'Praha je hlavní město a zároveň samostatný kraj. Ze všech stran ji obklopuje Středočeský kraj.'],
    ['Která řeka protéká Prahou?', ['Vltava'], 'Přes Vltavu vede v Praze spousta mostů. Nejstarší a nejslavnější z nich je Karlův most.'],
    ['Jak se jmenuje nejstarší univerzita u nás, která je v Praze?', ['Karlova univerzita', 'Univerzita Karlova'], 'Karel IV. ji založil v roce 1348. Je to nejstarší univerzita ve střední Evropě.'],
    ['Napiš jednu památku v Praze, kterou dal postavit nebo založit Karel IV.', { pool: ['Karlův most', 'Karlova univerzita|Univerzita Karlova', 'Nové Město|Nové Město pražské', 'chrám sv. Víta|katedrála sv. Víta|chrám svatého Víta|katedrála svatého Víta|svatý Vít', 'Karlovo náměstí'], need: 1, show: 'třeba Karlův most, Karlova univerzita nebo Nové Město' }, 'Karel IV. dal postavit Karlův most, založil Karlovu univerzitu i celé Nové Město pražské a začal stavět chrám sv. Víta na Pražském hradě.', true],
  ],
  choice: [
    ['Co je pro Prahu zvláštní?', ['Je hlavním městem i samostatným krajem', 'Leží na Moravě', 'Je nejmenším městem v Česku', 'Sousedí s Německem'], 'Praha je největší město v Česku. Sídlí tu prezident, vláda i parlament.'],
    ['Na kterém náměstí je pražský orloj?', ['Na Staroměstském náměstí', 'Na Václavském náměstí', 'Na Karlově náměstí', 'Na Malostranském náměstí'], 'Pražský orloj je starý přes 600 let a pořád funguje. Každou hodinu se v okénkách ukážou apoštolové.'],
    ['Která stavba stojí v horní části Václavského náměstí?', ['Národní muzeum', 'Národní divadlo', 'Pražský hrad', 'Orloj'], 'Národní muzeum má velkou kopuli. Před ním stojí socha svatého Václava na koni.'],
    ['Jaký nápis je nad jevištěm Národního divadla?', ['Národ sobě', 'Pravda vítězí', 'Praha matka měst', 'Vítejte'], 'Divadlo se stavělo ze sbírek lidí z celého národa. Když krátce po dokončení vyhořelo, lidé přispěli znovu a postavili ho podruhé.'],
    ['Který chrám stojí na Pražském hradě?', ['Chrám sv. Víta', 'Bazilika sv. Prokopa', 'Katedrála sv. Petra a Pavla', 'Chrám sv. Barbory'], 'Chrám sv. Víta je náš největší kostel. Jsou v něm uložené české korunovační klenoty.'],
    ['Co je pověst?', ['Vyprávění z dávných dob, ve kterém je skutečnost smíchaná s fantazií', 'Zpráva z novin', 'Návod na výrobu', 'Básnička o jaru'], 'Známé pražské pověsti jsou třeba o Golemovi, o mistru Hanušovi, který postavil orloj, nebo o kněžně Libuši.', true],
    ['Kdo podle pověsti předpověděl, že Praha bude slavné město?', ['Kněžna Libuše', 'Karel IV.', 'Praotec Čech', 'Mistr Hanuš'], 'Libuše prý stála na skále nad Vltavou a viděla velké město, jehož sláva se bude dotýkat hvězd.', true],
    ['Který král se postaral o slávu Prahy ve 14. století?', ['Karel IV.', 'Václav III.', 'Přemysl Otakar II.', 'Jiří z Poděbrad'], 'Karlu IV. se říká Otec vlasti. Za jeho vlády byla Praha jedním z nejdůležitějších měst Evropy.'],
  ],
  where: [
    ['Ve kterém kraji je Karlův most?', 'Karlův most vede přes Vltavu v Praze. Dal ho postavit Karel IV.'],
    ['Ve kterém kraji stojí Národní divadlo?', 'Národní divadlo je v Praze na nábřeží Vltavy.'],
    ['Ve kterém kraji je nejstarší univerzita ve střední Evropě?', 'Karlova univerzita je v Praze. Založil ji Karel IV. v roce 1348.'],
  ],
  memo: 'Hlavní město Praha je samostatný kraj. Teče tu Vltava. Památky: Pražský hrad s chrámem sv. Víta, Karlův most, Staré Město s orlojem, Národní divadlo, Národní muzeum na Václavském náměstí. Karel IV. založil Karlovu univerzitu (nejstarší u nás) a Nové Město a postavil Karlův most.',
};

export const STREDOCESKY: Kraj = {
  id: 'stredocesky',
  name: 'Středočeský kraj',
  gen: 'Středočeského kraje',
  city: 'Praha',
  cityNote: 'Krajský úřad Středočeského kraje sídlí v Praze, i když Praha je samostatný kraj. Krajské město tak leží mimo území kraje.',
  near: ['praha', 'plzensky', 'pardubicky'],
  write: [
    ['Napiš hrad ve Středočeském kraji, který dal postavit Karel IV.', ['Karlštejn'], 'Karlštejn dal Karel IV. postavit, aby v něm byly v bezpečí korunovační klenoty a svaté ostatky.'],
    ['Ve kterém městě se vyrábějí osobní auta Škoda?', ['Mladá Boleslav', 'Mladé Boleslavi'], 'Auta se v Mladé Boleslavi vyrábějí už přes 100 let. Firmu kdysi založili pánové Laurin a Klement.'],
    ['Které středočeské město zbohatlo díky těžbě stříbra?', ['Kutná Hora', 'Kutné Hoře'], 'V Kutné Hoře se ze stříbra razily mince, pražské groše. Stojí tu krásný chrám sv. Barbory.'],
    ['Která řeka teče přes Prahu a u Mělníka se vlévá do Labe?', ['Vltava'], 'Od soutoku u Mělníka teče už jen Labe dál na sever do Německa.'],
  ],
  choice: [
    ['Které město je krajským městem Středočeského kraje?', ['Praha', 'Kladno', 'Mladá Boleslav', 'Kolín'], 'Středočeský kraj má krajský úřad v Praze. Největší město přímo v kraji je Kladno.'],
    ['Který kraj je v Česku největší?', ['Středočeský kraj', 'Jihočeský kraj', 'Kraj Vysočina', 'Plzeňský kraj'], 'Středočeský kraj obklopuje Prahu ze všech stran. Druhý největší je Jihočeský kraj.'],
    ['Proč dal Karel IV. postavit hrad Karlštejn?', ['Aby v něm ukryl korunovační klenoty a vzácné ostatky', 'Aby v něm bydlelo vojsko', 'Aby chránil Prahu před povodněmi', 'Jako lovecký zámeček'], 'Na Karlštejně je slavná kaple sv. Kříže. Její stěny zdobí drahé kameny a obrazy svatých.'],
    ['Co se vyrábí v Mladé Boleslavi?', ['Osobní auta Škoda', 'Lokomotivy a turbíny', 'Pivo', 'Klavíry'], 'Pozor na záměnu: Škodovy závody v Plzni vyrábějí lokomotivy a turbíny, auta Škoda jsou z Mladé Boleslavi.'],
    ['Čím je známé město Poděbrady?', ['Lázněmi', 'Výrobou aut', 'Těžbou uhlí', 'Pivovarem Prazdroj'], 'V Poděbradech se léčí hlavně nemoci srdce. Ve městě je lázeňská kolonáda a velký park.'],
    ['Ve které krajině jsou Prachovské skály?', ['V Českém ráji', 'Na Šumavě', 'V Krkonoších', 'V Jeseníkách'], 'Český ráj je krajina pískovcových skal a hradů. Leží ve Středočeském, Libereckém i Královéhradeckém kraji. Prachovské skály jsou v jeho královéhradecké části u Jičína.'],
    ['Který chrám v Kutné Hoře je zasvěcený patronce horníků?', ['Chrám sv. Barbory', 'Chrám sv. Víta', 'Bazilika sv. Prokopa', 'Kostel na Zelené hoře'], 'Chrám postavili z peněz za stříbro, které se tu těžilo. Kutná Hora je na seznamu UNESCO.'],
    ['Který kraj je ze všech stran obklopený Středočeským krajem?', ['Hlavní město Praha', 'Kraj Vysočina', 'Ústecký kraj', 'Plzeňský kraj'], 'Praha leží uprostřed Středočeského kraje jako ostrov.'],
  ],
  where: [
    ['Ve kterém kraji stojí hrad Karlštejn?', 'Karlštejn je ve Středočeském kraji, kousek od Prahy, u řeky Berounky.'],
    ['Ve kterém kraji se vyrábějí auta Škoda Octavia?', 'Továrna Škoda je v Mladé Boleslavi ve Středočeském kraji.'],
    ['Ve kterém kraji leží Kutná Hora?', 'Kutná Hora je ve Středočeském kraji, na východ od Prahy.'],
    ['Ve kterém kraji jsou lázně Poděbrady?', 'Poděbrady leží na Labi ve Středočeském kraji.'],
  ],
  memo: 'Krajským městem je také Praha. Je to největší kraj v Česku a obklopuje Prahu. Hrad Karlštejn (Karel IV.), auta Škoda z Mladé Boleslavi, Kutná Hora (stříbro, chrám sv. Barbory), lázně Poděbrady, část Českého ráje. U Mělníka se Vltava vlévá do Labe.',
};

export const KARLOVARSKY: Kraj = {
  id: 'karlovarsky',
  name: 'Karlovarský kraj',
  gen: 'Karlovarského kraje',
  city: 'Karlovy Vary',
  cityNote: 'Karlovy Vary jsou světově proslulé lázně. Každé léto se tu koná mezinárodní filmový festival.',
  near: ['ustecky', 'plzensky', 'stredocesky'],
  write: [
    ['Která řeka protéká celým Karlovarským krajem?', ['Ohře'], 'Ohře teče z Německa přes Karlovy Vary a Ústecký kraj až k Litoměřicím, kde se vlévá do Labe.'],
    ['Jak se jmenuje nejslavnější karlovarský léčebný pramen?', ['Vřídlo'], 'Voda z Vřídla má asi 73 stupňů a tryská až do výšky 12 metrů.'],
    ['Jak se jmenuje nejslavnější karlovarský bylinný likér?', ['Becherovka'], 'Becherovku poprvé vyrobil lékárník Josef Becher. Recept zná jen pár lidí a drží se v tajnosti.', true],
    ['Ve kterém městě v Karlovarském kraji najdeš Ježíškovu poštu?', ['Boží Dar', 'Božím Daru'], 'Boží Dar leží v Krušných horách. Je to nejvýše položené město ve střední Evropě a děti sem posílají dopisy Ježíškovi.'],
    ['Se kterým státem sousedí Karlovarský kraj?', ['Německo', 'Německem'], 'Karlovarský kraj je nejzápadnější kraj republiky. S Německem sousedí na západě i na severu.'],
  ],
  choice: [
    ['Které město je krajským městem Karlovarského kraje?', ['Karlovy Vary', 'Cheb', 'Mariánské Lázně', 'Sokolov'], 'Cheb, Mariánské Lázně i Sokolov leží také v Karlovarském kraji. Krajský úřad je ale v Karlových Varech.'],
    ['Čím jsou Karlovy Vary proslulé?', ['Lázněmi s léčivými prameny', 'Těžbou stříbra', 'Výrobou aut', 'Rybníky'], 'Do lázní jezdí lidé z celého světa. Pijí léčivou vodu z pramenů, která pomáhá třeba na trávení.'],
    ['Co je kolonáda?', ['Otevřená chodba se sloupy, často v lázních', 'Druh minerální vody', 'Lázeňský dort', 'Hora v Krušných horách'], 'Na kolonádách lidé chodí a popíjejí léčivou vodu z pramenů. V Karlových Varech je jich několik, třeba Mlýnská kolonáda.'],
    ['Co je léčebný pramen?', ['Místo, kde ze země vyvěrá léčivá minerální voda', 'Studna s pitnou vodou', 'Místo, kde pramení velká řeka', 'Bazén v lázních'], 'Minerální voda obsahuje látky rozpuštěné z hornin. Některé prameny jsou studené, jiné horké jako Vřídlo.'],
    ['Čím je Karlovarský kraj známý kromě lázní?', ['Porcelánem, sklem a lázeňskými oplatkami', 'Auty a lokomotivami', 'Vinnou révou', 'Klavíry'], 'Karlovarské oplatky jsou tenké kulaté oplatky se sladkou náplní. Ze skla je slavná karlovarská firma Moser.', true],
    ['Kdo podle pověsti objevil horký pramen v Karlových Varech?', ['Karel IV. při lovu', 'Praotec Čech', 'Kněžna Libuše', 'Jan Hus'], 'Podle pověsti spadl při lovu Karla IV. pes do horkého pramene. Král pak u pramene založil město a dal mu své jméno.', true],
    ['Která další lázeňská města leží v Karlovarském kraji?', ['Mariánské a Františkovy Lázně', 'Luhačovice a Poděbrady', 'Teplice a Jeseník', 'Třeboň a Lázně Bělohrad'], 'Karlovy Vary, Mariánské Lázně a Františkovy Lázně tvoří lázeňský trojúhelník. Jsou společně na seznamu UNESCO.'],
    ['Jak se jmenuje nejvyšší hora Krušných hor, která je v Karlovarském kraji?', ['Klínovec', 'Ještěd', 'Praděd', 'Říp'], 'Klínovec měří 1244 metrů. V zimě se tu lyžuje.'],
  ],
  where: [
    ['Ve kterém kraji tryská pramen Vřídlo?', 'Vřídlo tryská v Karlových Varech.'],
    ['Ve kterém kraji najdeš Ježíškovu poštu v Božím Daru?', 'Boží Dar leží v Krušných horách v Karlovarském kraji.'],
    ['Ve kterém kraji se vyrábí Becherovka?', 'Becherovka se vyrábí v Karlových Varech.'],
    ['Ve kterém kraji jsou Mariánské a Františkovy Lázně?', 'Obě lázeňská města jsou v Karlovarském kraji, nedaleko Chebu.'],
  ],
  memo: 'Krajské město Karlovy Vary, slavné lázně (pramen Vřídlo, kolonády). Krajem teče Ohře a do ní Teplá. Sousedí s Německem. Porcelán, sklo, lázeňské oplatky, likér Becherovka. Ježíškova pošta v Božím Daru. Další lázně: Mariánské a Františkovy Lázně.',
};

export const USTECKY: Kraj = {
  id: 'ustecky',
  name: 'Ústecký kraj',
  gen: 'Ústeckého kraje',
  city: 'Ústí nad Labem',
  cityNote: 'Ústí nad Labem leží na Labi. Nad městem stojí na skále hrad Střekov.',
  near: ['karlovarsky', 'liberecky', 'stredocesky'],
  write: [
    ['Na které řece leží Ústí nad Labem?', ['Labe', 'Labi'], 'Jméno města prozrazuje, že leží na Labi. Labe je důležitá dopravní cesta, lodě po něm jezdí až do Německa.'],
    ['Jak se jmenuje památná hora, na kterou podle pověsti vystoupil praotec Čech?', ['Říp'], 'Praotec Čech se z Řípu rozhlédl po krajině a řekl, že je to země, která oplývá mlékem a strdím. Strdí je med.', true],
    ['Jaké nerostné bohatství se těží v Ústeckém kraji?', ['hnědé uhlí'], 'Hnědé uhlí se tu těží v obrovských povrchových dolech. Staré doly se zavážejí a vznikají v nich jezera a lesy.'],
    ['Které pohoří tvoří hranici Ústeckého kraje s Německem?', ['Krušné hory'], 'Krušné hory se jmenují podle krušců, tedy rud, které se tu kdysi těžily. Hornická krajina Krušných hor je na seznamu UNESCO.'],
    ['Jak se jmenuje stavba na hoře Říp?', ['rotunda sv. Jiří', 'rotunda svatého Jiří', 'rotunda'], 'Rotunda je kulatý kostelík. Ta na Řípu je stará asi 900 let.', true],
  ],
  choice: [
    ['Které město je krajským městem Ústeckého kraje?', ['Ústí nad Labem', 'Most', 'Teplice', 'Děčín'], 'Most, Teplice i Děčín jsou také v Ústeckém kraji. Krajský úřad je v Ústí nad Labem.'],
    ['Ke kterému uměleckému slohu patří rotunda na hoře Říp?', ['K románskému', 'K baroknímu', 'K renesančnímu', 'K modernímu'], 'Románské stavby mají silné zdi, malá okna a půlkruhové oblouky. Patří k nejstarším stavbám u nás.', true],
    ['Jaký je rozdíl mezi hnědým a černým uhlím?', ['Černé uhlí je starší, tvrdší a dává víc tepla', 'Hnědé uhlí je starší a dává víc tepla', 'Žádný, liší se jen barvou', 'Černé uhlí se těží jen na povrchu'], 'Hnědé uhlí je mladší a měkčí a těží se hlavně na povrchu. Černé uhlí je starší, tvrdší a těžilo se hluboko pod zemí, třeba na Ostravsku.', true],
    ['Co je uhelná pánev?', ['Rozlehlé území, kde se za miliony let vytvořily zásoby uhlí', 'Kuchyňská pánev na uhlí', 'Jezero po těžbě', 'Sklad uhlí u nádraží'], 'U nás je známá Mostecká uhelná pánev v Ústeckém kraji a Ostravsko-karvinská pánev v Moravskoslezském kraji.'],
    ['Proč je řeka Labe důležitá?', ['Je to významná dopravní cesta pro lodě', 'Pramení v ní Vltava', 'Je to nejteplejší řeka', 'Teče do Černého moře'], 'Na Labi vzniklo několik říčních přístavů, kde lodě nakládají a vykládají zboží. Labe teče do Severního moře.'],
    ['Co najdeš v Národním parku České Švýcarsko?', ['Pravčickou bránu, největší skalní bránu v Evropě', 'Nejvyšší horu Sněžku', 'Největší rybník Rožmberk', 'Hranickou propast'], 'Pravčická brána je obrovský oblouk z pískovce. Vytvořila ho příroda během tisíců let.'],
    ['Který hrad stojí na skále nad Labem v Ústí nad Labem?', ['Střekov', 'Karlštejn', 'Bezděz', 'Rabí'], 'Hrad Střekov stojí na vysoké skále přímo nad řekou.'],
    ['Čím je známé město Žatec?', ['Pěstováním chmele', 'Výrobou skla', 'Těžbou stříbra', 'Lázněmi'], 'Chmel se přidává do piva. Žatec a chmelnice kolem něj jsou na seznamu UNESCO.'],
  ],
  where: [
    ['Ve kterém kraji je hora Říp?', 'Říp stojí uprostřed roviny v Ústeckém kraji, nedaleko Roudnice nad Labem.'],
    ['Ve kterém kraji je Mostecká uhelná pánev?', 'Mostecká uhelná pánev je v Ústeckém kraji, kolem měst Most a Chomutov.'],
    ['Ve kterém kraji je hrad Střekov?', 'Střekov stojí v Ústí nad Labem nad řekou Labe.'],
    ['Ve kterém kraji je Pravčická brána?', 'Pravčická brána je v Národním parku České Švýcarsko v Ústeckém kraji.'],
  ],
  memo: 'Krajské město Ústí nad Labem na Labi (říční přístavy). Těží se tu hnědé uhlí (Mostecká uhelná pánev). Hora Říp s románskou rotundou a pověstí o praotci Čechovi. Krušné hory tvoří hranici s Německem. Hrad Střekov, Pravčická brána v Českém Švýcarsku, chmel v Žatci.',
};

export const LIBERECKY: Kraj = {
  id: 'liberecky',
  name: 'Liberecký kraj',
  gen: 'Libereckého kraje',
  city: 'Liberec',
  cityNote: 'Liberec leží na řece Nise pod horou Ještěd. Je to páté největší město v Česku.',
  near: ['ustecky', 'kralovehradecky', 'stredocesky'],
  write: [
    ['Na které řece leží Liberec?', ['Nisa', 'Lužická Nisa', 'Nise'], 'Nisa pramení u Jablonce nad Nisou, teče přes Liberec a dál tvoří hranici mezi Polskem a Německem.'],
    ['Jak se jmenuje hora u Liberce s televizním vysílačem?', ['Ještěd'], 'Vysílač na Ještědu má tvar kužele a je v něm i hotel. Hora měří 1012 metrů.'],
    ['Se kterými dvěma státy sousedí Liberecký kraj?', { pool: ['Německo|Německem', 'Polsko|Polskem'], show: 'Německo a Polsko' }, 'Všechny tři státy se potkávají u města Hrádek nad Nisou.'],
    ['Ve kterém městě se vyrábí slavná bižuterie?', ['Jablonec nad Nisou', 'Jablonci nad Nisou', 'Jablonec'], 'Bižuterie jsou skleněné šperky, třeba korálky a náramky. Z Jablonce nad Nisou se vyvážejí do celého světa.'],
  ],
  choice: [
    ['Které město je krajským městem Libereckého kraje?', ['Liberec', 'Jablonec nad Nisou', 'Česká Lípa', 'Turnov'], 'Jablonec nad Nisou, Česká Lípa i Turnov jsou také v Libereckém kraji.'],
    ['Co je bižuterie?', ['Skleněné šperky', 'Porcelánové hrnky', 'Dřevěné hračky', 'Kovové mince'], 'Liberecký kraj je proslulý bižuterií a dalšími výrobky ze skla.'],
    ['Co je vysílač?', ['Zařízení, které přenáší televizní a rozhlasový signál', 'Hotel na kopci', 'Rozhledna', 'Lanovka'], 'Vysílač na Ještědu je zároveň hotel s restaurací. Patří k nejznámějším stavbám u nás.'],
    ['Čím je hora Ještěd známá kromě vysílače?', ['Lyžařským střediskem a skokanskými můstky', 'Lázněmi', 'Vinicemi', 'Uhelnými doly'], 'Na Ještědu se lyžuje a pořádají se tu i velké závody ve skocích na lyžích.'],
    ['Který hrad najdeš v Libereckém kraji?', ['Bezděz', 'Karlštejn', 'Rabí', 'Špilberk'], 'Bezděz stojí na vysokém kopci. Nedaleko je Máchovo jezero, pojmenované podle básníka Karla Hynka Máchy.'],
    ['Která řeka teče Libereckým krajem?', ['Jizera', 'Vltava', 'Morava', 'Odra'], 'Jizera pramení v Jizerských horách a vlévá se do Labe. Libereckým krajem teče také Nisa a Ploučnice.'],
    ['Které hory jsou v Libereckém kraji?', ['Jizerské hory', 'Jeseníky', 'Beskydy', 'Šumava'], 'Jizerské hory mají hodně lesů a rašelinišť. V zimě jsou oblíbené na běžky.'],
  ],
  where: [
    ['Ve kterém kraji je hora Ještěd?', 'Ještěd je hned u Liberce.'],
    ['Ve kterém kraji se vyrábí bižuterie z Jablonce nad Nisou?', 'Jablonec nad Nisou je v Libereckém kraji, kousek od Liberce.'],
    ['Ve kterém kraji stojí hrad Bezděz?', 'Bezděz je v Libereckém kraji u Máchova jezera.'],
    ['Ve kterém kraji leží Jizerské hory?', 'Jizerské hory jsou na severu Libereckého kraje u hranic s Polskem.'],
  ],
  memo: 'Krajské město Liberec na řece Nise. Hora Ještěd s televizním vysílačem a lyžařským střediskem. Bižuterie a sklo z Jablonce nad Nisou. Hrad Bezděz, Jizerské hory, řeky Nisa, Jizera a Ploučnice. Sousedí s Německem a Polskem.',
};

export const KRALOVEHRADECKY: Kraj = {
  id: 'kralovehradecky',
  name: 'Královéhradecký kraj',
  gen: 'Královéhradeckého kraje',
  city: 'Hradec Králové',
  cityNote: 'Hradec Králové leží na soutoku Labe a Orlice. Sídlí tu firma Petrof, která vyrábí klavíry.',
  near: ['liberecky', 'pardubicky', 'stredocesky'],
  write: [
    ['Na soutoku kterých dvou řek leží Hradec Králové?', { pool: ['Labe', 'Orlice'], show: 'Labe a Orlice' }, 'Labe pramení v Krkonoších na Labské louce. V Hradci Králové se do něj vlévá Orlice.'],
    ['Jak se jmenuje nejvyšší hora Česka?', ['Sněžka'], 'Sněžka měří 1603 metrů a je v Krkonoších. Na vrchol vede lanovka.'],
    ['Podle babičky které spisovatelky dostalo jméno Babiččino údolí?', ['Božena Němcová', 'Boženy Němcové', 'Němcová', 'Němcové'], 'Božena Němcová napsala knihu Babička. Popsala v ní svou babičku a život v údolí u České Skalice.', true],
    ['Čím je proslulé město Vamberk?', ['krajky', 'krajkou', 'krajkami', 'krajka', 'paličkované krajky'], 'Krajka je jemná ozdobná látka z nití. Ve Vamberku se paličkuje už stovky let a je tu muzeum krajky.', true],
    ['Jak se jmenuje firma z Hradce Králové, která vyrábí klavíry?', ['Petrof'], 'Firmu založil Antonín Petrof v roce 1864. Jeho klavíry hrají po celém světě.'],
  ],
  choice: [
    ['Které město je krajským městem Královéhradeckého kraje?', ['Hradec Králové', 'Trutnov', 'Náchod', 'Jičín'], 'Trutnov, Náchod i Jičín patří také do Královéhradeckého kraje.'],
    ['Ke kterým hudebním nástrojům řadíme klavír?', ['Ke klávesovým', 'K dechovým', 'K bicím', 'Ke smyčcovým'], 'Klavír má klávesy. Když je zmáčkneš, kladívka uvnitř uhodí do strun.', true],
    ['Co je safari?', ['Volný výběh zvířat, kterým projíždějí návštěvníci', 'Druh africké stravy', 'Lyžařská sjezdovka', 'Zahrada s květinami'], 'Ve Dvoře Králové nad Labem je ZOO se safari. Žirafy, zebry nebo nosorožci tu chodí volně a návštěvníci jezdí mezi nimi autobusem.'],
    ['Ve kterém pohoří je Sněžka?', ['V Krkonoších', 'V Jeseníkách', 'Na Šumavě', 'V Beskydech'], 'Krkonoše jsou náš nejstarší národní park.'],
    ['Kde pramení řeka Labe?', ['V Krkonoších', 'Na Šumavě', 'V Krušných horách', 'V Jeseníkách'], 'Labe pramení na Labské louce v Krkonoších. Pak teče přes Hradec Králové, Pardubice a Ústí nad Labem do Německa.'],
    ['Se kterým státem sousedí Královéhradecký kraj?', ['S Polskem', 'S Německem', 'S Rakouskem', 'Se Slovenskem'], 'Hranice s Polskem vede přímo přes Sněžku.'],
    ['Které skalní město je v Královéhradeckém kraji?', ['Adršpašsko-teplické skály', 'Pravčická brána', 'Macocha', 'Hranická propast'], 'Adršpašsko-teplické skály tvoří stovky pískovcových věží. Mezi nimi vedou úzké soutěsky. V kraji jsou i Prachovské skály u Jičína.'],
  ],
  where: [
    ['Ve kterém kraji je nejvyšší hora Sněžka?', 'Sněžka je v Krkonoších v Královéhradeckém kraji, přímo na hranici s Polskem.'],
    ['Ve kterém kraji je ZOO se safari ve Dvoře Králové?', 'Dvůr Králové nad Labem je v Královéhradeckém kraji.'],
    ['Ve kterém kraji je Babiččino údolí?', 'Babiččino údolí je u České Skalice v Královéhradeckém kraji.'],
    ['Ve kterém kraji se vyrábějí klavíry Petrof?', 'Továrna Petrof je v Hradci Králové.'],
  ],
  memo: 'Krajské město Hradec Králové na soutoku Labe a Orlice, klavíry Petrof. Nejvyšší hora Sněžka (1603 m) v Krkonoších, kde pramení Labe. ZOO se safari ve Dvoře Králové, Babiččino údolí (Božena Němcová), krajky z Vamberku. Sousedí s Polskem.',
};

export const PARDUBICKY: Kraj = {
  id: 'pardubicky',
  name: 'Pardubický kraj',
  gen: 'Pardubického kraje',
  city: 'Pardubice',
  cityNote: 'Pardubice leží na Labi. Jsou proslulé perníkem a koňským dostihem Velká pardubická.',
  near: ['kralovehradecky', 'olomoucky', 'vysocina'],
  write: [
    ['Jakou sladkostí jsou proslulé Pardubice?', ['perník', 'perníkem', 'perníky', 'pardubický perník'], 'Pardubický perník se peče podle starých receptů a zdobí se cukrovou polevou.'],
    ['Jak se jmenuje nejvyšší hora Pardubického kraje?', ['Králický Sněžník'], 'Králický Sněžník měří 1424 metrů. Na jeho svazích pramení řeka Morava.'],
    ['Která velká řeka pramení na Králickém Sněžníku?', ['Morava'], 'Morava teče na jih přes Olomoucký a Zlínský kraj. Podle ní se jmenuje celá Morava.'],
    ['Která významná česká osobnost se narodila v Litomyšli?', ['Bedřich Smetana', 'Smetana'], 'Hudební skladatel Bedřich Smetana se narodil v litomyšlském pivovaru, kde byl jeho táta sládkem. Složil třeba Mou vlast s Vltavou.', true],
    ['Se kterým státem sousedí Pardubický kraj?', ['Polsko', 'Polskem'], 'Na severovýchodě kraje je hraniční přechod do Polska.'],
  ],
  choice: [
    ['Které město je krajským městem Pardubického kraje?', ['Pardubice', 'Chrudim', 'Litomyšl', 'Svitavy'], 'Chrudim, Litomyšl i Svitavy patří také do Pardubického kraje.'],
    ['Co je Velká pardubická?', ['Slavný a velmi těžký koňský dostih', 'Velký pardubický perník', 'Náměstí v Pardubicích', 'Řeka v Pardubicích'], 'Velká pardubická se běží od roku 1874. Koně s jezdci musí přeskočit spoustu překážek, nejtěžší je Taxisův příkop.', true],
    ['Co je skanzen?', ['Muzeum v přírodě, které ukazuje, jak lidé dřív žili', 'Lyžařské středisko', 'Zámecká zahrada', 'Velká továrna'], 'Ve skanzenu jsou staré chalupy, mlýny a dílny. Skanzen Vysočina na Veselém Kopci je v Pardubickém kraji, i když se jmenuje Vysočina.'],
    ['Který zámek v Pardubickém kraji je na seznamu UNESCO?', ['Zámek v Litomyšli', 'Zámek Hluboká', 'Zámek Lednice', 'Zámek Kroměříž'], 'Zámek v Litomyšli je renesanční. Jeho zdi zdobí sgrafita, obrázky vyškrábané do omítky. Vypadají jako vystouplé cihly.'],
    ['Čím jsou známé Kladruby nad Labem?', ['Chovem koní', 'Výrobou perníku', 'Pivovarem', 'Lázněmi'], 'V Kladrubech nad Labem se chovají starokladrubští koně, kteří kdysi táhli kočáry císařů. Hřebčín je na seznamu UNESCO.'],
    ['Které řeky tečou Pardubickým krajem?', ['Labe, Chrudimka a Tichá Orlice', 'Vltava, Otava a Lužnice', 'Ohře a Teplá', 'Svratka a Svitava'], 'Chrudimka se v Pardubicích vlévá do Labe.'],
  ],
  where: [
    ['Ve kterém kraji se běží Velká pardubická?', 'Velká pardubická se běží na závodišti v Pardubicích.'],
    ['Ve kterém kraji je zámek Litomyšl?', 'Litomyšl leží v Pardubickém kraji.'],
    ['Ve kterém kraji je skanzen na Veselém Kopci?', 'Skanzen Vysočina na Veselém Kopci je u Hlinska v Pardubickém kraji. Jmenuje se podle Českomoravské vrchoviny, ne podle Kraje Vysočina.'],
    ['Ve kterém kraji pramení řeka Morava?', 'Morava pramení na Králickém Sněžníku v Pardubickém kraji.'],
  ],
  memo: 'Krajské město Pardubice na Labi, proslulé perníkem a koňským dostihem Velká pardubická. Nejvyšší bod Králický Sněžník, kde pramení Morava. Řeky Labe, Chrudimka, Tichá Orlice. Zámek v Litomyšli (UNESCO), rodiště Bedřicha Smetany. Skanzen na Veselém Kopci. Sousedí s Polskem.',
};

export const OLOMOUCKY: Kraj = {
  id: 'olomoucky',
  name: 'Olomoucký kraj',
  gen: 'Olomouckého kraje',
  city: 'Olomouc',
  cityNote: 'Olomouc leží na řece Moravě a je centrem úrodné Hané. Je plná historických památek.',
  near: ['moravskoslezsky', 'pardubicky', 'zlinsky'],
  write: [
    ['Na které řece leží Olomouc?', ['Morava', 'Moravě'], 'Řeka Morava teče přes celý Olomoucký kraj od severu k jihu.'],
    ['Ve kterém roce byla založena Univerzita Palackého v Olomouci?', ['1573', 'v roce 1573'], 'Je to druhá nejstarší univerzita u nás. Nejstarší je Karlova univerzita v Praze z roku 1348.', true],
    ['Který přemyslovský král byl roku 1306 zavražděn v Olomouci?', ['Václav III.', 'Václav Třetí'], 'Václav III. byl poslední Přemyslovec na českém trůnu. Bylo mu teprve 16 let.', true],
    ['Jak se jmenuje nejhlubší propast u nás?', ['Hranická propast'], 'Hranická propast je zatopená vodou. Je to nejhlubší zatopená propast na světě a její dno zatím nikdo nenašel.'],
    ['Jak se jmenuje úrodná nížina kolem řeky Moravy?', ['Haná'], 'Na Hané se pěstuje hodně obilí a cukrové řepy. Olomouc je jejím centrem.'],
  ],
  choice: [
    ['Které město je krajským městem Olomouckého kraje?', ['Olomouc', 'Přerov', 'Prostějov', 'Šumperk'], 'Přerov, Prostějov i Šumperk patří také do Olomouckého kraje.'],
    ['Kterými památkami se pyšní Olomouc?', ['Sloupem Nejsvětější Trojice a orlojem', 'Karlovým mostem a Národním divadlem', 'Hradem Špilberk', 'Chrámem sv. Barbory'], 'Sloup Nejsvětější Trojice je obrovské barokní sousoší a je na seznamu UNESCO. Olomouc má i orloj a krásné barokní kašny.', true],
    ['Jaké výstavy se pořádají v Olomouci?', ['Zahradnické výstavy Flora', 'Výstavy aut', 'Filmový festival', 'Výstavy porcelánu'], 'Na výstavách Flora Olomouc se ukazují květiny, stromy a zahrady z celého světa.'],
    ['Co je jediné v celé České republice ve Velkých Losinách?', ['Výrobna ručního papíru', 'Jaderná elektrárna', 'Výrobna klavírů', 'Pivovar'], 'Papír se tu vyrábí ručně jako před stovkami let. Výrobna funguje už přes 400 let.'],
    ['Která řeka pramení v Olomouckém kraji a teče do Baltského moře?', ['Odra', 'Morava', 'Labe', 'Vltava'], 'Odra pramení v Oderských vrších. Pak teče přes Ostravu do Polska a do Baltského moře.'],
    ['Se kterým státem sousedí Olomoucký kraj?', ['S Polskem', 'Se Slovenskem', 'S Rakouskem', 'S Německem'], 'Olomoucký kraj hraničí s Polskem na severu, v Jeseníkách.'],
    ['Jaká univerzita sídlí v Olomouci?', ['Univerzita Palackého, druhá nejstarší u nás', 'Karlova univerzita, nejstarší u nás', 'Masarykova univerzita', 'Žádná'], 'Univerzita Palackého je pojmenovaná po historikovi Františku Palackém. Masarykova univerzita je v Brně.'],
  ],
  where: [
    ['Ve kterém kraji je Hranická propast?', 'Hranická propast je u města Hranice v Olomouckém kraji.'],
    ['Ve kterém kraji stojí Sloup Nejsvětější Trojice?', 'Sloup stojí na náměstí v Olomouci.'],
    ['Ve kterém kraji je výrobna ručního papíru Velké Losiny?', 'Velké Losiny leží v Jeseníkách v Olomouckém kraji.'],
    ['Ve kterém kraji se konají výstavy Flora?', 'Flora se koná na výstavišti v Olomouci.'],
  ],
  memo: 'Krajské město Olomouc na řece Moravě, centrum Hané. Památky: Sloup Nejsvětější Trojice (UNESCO), orloj, kašny. Univerzita Palackého (1573) je druhá nejstarší u nás. Výstavy Flora. Hranická propast je nejhlubší u nás. Roku 1306 tu zavraždili krále Václava III. Ruční papír z Velkých Losin. Řeky Morava, Odra, Bečva. Sousedí s Polskem.',
};

export const MORAVSKOSLEZSKY: Kraj = {
  id: 'moravskoslezsky',
  name: 'Moravskoslezský kraj',
  gen: 'Moravskoslezského kraje',
  city: 'Ostrava',
  cityNote: 'Ostrava je třetí největší město v Česku. Kdysi tu bylo plno uhelných dolů a hutí.',
  near: ['olomoucky', 'zlinsky', 'jihomoravsky'],
  write: [
    ['Ve kterém městě se vyrábějí osobní auta Hyundai?', ['Nošovice', 'Nošovicích'], 'Továrna Hyundai stojí v Nošovicích u Frýdku-Místku, pod Beskydami.', true],
    ['Ve kterém městě se vyrábějí nákladní auta Tatra?', ['Kopřivnice', 'Kopřivnici'], 'Tatra je jedna z nejstarších automobilek na světě. Její nákladní auta vyhrávají i slavný závod Rallye Dakar.', true],
    ['Kolik metrů měří Praděd? Napiš číslo.', ['1491', '1491 m', '1491 metrů', '1 491'], 'Praděd je nejvyšší hora Moravy. Na vrcholu stojí vysoký vysílač s rozhlednou.', true],
    ['Do kterého moře se vlévá řeka Odra?', ['Baltské moře', 'Baltského moře', 'do Baltského moře', 'Baltské'], 'Odra je hlavní řeka kraje. Teče přes Ostravu do Polska a končí v Baltském moři.'],
    ['Se kterými státy sousedí Moravskoslezský kraj?', { pool: ['Polsko|Polskem', 'Slovensko|Slovenskem'], show: 'Polsko a Slovensko' }, 'Na severu je Polsko, na jihovýchodě Slovensko.'],
  ],
  choice: [
    ['Které město je krajským městem Moravskoslezského kraje?', ['Ostrava', 'Opava', 'Havířov', 'Frýdek-Místek'], 'Opava, Havířov i Frýdek-Místek jsou také v Moravskoslezském kraji. Opava bývala hlavním městem Slezska.'],
    ['Jakého uhlí je Moravskoslezský kraj zásobárnou?', ['Černého', 'Hnědého', 'Dřevěného', 'Žádného'], 'Černé uhlí se tu těžilo hluboko pod zemí v dolech. Hnědé uhlí se těží hlavně v Ústeckém kraji.'],
    ['Co je důl?', ['Podzemní prostor, kde se těží uhlí', 'Lom na kámen', 'Sklad uhlí', 'Továrna na auta'], 'Důl Michal v Ostravě je dnes muzeum. Uvidíš tam, jak horníci pracovali.'],
    ['Podle koho je pojmenované město Havířov?', ['Podle havířů, tedy horníků', 'Podle krále Václava', 'Podle řeky Havířky', 'Podle hory Havíř'], 'Havíř je starší slovo pro horníka, člověka, který pracuje v dole. Havířov vznikl teprve asi před 70 lety.'],
    ['Jaká je nejvyšší hora Moravy?', ['Praděd', 'Sněžka', 'Lysá hora', 'Ještěd'], 'Praděd je v Jeseníkách. Sněžka je sice vyšší, ale leží v Čechách, v Krkonoších.'],
    ['Ve kterém pohoří je Praděd?', ['V Jeseníkách', 'V Beskydech', 'V Krkonoších', 'Na Šumavě'], 'Jeseníky jsou nejvyšší pohoří Moravy. Lysá hora je zase nejvyšší horou Beskyd.'],
    ['Které řeky tečou Moravskoslezským krajem?', ['Odra, Opava a Ostravice', 'Vltava a Otava', 'Labe a Orlice', 'Ohře a Teplá'], 'Opava a Ostravice se vlévají do Odry. Podle Ostravice dostala jméno Ostrava.'],
    ['Co se vyrábí v Moravskoslezském kraji?', ['Osobní i nákladní auta', 'Klavíry a krajky', 'Porcelán a oplatky', 'Perník'], 'Osobní auta Hyundai jsou z Nošovic a nákladní Tatry z Kopřivnice.'],
  ],
  where: [
    ['Ve kterém kraji je uhelný důl Michal?', 'Důl Michal je v Ostravě a dnes je z něj muzeum hornictví.'],
    ['Ve kterém kraji se vyrábějí nákladní auta Tatra?', 'Tatra se vyrábí v Kopřivnici v Moravskoslezském kraji.'],
    ['Ve kterém kraji leží město Havířov?', 'Havířov je v Moravskoslezském kraji, kousek od Ostravy.'],
    ['Ve kterém kraji se vyrábějí auta Hyundai?', 'Hyundai se vyrábí v Nošovicích v Moravskoslezském kraji.'],
  ],
  memo: 'Krajské město Ostrava. Zásobárna černého uhlí (důl, havíř, Havířov, důl Michal). Auta Hyundai z Nošovic a nákladní Tatry z Kopřivnice. Řeka Odra teče do Baltského moře, dále Opava a Ostravice. Praděd (1491 m) v Jeseníkách je nejvyšší hora Moravy. Sousedí s Polskem a Slovenskem.',
};

export const ZLINSKY: Kraj = {
  id: 'zlinsky',
  name: 'Zlínský kraj',
  gen: 'Zlínského kraje',
  city: 'Zlín',
  cityNote: 'Zlín vyrostl díky obuvnické firmě Baťa. Ve městě jsou typické domky z červených cihel.',
  near: ['jihomoravsky', 'olomoucky', 'moravskoslezsky'],
  write: [
    ['Jak se jmenuje světově známá zlínská obuvnická firma?', ['Baťa'], 'Firmu založil Tomáš Baťa. Pro své dělníky dal postavit domky z červených cihel, školy i nemocnici.', true],
    ['Napiš tři národopisné oblasti, které se stýkají ve Zlínském kraji.', { pool: ['Valašsko', 'Slovácko', 'Haná'], show: 'Valašsko, Slovácko a Haná' }, 'Každá oblast má své kroje, písničky a zvyky. Na Valašsku jsou hory a dřevěné chalupy, na Slovácku vinice a pestré kroje.'],
    ['Jak se jmenuje zvyk s koňmi, který je zapsaný v UNESCO?', ['Jízda králů', 'Jízdy králů'], 'Mladí muži v krojích jedou na ozdobených koních. Uprostřed jede král, chlapec s růží v ústech. Nejznámější je jízda králů ve Vlčnově.', true],
    ['Jak se jmenují slavné lázně ve Zlínském kraji?', ['Luhačovice'], 'V Luhačovicích jsou léčivé prameny a krásné domy od architekta Dušana Jurkoviče.'],
    ['Se kterým státem sousedí Zlínský kraj?', ['Slovensko', 'Slovenskem'], 'Ze Zlínského kraje je to na Slovensko nejblíž. Hranici tvoří Bílé Karpaty a Javorníky.'],
  ],
  choice: [
    ['Které město je krajským městem Zlínského kraje?', ['Zlín', 'Uherské Hradiště', 'Kroměříž', 'Vsetín'], 'Uherské Hradiště, Kroměříž i Vsetín jsou také ve Zlínském kraji.'],
    ['Díky čemu vyrostl Zlín ve velké město?', ['Díky obuvnickému průmyslu', 'Díky těžbě uhlí', 'Díky lázním', 'Díky výrobě skla'], 'Tomáš Baťa vyráběl ve Zlíně boty, které se prodávaly po celém světě. Město díky tomu rychle rostlo.'],
    ['Co je národopisná oblast?', ['Oblast, kde se udržují určité lidové zvyky', 'Oblast s velkými továrnami', 'Chráněná krajinná oblast', 'Oblast s nejvíc obyvateli'], 'Národopisné oblasti se od sebe liší kroji, písničkami, nářečím i jídlem.'],
    ['Čeho byl Zlínský kraj kdysi centrem?', ['Velké Moravy', 'Husitského hnutí', 'Těžby stříbra', 'Římské říše'], 'Velká Morava byla první velký stát na našem území. Důležitá místa měla kolem dnešního Uherského Hradiště a Velehradu.'],
    ['Kde jsou zámek a zahrady zapsané na seznamu UNESCO?', ['V Kroměříži', 'Ve Zlíně', 'V Luhačovicích', 'Ve Vsetíně'], 'Arcibiskupský zámek v Kroměříži má krásné zahrady. Natáčely se tu i slavné filmy.'],
    ['Ve kterém městě je Valašské muzeum v přírodě?', ['V Rožnově pod Radhoštěm', 'Ve Zlíně', 'V Kroměříži', 'V Luhačovicích'], 'Je to skanzen s dřevěnými chalupami, kostelíkem a mlýnem z Valašska.'],
    ['Která řeka protéká Zlínem?', ['Dřevnice', 'Morava', 'Odra', 'Svratka'], 'Dřevnice se kousek za Zlínem vlévá do Moravy. Morava teče přes Zlínský kraj dál na jih.'],
  ],
  where: [
    ['Ve kterém kraji jsou lázně Luhačovice?', 'Luhačovice jsou ve Zlínském kraji, nedaleko hranic se Slovenskem.'],
    ['Ve kterém kraji se koná jízda králů ve Vlčnově?', 'Vlčnov je na Slovácku ve Zlínském kraji.'],
    ['Ve kterém kraji založil Tomáš Baťa svou obuvnickou firmu?', 'Baťova firma vznikla ve Zlíně.'],
    ['Ve kterém kraji jsou zámek a zahrady v Kroměříži?', 'Kroměříž je ve Zlínském kraji na řece Moravě.'],
    ['Ve kterém kraji je Velehrad, kde bylo kdysi centrum Velké Moravy?', 'Velehrad je u Uherského Hradiště ve Zlínském kraji.'],
  ],
  memo: 'Krajské město Zlín na řece Dřevnici, vyrostl díky obuvnické firmě Baťa. Stýkají se tu tři národopisné oblasti: Valašsko, Slovácko a Haná. Lázně Luhačovice, zámek v Kroměříži (UNESCO), jízda králů ve Vlčnově (UNESCO), Velehrad a Velká Morava. Sousedí se Slovenskem.',
};

export const JIHOMORAVSKY: Kraj = {
  id: 'jihomoravsky',
  name: 'Jihomoravský kraj',
  gen: 'Jihomoravského kraje',
  city: 'Brno',
  cityNote: 'Brno je druhé největší město v Česku a největší na Moravě. Leží na soutoku Svratky a Svitavy.',
  near: ['zlinsky', 'vysocina', 'olomoucky'],
  write: [
    ['Na soutoku kterých dvou řek leží Brno?', { pool: ['Svratka', 'Svitava'], show: 'Svratka a Svitava' }, 'Svitava se do Svratky vlévá na jihu Brna.'],
    ['Jak se jmenuje hrad, který stojí nad centrem Brna?', ['Špilberk'], 'Na Špilberku bylo kdysi obávané vězení. Dnes je tu muzeum a z hradeb je krásný výhled na město.'],
    ['Jak se jmenuje slavná propast v Moravském krasu?', ['Macocha'], 'Macocha je hluboká přes 138 metrů. Podle pověsti do ní zlá macecha shodila nevlastního syna.'],
    ['Na které české minci je katedrála sv. Petra a Pavla z Brna?', ['10 Kč', '10Kč', '10', '10 korun', 'deset korun', 'desetikoruna', 'desetikoruně'], 'Katedrála stojí na kopci Petrov. Poledne se z ní zvoní už v 11 hodin, podle pověsti kvůli obléhání Brna Švédy.', true],
    ['Se kterými státy sousedí Jihomoravský kraj?', { pool: ['Rakousko|Rakouskem', 'Slovensko|Slovenskem'], show: 'Rakousko a Slovensko' }, 'Na jihu je Rakousko, na jihovýchodě Slovensko. Všechny tři státy se potkávají u soutoku Moravy a Dyje.'],
  ],
  choice: [
    ['Které město je krajským městem Jihomoravského kraje?', ['Brno', 'Znojmo', 'Břeclav', 'Hodonín'], 'Znojmo, Břeclav i Hodonín leží také v Jihomoravském kraji.'],
    ['Čím je Jihomoravský kraj proslulý?', ['Pěstováním vinné révy', 'Těžbou uhlí', 'Výrobou bižuterie', 'Rybníky a výlovy'], 'Na jižní Moravě je teplo a slunečno, a tak se tu daří vinné révě. Známé vinice jsou třeba na Pálavě.'],
    ['Jaké mezinárodní závody se pořádají u Brna?', ['Motocyklové závody na Masarykově okruhu', 'Koňský dostih Velká pardubická', 'Skoky na lyžích', 'Závody lodí na Labi'], 'Masarykův okruh je závodní dráha u Brna. Jezdí se tu Velká cena motocyklů a sjíždějí se sem diváci z celé Evropy.', true],
    ['Co najdeš v Lednicko-valtickém areálu?', ['Zámky Lednice a Valtice a minaret', 'Karlův most a orloj', 'Hrad Karlštejn', 'Hrad Bezděz a Máchovo jezero'], 'Lednicko-valtický areál je obrovský park se zámky, rybníky a malými stavbami. Minaret v Lednici je vyhlídková věž vysoká přes 60 metrů. Areál je na seznamu UNESCO.', true],
    ['Co je Haná?', ['Úrodná nížina kolem řeky Moravy', 'Hora v Jeseníkách', 'Hrad u Brna', 'Druh vína'], 'Na Hané jsou úrodná pole. Leží hlavně v Olomouckém kraji a kousek zasahuje do Zlínského a Jihomoravského kraje.'],
    ['Co najdeš ve Znojmě?', ['Rotundu sv. Kateřiny', 'Baziliku sv. Prokopa', 'Pražský orloj', 'Chrám sv. Barbory'], 'Rotunda sv. Kateřiny je kulatý románský kostelík. Uvnitř jsou staré malby přemyslovských knížat.'],
    ['Která bitva se odehrála u Slavkova u Brna?', ['Bitva tří císařů', 'Bitva na Bílé hoře', 'Bitva u Lipan', 'Bitva na Moravském poli'], 'V roce 1805 tu francouzský císař Napoleon porazil ruského a rakouského císaře.'],
    ['Které řeky tečou Jihomoravským krajem?', ['Svratka, Svitava, Dyje a Morava', 'Vltava, Otava a Lužnice', 'Labe a Jizera', 'Ohře a Bílina'], 'Svratka se vlévá do Dyje a Dyje do Moravy. Morava pak teče do Dunaje a ten až do Černého moře.'],
  ],
  where: [
    ['Ve kterém kraji je propast Macocha?', 'Macocha je v Moravském krasu severně od Brna.'],
    ['Ve kterém kraji je Lednicko-valtický areál?', 'Lednice a Valtice jsou u Břeclavi v Jihomoravském kraji.'],
    ['Ve kterém kraji jsou vinice na Pálavě?', 'Pálava je u Mikulova v Jihomoravském kraji.'],
    ['Ve kterém kraji je rotunda sv. Kateřiny ve Znojmě?', 'Znojmo leží na řece Dyji v Jihomoravském kraji.'],
    ['Ve kterém kraji je hrad Špilberk?', 'Špilberk stojí v Brně.'],
  ],
  memo: 'Krajské město Brno, druhé největší v Česku, na soutoku Svratky a Svitavy. Hrad Špilberk, katedrála sv. Petra a Pavla (na minci 10 Kč), mezinárodní letiště, závody na Masarykově okruhu. Vinná réva (Pálava), Lednicko-valtický areál (UNESCO), propast Macocha, rotunda ve Znojmě. Řeky Dyje a Morava. Sousedí s Rakouskem a Slovenskem.',
};

/** Všechny kraje v pořadí, v jakém jsou v učebnici. */
export const KRAJE: Kraj[] = [
  PRAHA,
  STREDOCESKY,
  KARLOVARSKY,
  USTECKY,
  LIBERECKY,
  KRALOVEHRADECKY,
  PARDUBICKY,
  OLOMOUCKY,
  MORAVSKOSLEZSKY,
  ZLINSKY,
  JIHOCESKY,
  PLZENSKY,
  JIHOMORAVSKY,
  VYSOCINA,
];

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
