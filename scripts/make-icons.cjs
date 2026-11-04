// Vytvoří ikony aplikace do složky public/.
// Spuštění: npx -y playwright@1 install chromium && node scripts/make-icons.cjs
const { writeFileSync } = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

function iconSvg({ rounded = true, scale = 1 } = {}) {
  const t = `translate(256 256) scale(${scale}) translate(-256 -256)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="#2846C4"/>
  <g transform="${t}">
    <g transform="rotate(-6 256 256)">
      <rect x="132" y="100" width="248" height="312" rx="20" fill="#FFFFFF"/>
      <path d="M150 178H362M150 228H362M150 278H362M150 328H362M150 378H362" stroke="#C3D0EE" stroke-width="7" stroke-linecap="round"/>
      <path d="M184 100V412" stroke="#E39A9A" stroke-width="6"/>
      <path d="M204 262L246 306L334 196" fill="none" stroke="#C2302A" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>
`;
}

const out = path.join(__dirname, '..', 'public');
writeFileSync(path.join(out, 'favicon.svg'), iconSvg());

const jobs = [
  ['icon-192.png', 192, { rounded: true }],
  ['icon-512.png', 512, { rounded: true }],
  ['icon-maskable-512.png', 512, { rounded: false, scale: 0.78 }],
  ['apple-touch-icon.png', 180, { rounded: false, scale: 0.9 }],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, size, opts] of jobs) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${iconSvg(opts)}`);
    await page.screenshot({ path: path.join(out, name), omitBackground: true });
  }
  await browser.close();
  console.log('Ikony jsou hotové.');
})();
