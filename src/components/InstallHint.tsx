import { useEffect, useState } from 'react';
import { flag, setFlag } from '../lib/progress';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** Nápověda, jak si přidat Opakovačku na plochu telefonu. */
export function InstallHint() {
  const [hidden, setHidden] = useState(() => isStandalone() || flag('install-hint-hidden'));
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (hidden) return null;

  const close = () => {
    setFlag('install-hint-hidden');
    setHidden(true);
  };

  return (
    <aside className="install" aria-label="Přidat na plochu">
      <div className="install-text">
        <h2 className="install-title">Přidej si Opakovačku na plochu</h2>
        {prompt ? (
          <p>Bude se otevírat jako aplikace a půjde i bez internetu.</p>
        ) : isIOS() ? (
          <p>
            V Safari klepni dole na tlačítko <b>Sdílet</b> (čtvereček se šipkou) a vyber <b>Přidat na plochu</b>.
          </p>
        ) : (
          <p>
            V prohlížeči otevři menu (tři tečky) a vyber <b>Přidat na plochu</b> nebo <b>Nainstalovat aplikaci</b>.
          </p>
        )}
      </div>
      <div className="row">
        {prompt && (
          <button
            type="button"
            className="primary small"
            onClick={async () => {
              await prompt.prompt();
              setPrompt(null);
              close();
            }}
          >
            Přidat na plochu
          </button>
        )}
        <button type="button" className="ghost" onClick={close}>
          Skrýt
        </button>
      </div>
    </aside>
  );
}
