export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function take<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Vybere n položek tak, aby se skupiny střídaly (např. kladná věta, zápor, otázka). */
export function balanced<T>(arr: readonly T[], groupOf: (x: T) => string, n: number): T[] {
  const groups = new Map<string, T[]>();
  for (const x of shuffle(arr)) {
    const g = groupOf(x);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(x);
  }
  const lists = [...groups.values()];
  const out: T[] = [];
  let i = 0;
  while (out.length < n && lists.some((l) => l.length)) {
    const l = lists[i % lists.length];
    if (l.length) out.push(l.shift()!);
    i++;
  }
  return shuffle(out);
}
