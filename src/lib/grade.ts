/** Převede výsledek na školní známku, jak ji děti znají ze žákovské. */
export function gradeFor(percent: number): { grade: number | null; word: string; message: string } {
  if (percent >= 90)
    return { grade: 1, word: 'Výborně', message: percent === 100 ? 'Bez jediné chyby! Tohle učivo máš v malíčku.' : 'Skoro všechno správně. Jen tak dál!' };
  if (percent >= 75) return { grade: 2, word: 'Chvalitebně', message: 'Moc dobrá práce. Pár věcí si ještě zopakuj.' };
  if (percent >= 50) return { grade: 3, word: 'Dobře', message: 'Půlku už umíš. Projdi si chyby a zkus to znovu.' };
  if (percent >= 30) return { grade: 4, word: 'Dostatečně', message: 'Mrkni do taháku a na vysvětlení u otázek. Napodruhé to půjde líp.' };
  return { grade: null, word: 'Zkus to znovu', message: 'Nevadí. Přečti si tahák a vysvětlení u otázek a zkus to ještě jednou.' };
}
