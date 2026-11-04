import type { Lang } from './types';

export const canSpeak =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof window.SpeechSynthesisUtterance === 'function';

const LOCALES: Record<Lang, string[]> = {
  en: ['en-GB', 'en'],
  cs: ['cs-CZ', 'cs'],
};

/** Přečte text nahlas hlasem zařízení. */
export function speak(text: string, lang: Lang = 'en') {
  if (!canSpeak) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALES[lang][0];
    u.rate = 0.85;
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang.replace('_', '-').startsWith(LOCALES[lang][0])) ??
      voices.find((v) => v.lang.startsWith(LOCALES[lang][1]));
    if (voice) u.voice = voice;
    synth.speak(u);
  } catch {
    /* hlas není dostupný */
  }
}

if (canSpeak) {
  try {
    window.speechSynthesis.getVoices();
  } catch {
    /* nic */
  }
}
