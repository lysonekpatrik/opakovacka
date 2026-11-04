import { describe, expect, it } from 'vitest';
import { cleanNickname, nicknameIdea, nicknameProblem } from './nickname';
import { pointsLabel } from './league';

describe('přezdívky', () => {
  it('uzná běžné přezdívky', () => {
    expect(nicknameProblem('Rychlá sova')).toBeNull();
    expect(nicknameProblem('Ježek-7')).toBeNull();
    expect(nicknameProblem('  Bystrá   vydra 27 ')).toBeNull();
  });
  it('odmítne krátké, dlouhé a se zvláštními znaky', () => {
    expect(nicknameProblem('ab')).toMatch(/aspoň 3/);
    expect(nicknameProblem('a'.repeat(17))).toMatch(/nejvýš 16/);
    expect(nicknameProblem('<script>')).toMatch(/jen písmena/);
    expect(nicknameProblem('sova😀')).toMatch(/jen písmena/);
  });
  it('odmítne sprostá slova i s diakritikou', () => {
    expect(nicknameProblem('Kokotko')).toMatch(/nejde použít/);
    expect(nicknameProblem('Čurák')).toMatch(/nejde použít/);
    expect(nicknameProblem('PRDEL 1')).toMatch(/nejde použít/);
  });
  it('vyčistí mezery', () => {
    expect(cleanNickname('  Rychlá   sova ')).toBe('Rychlá sova');
  });
  it('nápady jsou vždy platné přezdívky', () => {
    for (let i = 0; i < 200; i++) expect(nicknameProblem(nicknameIdea())).toBeNull();
  });
});

describe('body', () => {
  it('skloňuje slovo bod', () => {
    expect(pointsLabel(0)).toBe('0 bodů');
    expect(pointsLabel(1)).toBe('1 bod');
    expect(pointsLabel(3)).toBe('3 body');
    expect(pointsLabel(12)).toBe('12 bodů');
  });
});
