// Screenshot harness: boots the built site and captures desktop + mobile.
const { chromium } = require('playwright');
const path = require('path');

const OUT = process.env.SHOT_DIR || '.';
const URL = process.env.SHOT_URL || 'http://localhost:4173/';

(async () => {
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1512, height: 950 } });
  await desktop.goto(URL, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(2500);
  await desktop.screenshot({ path: path.join(OUT, 'shot-hero.png') });
  // Scroll the whole page so every in-view animation has fired before the full capture.
  await desktop.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
  });
  await desktop.waitForTimeout(1200);
  await desktop.screenshot({ path: path.join(OUT, 'shot-full.png'), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(URL, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(2500);
  await mobile.screenshot({ path: path.join(OUT, 'shot-mobile.png') });

  // Surface any runtime console errors instead of silently passing.
  const errors = [];
  desktop.on('pageerror', (e) => errors.push(String(e)));
  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join('\n') : 'no page errors');

  await browser.close();
})();
