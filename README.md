# Opakovačka

Webová aplikace na procvičování školního učiva pro 1. stupeň základní školy.
Děti si vyberou předmět a téma, odpovídají na otázky a po každé odpovědi se dozví, proč je to tak.

Funguje na telefonu i na počítači, dá se přidat na plochu jako aplikace a po prvním načtení funguje i bez internetu.

**Vyzkoušej ji na https://lysonekpatrik.github.io/opakovacka/**

## Co umí

- **Tři typy úkolů:** výběr z možností, skládání věty ze slovíček a psaní celé věty.
- **Vysvětlení chyb:** u angličtiny pozná typické chyby (třeba *she cans*, *can to swim*, *don't can*) a vysvětlí je česky. Drobné překlepy uzná s poznámkou.
- **Tahák** s pravidly a slovíčky ke každému tématu.
- **Výslovnost:** anglické věty si dítě může poslechnout.
- **Známka jako ve škole** a seznam chyb, které si může hned opravit.
- **Soukromí:** žádné přihlašování, žádné osobní údaje. Výsledky se ukládají jen v daném zařízení.

## Technologie

React 18, TypeScript, Vite, React Router, vite-plugin-pwa (offline a instalace na plochu), Vitest (testy).
Nasazení přes GitHub Actions na GitHub Pages.

## Spuštění na vlastním počítači

Potřebuješ [Node.js](https://nodejs.org) verze 20 nebo novější.

```bash
npm install       # jednou, stáhne knihovny
npm run dev       # spustí aplikaci na http://localhost:5173/opakovacka/
npm test          # spustí testy
npm run build     # připraví verzi pro web do složky dist/
```

## Jak přidat nový kvíz

1. Ve složce `src/content/<předmět>/` vytvoř nový soubor, třeba `src/content/cestina/vyjmenovana-slova.ts`.
   Nejjednodušší je zkopírovat `prirodoveda/neziva-priroda.ts` (otázky s výběrem) nebo `anglictina/sloveso-can.ts` (překlad vět).
2. V souboru `src/content/index.ts` ho přidej do seznamu `QUIZZES`.
3. Spusť `npm test`. Testy zkontrolují, jestli v datech nechybí odpověď nebo se neopakuje id.
4. Nahraj změny na GitHub. Za pár minut je nový kvíz na webu.

Otázky piš vlastními slovy. Učebnice slouží jen jako podklad, texty ani obrázky z ní na web nedávej.

## Struktura

```
src/
  content/          obsah kvízů, jeden soubor = jedno téma
  lib/              kontrola odpovědí, náhodný výběr, ukládání výsledků, výslovnost
  components/       části obrazovek (otázky, vysvětlení, tahák)
  pages/            obrazovky: úvod, téma, hra a výsledek
public/             ikony aplikace
scripts/            vytvoření ikon
.github/workflows/  automatické zveřejnění na GitHub Pages
```
