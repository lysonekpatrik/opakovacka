export type Lang = 'cs' | 'en';

/** Jak se otázka zobrazí: výběr z možností, skládání ze slovíček, nebo psaní. */
export type Format = 'choice' | 'tiles' | 'write';

export type IconName =
  | 'pen' | 'list' | 'blocks' | 'keyboard' | 'speaker' | 'mix' | 'sheet'
  | 'drop' | 'wind' | 'sun' | 'soil' | 'rock' | 'share' | 'back' | 'plus' | 'trophy';

/** Otázka s výběrem z možností. První možnost je vždy správná, při hře se zamíchají. */
export interface ChoiceQuestion {
  kind: 'choice';
  id: string;
  prompt: string;
  promptLang?: Lang;
  options: string[];
  optionsLang?: Lang;
  /** Část kvízu, např. „voda“. */
  section?: string;
  /** Otázka z pracovního listu, který dělali ve škole. */
  school?: boolean;
  /** Doplňující informace po odpovědi. */
  explain?: string;
  explainLabel?: string;
  /** Pravidlo (smí obsahovat <mark> a <b>). */
  rule?: string;
}

/** Překlad věty z češtiny do cizího jazyka. Dá se hrát výběrem, skládáním i psaním. */
export interface TranslateQuestion {
  kind: 'translate';
  id: string;
  /** Česká věta, kterou má dítě přeložit. */
  prompt: string;
  /** Volitelná anglická otázka nad zadáním (u krátkých odpovědí). */
  context?: string;
  /** Uznávané odpovědi. První je ta, kterou ukážeme jako správnou. */
  answers: string[];
  /** Špatné možnosti pro výběr. */
  wrongChoices: string[];
  /** Slovíčka navíc (chytáky) pro skládání. */
  tileExtras: string[];
  /** Skupina pro vyvážený výběr, např. kladná věta / zápor / otázka. */
  group?: string;
  /** Hlavní sloveso, podle kterého se hledají chyby typu „swims“. */
  verb?: string;
  rule?: string;
  extra?: string;
  extraLabel?: string;
}

export type Question = ChoiceQuestion | TranslateQuestion;

export interface Item {
  q: Question;
  format: Format;
}

export interface Mode {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  featured?: boolean;
  build: () => Item[];
}

export type CheatBlock =
  | { type: 'note'; title: string; text: string }
  | { type: 'rules'; title: string; rules: { label: string; example: string; translation: string; tip: string }[] }
  | { type: 'vocab'; title: string; lang: Lang; pairs: [string, string][] };

export interface Diagnosis {
  ok: boolean;
  /** Skoro správně (chybí člen, přehozená slova). Počítá se jako chyba. */
  almost?: boolean;
  /** Vysvětlení chyby. */
  tip?: string | null;
  /** Drobná poznámka i ke správné odpovědi (pravopis, velké I). */
  note?: string | null;
}

export interface Quiz {
  id: string;
  subject: SubjectId;
  grade: number;
  title: string;
  description: string;
  /** Jazyk, do kterého se překládá (kvůli výslovnosti). */
  targetLang?: Lang;
  sections?: { id: string; name: string; icon: IconName }[];
  questions: Question[];
  modes: Mode[];
  cheatsheet?: CheatBlock[];
  /** Hledání typických chyb specifických pro dané učivo. */
  diagnose?: (user: string, expected: string, q: TranslateQuestion) => string | null;
}

export type SubjectId = 'prirodoveda' | 'anglictina' | 'cestina' | 'matematika' | 'vlastiveda';

export interface Subject {
  id: SubjectId;
  name: string;
}
