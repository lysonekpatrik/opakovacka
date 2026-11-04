import { Icon } from './Icon';
import { canSpeak, speak } from '../lib/speech';
import type { Lang } from '../lib/types';

export function SpeakButton({ text, lang = 'en', label }: { text: string; lang?: Lang; label?: string }) {
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      className="say"
      onClick={() => speak(text, lang)}
      aria-label={label ? undefined : 'Poslechnout anglicky'}
    >
      <Icon name="speaker" size={20} />
      {label && <span>{label}</span>}
    </button>
  );
}
