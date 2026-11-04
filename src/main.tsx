import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-ext-700.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/lexend/latin-400.css';
import '@fontsource/lexend/latin-ext-400.css';
import '@fontsource/lexend/latin-500.css';
import '@fontsource/lexend/latin-ext-500.css';
import '@fontsource/lexend/latin-600.css';
import '@fontsource/lexend/latin-ext-600.css';
import '@fontsource/caveat/latin-700.css';
import '@fontsource/caveat/latin-ext-700.css';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';

// Nová verze aplikace se po zveřejnění načte sama hned po otevření.
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
