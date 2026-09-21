// Verify OUR intro: counter climbs, messages rotate, gate waits for a
// click, overlay leaves, and the page is scrollable afterwards.
const { chromium } = require('playwright');

const URL = process.env.SHOT_URL || 'http://localhost:4173/';
let pass = 0, fail = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (ok) pass++;
  else fail++;
};

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1512, height: 950 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const read = () =>
    page.evaluate(() => {
      const ov = document.querySelector('[role="dialog"][aria-label="Loading"]');
      if (!ov) return { gone: true };
      const txt = ov.innerText.replace(/\s+/g, ' ').trim();
      const m = txt.match(/(\d+)%/);
      return {
        gone: false,
        pct: m ? Number(m[1]) : null,
        text: txt,
        z: getComputedStyle(ov).zIndex,
        pos: getComputedStyle(ov).position,
        htmlOverflow: getComputedStyle(document.documentElement).overflow,
      };
    });

  const first = await read();
  check('intro overlay present on load', !first.gone, JSON.stringify(first).slice(0, 110));
  check('overlay is fixed at z-9999', first.pos === 'fixed' && first.z === '9999', `${first.pos}/${first.z}`);
  check('page is locked while intro is up', first.htmlOverflow === 'hidden', first.htmlOverflow);

  // Watch the counter and the rotating copy.
  const seenPct = new Set(), seenMsg = new Set();
  for (let i = 0; i < 30; i++) {
    const s = await read();
    if (s.gone) break;
    if (s.pct != null) seenPct.add(s.pct);
    const msg = s.text.replace(/\d+%/, '').replace(/JC KNOX.*?(LOADING|READY)/s, '').trim();
    if (msg) seenMsg.add(msg.slice(0, 40));
    await page.waitForTimeout(160);
  }
  const pcts = [...seenPct].sort((a, b) => a - b);
  check('counter climbs', pcts.length > 5 && pcts[pcts.length - 1] >= 99, `${pcts.length} values, max=${pcts[pcts.length - 1]}`);
  check('status line rotates', seenMsg.size >= 2, `${seenMsg.size} distinct messages`);

  // The gate: overlay should still be up, waiting for a click.
  await page.waitForTimeout(900);
  const gated = await read();
  check('waits for click (does not auto-dismiss)', !gated.gone, gated.gone ? 'already gone' : gated.text.slice(-40));

  // Enter.
  await page.mouse.click(756, 475);
  await page.waitForTimeout(1500);
  const after = await read();
  check('overlay leaves after click', after.gone, after.gone ? '' : JSON.stringify(after).slice(0, 80));

  const unlocked = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
  check('page unlocked after intro', unlocked !== 'hidden', unlocked);

  // Use a real wheel event, not window.scrollTo: Lenis intercepts
  // programmatic scrolls, so scrollTo would report 0 even when the page
  // scrolls perfectly well for a user.
  await page.mouse.move(756, 475);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1200);
  const scrolled = await page.evaluate(() => window.scrollY);
  check('page scrolls after intro', scrolled > 100, `scrollY=${scrolled}`);

  // Second visit in the same tab should skip it.
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  const revisit = await read();
  check('intro skipped on repeat visit (sessionStorage)', revisit.gone, revisit.gone ? '' : 'still showing');

  check('no page errors', errs.length === 0, errs.slice(0, 2).join('; '));

  console.log(`\n${pass}/${pass + fail} intro checks passed`);
  await browser.close();
  if (fail) process.exitCode = 1;
})();
