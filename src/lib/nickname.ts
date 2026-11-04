/**
 * Kontrola přezdívky. Stejná pravidla hlídá i databáze (supabase/schema.sql, funkce nickname_ok),
 * tady jsou kvůli okamžité zpětné vazbě.
 */

const ALLOWED = /^[A-Za-zÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž0-9 -]+$/;
const BLOCKED =
  /(kurv|pica|pico|picu|pice|prdel|hovn|srac|sral|serou|kokot|curak|debil|idiot|mrd|jeb|zmrd|buzn|kreten|hajzl|chcan|kund|dement|retard|negr|cikan|fuck|shit|bitch|dick|porn|sex|nazi|hitler|penis|vagin)/;

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function cleanNickname(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

/** Vrátí, co je s přezdívkou špatně, nebo null, když je v pořádku. */
export function nicknameProblem(raw: string): string | null {
  const n = cleanNickname(raw);
  if (n.length < 3) return 'Přezdívka musí mít aspoň 3 znaky.';
  if (n.length > 16) return 'Přezdívka může mít nejvýš 16 znaků.';
  if (!ALLOWED.test(n)) return 'Použij jen písmena, číslice, mezeru nebo pomlčku.';
  if (BLOCKED.test(stripAccents(n).toLowerCase())) return 'Tuhle přezdívku nejde použít. Vymysli jinou.';
  return null;
}

const IDEAS: [string, string][] = [
  ['Rychlá', 'sova'], ['Chytrý', 'ježek'], ['Veselá', 'veverka'], ['Statečný', 'lev'], ['Tichá', 'liška'],
  ['Mrštný', 'gepard'], ['Bystrá', 'vydra'], ['Zvídavý', 'mýval'], ['Skákavá', 'žába'], ['Odvážný', 'orel'],
  ['Mazaná', 'kočka'], ['Usměvavý', 'delfín'], ['Pilná', 'včelka'], ['Silný', 'medvěd'], ['Hbitá', 'ještěrka'],
  ['Moudrý', 'puštík'], ['Hravá', 'vydra'], ['Kouzelný', 'drak'], ['Šikovná', 'myška'], ['Rychlý', 'zajíc'],
];

/** Náhodný nápad na přezdívku, např. „Bystrá vydra 27“. */
export function nicknameIdea(): string {
  const [adj, noun] = IDEAS[Math.floor(Math.random() * IDEAS.length)];
  const name = `${adj} ${noun}`;
  const num = String(Math.floor(Math.random() * 90) + 10);
  return name.length + 3 <= 16 ? `${name} ${num}` : name;
}
