import { describe, expect, it } from 'vitest';
import { distance, findTypo, hintFor, judgeTranslation, normalize, thirdPerson } from './check';
import { diagnoseCan, slovesoCan } from '../content/anglictina/sloveso-can';
import type { TranslateQuestion } from './types';

const byPrompt = (prompt: string, context?: string) =>
  slovesoCan.questions.find(
    (q): q is TranslateQuestion => q.kind === 'translate' && q.prompt === prompt && (context === undefined || q.context === context),
  )!;
const judge = (answer: string, q: TranslateQuestion) => judgeTranslation(answer, q, diagnoseCan);

describe('pomocné funkce', () => {
  it('sjednotí zápis', () => {
    expect(normalize("  I CANNOT ski!  ")).toBe("i can't ski");
    expect(normalize('I can’t swim.')).toBe("i can't swim");
  });
  it('počítá vzdálenost slov', () => {
    expect(distance('gitar', 'guitar')).toBe(1);
    expect(distance('swim', 'swim')).toBe(0);
  });
  it('tvoří tvar pro he/she', () => {
    expect(thirdPerson('fly')).toBe('flies');
    expect(thirdPerson('play')).toBe('plays');
    expect(thirdPerson('go')).toBe('goes');
    expect(thirdPerson('dance')).toBe('dances');
  });
  it('pozná jen skutečný překlep, ne gramatickou chybu', () => {
    expect(findTypo('my sister can play the gitar', 'my sister can play the guitar')).toBe('guitar');
    expect(findTypo('she can dances', 'she can dance')).toBeNull();
    expect(findTypo('he can dance', 'she can dance')).toBeNull();
  });
  it('dává nápovědu prvními písmeny', () => {
    expect(hintFor('I can swim.')).toBe('I  c__  s___.');
  });
});

describe('sloveso CAN', () => {
  const swim = byPrompt('Umím plavat.');
  const dance = byPrompt('Ona umí tancovat.');
  const ski = byPrompt('Neumím lyžovat.');
  const question = byPrompt('Umíš plavat?');
  const guitar = byPrompt('Moje sestra umí hrát na kytaru.');
  const shortYes = byPrompt('Ano, umím.', 'Can you swim?');
  const shortNo = byPrompt('Ne, neumím.', 'Can you ski?');

  it('uzná správné odpovědi včetně variant', () => {
    expect(judge('I can swim.', swim).ok).toBe(true);
    expect(judge('I cannot ski', ski).ok).toBe(true);
    expect(judge("Penguins can't fly.", byPrompt('Tučňák neumí létat.')).ok).toBe(true);
    expect(judge('Yes, I can swim.', shortYes).ok).toBe(true);
  });

  it('upozorní na malé i a chybějící apostrof, ale uzná je', () => {
    const a = judge('i can swim', swim);
    expect(a.ok).toBe(true);
    expect(a.note).toMatch(/velkým písmenem/);
    const b = judge('I cant ski', ski);
    expect(b.ok).toBe(true);
    expect(b.note).toMatch(/apostrof/);
  });

  it('vysvětlí typické chyby', () => {
    expect(judge('I can to swim.', swim).tip).toMatch(/nikdy nepíšeme to/);
    expect(judge('She cans dance', dance).tip).toMatch(/nepřidáváme -s/);
    expect(judge('She can dances.', dance).tip).toMatch(/základním tvaru/);
    expect(judge('He can dance.', dance).tip).toMatch(/ona = she/);
    expect(judge("I don't can ski", ski).tip).toMatch(/nepoužíváme do/);
    expect(judge('I can ski.', ski).tip).toMatch(/záporná/);
    expect(judge('You can swim?', question).tip).toMatch(/na začátek/);
    expect(judge('Do you can swim?', question).tip).toMatch(/nepoužíváme do/);
    expect(judge('Yes, I do.', shortYes).tip).toMatch(/nepoužíváme do/);
    expect(judge('Yes, you can.', shortYes).tip).toMatch(/Odpovídáš za sebe/);
    expect(judge("Yes, I can't", shortNo).tip).toMatch(/ano = yes/);
  });

  it('rozliší „skoro“ správně', () => {
    const r = judge('My sister can play guitar.', guitar);
    expect(r.ok).toBe(false);
    expect(r.almost).toBe(true);
    const o = judge('My dog can fast run', byPrompt('Můj pes umí rychle běhat.'));
    expect(o.almost).toBe(true);
  });

  it('uzná překlep s poznámkou', () => {
    const r = judge('My sister can play the gitar.', guitar);
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/guitar/);
  });

  it('skládání: slovíčka navíc jsou chyták', () => {
    expect(dance.tileExtras).toEqual(['cans', 'dances']);
    expect(judgeTranslation('She can dance', dance, diagnoseCan, true).ok).toBe(true);
  });

  it('každý režim vytvoří 12 otázek', () => {
    for (const m of slovesoCan.modes) expect(m.build()).toHaveLength(12);
  });
});
