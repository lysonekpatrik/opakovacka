import type { IconName } from '../lib/types';

const PATHS: Record<IconName, string> = {
  pen: '<path d="M4 20l4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20z"/><path d="M14.5 6.5l3 3"/>',
  list: '<path d="M4 7l1.5 1.5L8 6"/><path d="M4 16l1.5 1.5L8 15"/><path d="M11.5 7.5H20M11.5 16.5H20"/>',
  blocks: '<rect x="3" y="5" width="7" height="6" rx="1.5"/><rect x="14" y="5" width="7" height="6" rx="1.5"/><rect x="7" y="14" width="10" height="6" rx="1.5"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9"/>',
  speaker: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mix: '<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
  sheet: '<path d="M6 2.5h8.5L19 7v14.5H6z"/><path d="M14 2.5V7h5"/><path d="M9 12h7M9 15.5h7M9 19h4"/>',
  drop: '<path d="M12 3c3.2 4.4 6 7.7 6 11.2a6 6 0 0 1-12 0C6 10.7 8.8 7.4 12 3z"/>',
  wind: '<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 13h15a3 3 0 1 1-3 3"/><path d="M3 17h7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  soil: '<path d="M12 12V7"/><path d="M12 8c0-2.2 1.6-3.8 4.2-3.8 0 2.3-1.7 3.8-4.2 3.8z"/><path d="M12 9.5c0-1.6-1.2-2.7-3.2-2.7 0 1.7 1.3 2.7 3.2 2.7z"/><path d="M3 12.5h18M3 16.5h18M3 20.5h18"/>',
  rock: '<path d="M3 19l2.6-8L11 6.5l6 1.8L21 19z"/><path d="M11 6.5l1 5.5-4 3"/><path d="M12 12l4 2"/>',
  share: '<path d="M12 3v12"/><path d="M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7.5h14V12"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
