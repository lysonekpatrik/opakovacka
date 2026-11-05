# Opakovačka: pokyny pro práci na projektu

Webová aplikace s kvízy na procvičování školního učiva pro 1. stupeň ZŠ (teď hlavně 4. ročník).
Web: https://lysonekpatrik.github.io/opakovacka/ · repozitář: `lysonekpatrik/opakovacka`

Stack: React 18 + TypeScript + Vite, React Router (HashRouter), vite-plugin-pwa, Vitest.
Třídní soutěž: Supabase (PostgreSQL), popis v `supabase/schema.sql`.
Nasazení: každý push do `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages, asi za 1–2 minuty.

Komunikace s rodičem (vlastníkem) je v češtině.

## Nejčastější úkol: přidat nový kvíz

Rodič pošle fotky z učebnice, sešitu nebo pracovního listu a řekne předmět a téma.

1. **Přečti fotky** a sepiš, co je učivo. Když něco nejde přečíst nebo chybí, zeptej se.
   Když jsou na pracovním listu chybné nebo neúplné odpovědi, upozorni na ně v závěrečné zprávě.
2. **Vyber vzor:**
   - otázky s výběrem z možností → `src/content/prirodoveda/neziva-priroda.ts`
   - překlad vět (cizí jazyk) → `src/content/anglictina/sloveso-can.ts`
   - psané odpovědi v češtině (krajské město, řeka, výčet v libovolném pořadí) → `src/content/vlastiveda/kraje-data.ts`, otázky typu `write`
3. **Vytvoř soubor** `src/content/<předmět>/<téma>.ts`, export typu `Quiz` (`src/lib/types.ts`).
   - `id`: krátký slug bez diakritiky (`kraje-cr`), musí být jedinečné
   - `subject`: jedno z `cestina | matematika | anglictina | prirodoveda | vlastiveda`
   - `grade`: ročník (teď 4)
   - `sections`: části tématu s ikonou (dostupné ikony jsou v `IconName` v `types.ts`; když chybí vhodná, přidej ji do `src/components/Icon.tsx`)
   - `modes`: vždy „Mix ze všeho“ (`featured: true`); „Pracovní list“, když jsou otázky ze školy (`school: true`); pak jedna karta na každou část
   - `cheatsheet`: krátké „Zapamatuj si“ nebo tahák s pravidly a slovíčky
4. **Zaregistruj kvíz** v `src/content/index.ts` (seznam `QUIZZES`). Předmět se na úvodní obrazovce ukáže sám, jakmile má aspoň jeden kvíz.
5. **Ověř:** `npm test`, `npx tsc --noEmit`, `npm run build`. Testy v `src/content/content.test.ts` hlídají jedinečná id a správné možnosti.
6. **Commit a push do `main`** (zpráva česky, popiš, co přibylo). Počkej na úspěšný běh „Zveřejnit na GitHub Pages“ (`gh run list`).
7. **Napiš rodiči** krátce, co přibylo, odkaz na kvíz `https://lysonekpatrik.github.io/opakovacka/#/<předmět>/<id-kvízu>` a případné chyby na pracovním listu.

### Pravidla pro obsah

- Děti jsou v 4. třídě (9–10 let). Tykej, piš krátké a jasné věty, žádné cizí termíny bez vysvětlení.
- **Otázky piš vlastními slovy.** Učebnice slouží jen jako podklad: neopisuj odstavce, nedávej do aplikace fotky ani obrázky z učebnice.
- Fakta ověř. U čísel, dat a zeměpisu si při pochybnosti vyhledej zdroj.
- Každá otázka: 3–4 možnosti, první v datech je správná (při hře se zamíchají). Špatné možnosti mají být uvěřitelné, ne vtipné. Správná odpověď nesmí být vždy ta nejdelší.
- Každá otázka má `explain`: 1–3 věty „Víš, že…?“, které vysvětlí, proč to tak je, a přidají něco navíc.
- Otázky z pracovního listu, který dělali ve škole, označ `school: true`.
- Cíl je 8–12 otázek na jednu část tématu a aspoň 3 části, aby „Mix ze všeho“ měl smysl.
- Žádné osobní údaje dětí, jména spolužáků ani název školy.

## Třídní soutěž (Supabase)

- Aplikace volá jen funkce `join_class`, `submit_score`, `leaderboard`, `delete_player`. Tabulky jsou za RLS bez pravidel.
- Veřejná adresa a publishable klíč jsou v `src/config.ts`. **Tajný klíč (`sb_secret_…`) nikdy nedávej do repozitáře.**
- Kódy tříd do repozitáře nepiš (repozitář je veřejný). Novou třídu přidává rodič nebo Claude přes SQL Editor v Supabase:
  `insert into public.classes (code, name) values ('<KÓD>', '<název>');`
- Supabase není dostupný z cloudového prostředí Claude (proxy ho blokuje). Ověřovat se dá v prohlížeči nebo testovací kopií databáze (PGlite).
- `.github/workflows/keep-alive.yml` každé dva dny databázi „probudí“.

## Plán: verze 2.0 Výprava

Herní vzhled s mapou úrovní, maskotem a hvězdami. Úkoly #1–#7 v milníku „Verze 2.0: Výprava“.
Práce na Výpravě patří do větve `vyprava`, nikdy přímo do `main`, aby aplikace pro třídu fungovala.
Nové kvízy jdou rovnou do `main`.

## Technické poznámky

- Obsah kvízů je jen v `src/content/`. Logika kontroly odpovědí je v `src/lib/check.ts`, chyby specifické pro učivo řeší `diagnose` v souboru kvízu.
- Výsledky dětí se ukládají jen v jejich zařízení (`src/lib/progress.ts`), do soutěže jde jen přezdívka a body.
- Ikony aplikace: `node scripts/make-icons.cjs` (potřebuje Playwright).
- Ve verzi s HashRouterem mají odkazy tvar `#/předmět/kvíz/režim`.
