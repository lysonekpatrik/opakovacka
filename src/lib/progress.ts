/**
 * Výsledky se ukládají jen v tomto zařízení (localStorage).
 * Aplikace nikam neposílá žádné údaje o dětech.
 */
const KEY = 'opakovacka:v1';

interface Store {
  best: Record<string, number>;
  plays: Record<string, number>;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<Store>;
      return { best: s.best ?? {}, plays: s.plays ?? {} };
    }
  } catch {
    /* úložiště není dostupné, třeba v anonymním okně */
  }
  return { best: {}, plays: {} };
}

function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* nevadí, jen se výsledek nezapamatuje */
  }
}

export function bestScore(quizId: string, modeId: string): number | null {
  const v = read().best[`${quizId}/${modeId}`];
  return typeof v === 'number' ? v : null;
}

export function bestForQuiz(quizId: string): number | null {
  const s = read();
  const vals = Object.entries(s.best)
    .filter(([k]) => k.startsWith(`${quizId}/`))
    .map(([, v]) => v);
  return vals.length ? Math.max(...vals) : null;
}

export function recordResult(quizId: string, modeId: string, percent: number) {
  const s = read();
  const k = `${quizId}/${modeId}`;
  if (s.best[k] === undefined || percent > s.best[k]) s.best[k] = percent;
  s.plays[quizId] = (s.plays[quizId] ?? 0) + 1;
  write(s);
}

export function flag(name: string): boolean {
  try {
    return localStorage.getItem(`opakovacka:${name}`) === '1';
  } catch {
    return false;
  }
}

export function setFlag(name: string) {
  try {
    localStorage.setItem(`opakovacka:${name}`, '1');
  } catch {
    /* nevadí */
  }
}
