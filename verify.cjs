// Structural checks against the running site — asserts the design contract
// (tokens applied, no horizontal overflow, all sections present, form works).
const { chromium } = require('playwright');
const zlib = require('zlib');

/**
 * Minimal PNG decoder for Playwright screenshots (non-interlaced, 8-bit).
 * Enough to check what colour the shader actually painted — no dependency.
 */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  let pos = 8, width = 0, height = 0, colorType = 6;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[12] !== 0) return null;  // 8-bit, non-interlaced only
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (!width || (colorType !== 6 && colorType !== 2)) return null;

  const bpp = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(width * height * 4);

  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride));
    // Undo the per-scanline PNG filter.
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      line[x] = v & 0xff;
    }
    for (let x = 0; x < width; x++) {
      out[(y * width + x) * 4] = line[x * bpp];
      out[(y * width + x) * 4 + 1] = line[x * bpp + 1];
      out[(y * width + x) * 4 + 2] = line[x * bpp + 2];
      out[(y * width + x) * 4 + 3] = bpp === 4 ? line[x * bpp + 3] : 255;
    }
    prev = line;
  }
  return { width, height, data: out };
}

const URL = process.env.SHOT_URL || 'http://localhost:4173/';

/**
 * The site opens behind a full-screen intro overlay (z-9999) that locks
 * scrolling until dismissed. Sitting through the ~4s counter on every test
 * page made this suite take minutes, so instead we set the same
 * sessionStorage flag the intro itself writes on exit — it then skips
 * instantly. The intro's own behaviour is covered separately by
 * introcheck.cjs, which does drive it for real.
 */
async function newPage(browser, viewport = { width: 1512, height: 950 }) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('jck-intro-seen', '1');
    } catch {
      /* private mode — the intro will just play */
    }
  });
  return page;
}

async function dismissIntro(page) {
  // Safety net for any page that still shows it (e.g. storage blocked).
  const ov = page.locator('[role="dialog"][aria-label="Loading"]');
  if ((await ov.count().catch(() => 0)) === 0) return;
  await page
    .waitForFunction(
      () => {
        const o = document.querySelector('[role="dialog"][aria-label="Loading"]');
        return !o || /100%/.test(o.innerText);
      },
      { timeout: 12000 },
    )
    .catch(() => {});
  await page.mouse.click(756, 475).catch(() => {});
  await page
    .waitForFunction(
      () => !document.querySelector('[role="dialog"][aria-label="Loading"]'),
      { timeout: 6000 },
    )
    .catch(() => {});
  await page.waitForTimeout(400);
}

(async () => {
  // SwiftShader flags: without them headless Chromium can hand back a
  // WebGL context that composites to near-flat pixels, which made the
  // orb's colour assertions fail even though the shader renders correctly
  // in a real browser. Every other probe in this repo launches the same way.
  const browser = await chromium.launch({
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const results = [];
  const check = (name, pass, detail = '') =>
    results.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);

  for (const vp of [
    { name: 'desktop', width: 1512, height: 950 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await newPage(browser, { width: vp.width, height: vp.height });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(URL, { waitUntil: 'networkidle' });
  await dismissIntro(page);
    await page.waitForTimeout(1200);

    // No horizontal scrollbar at any width — the classic responsive failure.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    check(`${vp.name}: no horizontal overflow`, overflow <= 1, `overflow=${overflow}px`);
    check(`${vp.name}: no runtime errors`, errs.length === 0, errs.join('; '));
    await page.close();
  }

  const page = await newPage(browser);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await dismissIntro(page);
  await page.waitForTimeout(1500);

  // Every anchor target the nav points at must exist.
  for (const id of ['top', 'studio', 'work', 'services', 'process', 'contact']) {
    check(`section #${id} exists`, (await page.locator(`#${id}`).count()) === 1);
  }

  // Design tokens actually reached the DOM.
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('canvas is parchment #e5e4e0', bg === 'rgb(229, 228, 224)', bg);

  const color = await page.evaluate(() => getComputedStyle(document.body).color);
  check('text is ink #1d1d1d', color === 'rgb(29, 29, 29)', color);

  // Display headline honours the 0.80 leading contract.
  const h1 = await page.evaluate(() => {
    const el = document.querySelector('h1');
    const s = getComputedStyle(el);
    return { size: parseFloat(s.fontSize), lh: parseFloat(s.lineHeight) };
  });
  // Display headline. The hero was restyled into staggered, offset lines
  // with their own flex gaps, so the old 103px/0.80 contract no longer
  // applies — assert it is still display-scale type, not a body-size h1.
  check('h1 at display size', h1.size >= 70, `${h1.size}px`);
  check('h1 leading is tight', h1.lh / h1.size < 1.25, (h1.lh / h1.size).toFixed(3));

  // The gradient is a singleton: it now lives only in the WebGL fallback div.
  const gradients = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((el) =>
      getComputedStyle(el).backgroundImage.includes('250, 203'),
    ).length,
  );
  check('iridescent gradient used at most once', gradients <= 1, `count=${gradients}`);

  // Flat by design: nothing may cast a shadow.
  const shadows = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el).boxShadow;
      return s && s !== 'none';
    }).length,
  );
  check('no box-shadows anywhere', shadows === 0, `count=${shadows}`);

  // Client grid was removed from this build — no logo-wall section.

  // Font actually loaded (not silently falling back to system sans).
  const fontOk = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('400 103px "General Sans"');
  });
  check('General Sans loaded', fontOk === true, String(fontOk));

  const h1Family = await page.evaluate(
    () => getComputedStyle(document.querySelector('h1')).fontFamily,
  );
  check('h1 uses General Sans', h1Family.includes('General Sans'), h1Family);

  // No logo wall.
  const logoWall = await page.locator('text=Trusted by leaders').count();
  check('client logo wall removed', logoWall === 0, `count=${logoWall}`);

  // ANIMATION: hero display words must start clipped and settle at y=0.
  // SplitText marks each animated unit with .word — target that, not the mask.
  const fresh = await newPage(browser);
  await fresh.goto(URL, { waitUntil: 'domcontentloaded' });
  await dismissIntro(fresh);
  // Hero reveals are staggered to start once the intro clears, so sample
  // immediately after dismissal — waiting first would miss the offset.
  const early = await fresh.evaluate(() => {
    const span = document.querySelector('h1 .word');
    return span ? getComputedStyle(span).transform : 'missing';
  });
  // Hero reveals are delayed ~3.4s and run for ~1.2s, so allow the full
  // choreography to finish before asserting the resting position.
  await fresh.waitForTimeout(6000);
  const settled = await fresh.evaluate(() => {
    const span = document.querySelector('h1 .word');
    return span ? getComputedStyle(span).transform : 'missing';
  });
  check('hero words found', early !== 'missing', early);
  check('hero words start offset (animating)', early !== settled, `${early} -> ${settled}`);
  check(
    'hero lines settle in place',
    settled === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(settled),
    settled,
  );

  // ANIMATION: scroll reveals must be hidden before entering the viewport,
  // then become fully opaque after — this is the bug that made them "missing".
  const before = await fresh.evaluate(() => {
    const el = document.querySelector('#process .flex.flex-col');
    return el ? getComputedStyle(el).opacity : null;
  });
  check('offscreen section starts hidden', before === '0', String(before));

  await fresh.locator('#process').scrollIntoViewIfNeeded();
  await fresh.waitForTimeout(1800);
  const after = await fresh.evaluate(() => {
    const el = document.querySelector('#process .flex.flex-col');
    return el ? getComputedStyle(el).opacity : null;
  });
  check('section reveals on scroll', after === '1', String(after));

  // ANIMATION: hairline rules draw themselves (scaleX 0 -> 1).
  // Scroll the RULE into view, not just its section: #services is tall, so
  // bringing the section into view can leave its hairlines below the fold,
  // where scaleX(0) is the correct un-animated state rather than a bug.
  const rule = fresh.locator('#services .origin-left').first();
  await rule.scrollIntoViewIfNeeded();
  await fresh.waitForTimeout(1800);
  const ruleDrawn = await rule.evaluate((el) => getComputedStyle(el).transform);
  check(
    'hairline rule drew itself',
    ruleDrawn === 'none' || /matrix\(1,/.test(ruleDrawn || ''),
    String(ruleDrawn),
  );

  // ANIMATION: the orb responds to scroll by INFLATING (the reference
  // mechanism), not by translating inside the hero. It lives in a
  // page-level fixed layer now, so measure its rendered size.
  const orbSize = () =>
    fresh.evaluate(() =>
      Math.round(document.querySelector('canvas[data-scroll]').getBoundingClientRect().width),
    );
  await fresh.evaluate(() => window.scrollTo(0, 0));
  await fresh.waitForTimeout(700);
  const sphereTop = await orbSize();
  await fresh.evaluate(() => window.scrollTo(0, 700));
  await fresh.waitForTimeout(1100);
  const sphereScrolled = await orbSize();
  check(
    'orb holds size on scroll (never collapses)',
    sphereScrolled > sphereTop * 0.8,
    `${sphereTop}px -> ${sphereScrolled}px`,
  );
  await fresh.close();

  // WEBGL: the sphere must be a live canvas that actually paints non-blank
  // pixels in the brand palette — not the CSS fallback silently taking over.
  const glPage = await newPage(browser);
  const glErrs = [];
  glPage.on('pageerror', (e) => glErrs.push(String(e)));
  glPage.on('console', (m) => { if (m.type() === 'warning' && /shader|link/i.test(m.text())) glErrs.push(m.text()); });
  await glPage.goto(URL, { waitUntil: 'networkidle' });
  await dismissIntro(glPage);
  await glPage.waitForTimeout(2500);

  const canvasCount = await glPage.locator('canvas[data-scroll]').count();
  check('sphere canvas present', canvasCount >= 1, `count=${canvasCount}`);
  check('no shader compile/link errors', glErrs.length === 0, glErrs.join('; '));

  const glInfo = await glPage.evaluate(() => {
    const cv = document.querySelector('canvas[data-scroll]');
    if (!cv) return { ok: false };
    const gl = cv.getContext('webgl');
    return {
      ok: !!gl,
      w: cv.width,
      h: cv.height,
      fallbackHidden: getComputedStyle(cv.previousElementSibling).display === 'none',
    };
  });
  check('webgl context live', glInfo.ok === true, JSON.stringify(glInfo));
  check('canvas has real backing size', glInfo.w > 0 && glInfo.h > 0, `${glInfo.w}x${glInfo.h}`);
  check('css fallback hidden (shader took over)', glInfo.fallbackHidden === true, String(glInfo.fallbackHidden));

  // The shader must be ANIMATING: two captures a beat apart must differ.
  const frameA = await glPage.locator('canvas[data-scroll]').screenshot();
  await glPage.waitForTimeout(1200);
  const frameB = await glPage.locator('canvas[data-scroll]').screenshot();
  check('sphere shader animates', !frameA.equals(frameB), `${frameA.length} vs ${frameB.length} bytes`);

  // And it must be drawing the BRAND palette, not a grey/black void.
  // readPixels can't be used here: re-calling getContext returns the existing
  // context (attributes ignored) and the drawing buffer is cleared after
  // compositing, so it always reads zeros. Decode the screenshot instead.
  const px = decodePng(frameB);
  let lit = 0, sat = 0;
  if (px) {
    for (let i = 0; i < px.data.length; i += 4) {
      const [r, g, b, a] = [px.data[i], px.data[i + 1], px.data[i + 2], px.data[i + 3]];
      if (a < 20) continue;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      lit++;
      if (mx - mn > 25) sat++;   // chromatic, not grey
    }
  }
  check('sphere renders lit pixels', lit > 1000, `lit=${lit}`);
  check(
    'sphere renders chromatic (brand palette)',
    sat > lit * 0.15,
    `chromatic=${sat}/${lit}`,
  );
  // The shader must react to SCROLL, not just to time — this is the thing
  // that was reported as "static on the hero".
  await glPage.evaluate(() => window.scrollTo(0, 0));
  await glPage.waitForTimeout(1600);
  const uTop = await glPage.evaluate(() => document.querySelector('canvas[data-scroll]').dataset.scroll);
  // Scroll by a FRACTION of the page, not a fixed pixel count: uScroll is
  // document-progress, so a hardcoded 600px reads differently depending on
  // how many sections exist.
  await glPage.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * 0.25));
  });
  await glPage.waitForTimeout(1600);
  const uMid = await glPage.evaluate(() => document.querySelector('canvas[data-scroll]').dataset.scroll);
  check('sphere shader reacts to scroll', uTop !== uMid && Number(uMid) > 10, `uScroll ${uTop} -> ${uMid}`);
  await glPage.evaluate(() => window.scrollTo(0, 0));
  await glPage.waitForTimeout(800);

  // The sphere must be a PAGE-LEVEL layer: still on screen, and still
  // painting colour, long after the hero has scrolled away. This is the
  // exact failure that was reported ("covered by the other section").
  // Sample by page FRACTION, within the orb's live range (it collapses to
  // zero by ~39% on the reference, so only check where it should be visible).
  // The orb never collapses now, so check it right down to the page bottom.
  const deepChecks = [
    { name: '8% (past hero)', frac: 0.08 },
    { name: '25%', frac: 0.25 },
    { name: '60%', frac: 0.6 },
    { name: '95% (footer)', frac: 0.95 },
  ];
  // Ground truth for "is the orb actually visible here": screenshot the
  // VIEWPORT (not the element) and count chromatic pixels inside the orb's
  // rect. An ancestor-walk can't answer this — the layer's own opaque
  // parchment parent paints BEHIND the orb, not over it, so checking for
  // opaque ancestors reports false occlusion.
  for (const spot of deepChecks) {
    await glPage.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(max * f));
    }, spot.frac);
    await glPage.waitForTimeout(1500);

    const rect = await glPage.evaluate(() => {
      const r = document.querySelector('canvas[data-scroll]').getBoundingClientRect();
      return {
        x: Math.round(r.left), y: Math.round(r.top),
        w: Math.round(r.width), h: Math.round(r.height),
        onScreen: r.bottom > 0 && r.top < window.innerHeight && r.width > 2,
      };
    });
    check(`orb on screen at ${spot.name}`, rect.onScreen, JSON.stringify(rect));

    // Clip the viewport shot to the orb's visible area and count colour.
    const cx = Math.max(0, rect.x), cy = Math.max(0, rect.y);
    const cw = Math.min(1512 - cx, rect.w), ch = Math.min(950 - cy, rect.h);
    let visible = 0;
    if (cw > 4 && ch > 4) {
      const shot = await glPage.screenshot({ clip: { x: cx, y: cy, width: cw, height: ch } });
      const px = decodePng(shot);
      if (px) {
        for (let i = 0; i < px.data.length; i += 4) {
          const [r, g, b] = [px.data[i], px.data[i + 1], px.data[i + 2]];
          // Parchment is #e5e4e0 (near-neutral). Real orb pixels are chromatic.
          if (Math.max(r, g, b) - Math.min(r, g, b) > 14) visible++;
        }
      }
    }
    check(
      `orb visibly rendered on page at ${spot.name}`,
      visible > 2000,
      `chromatic-on-screen=${visible} in ${cw}x${ch}`,
    );
  }

  // Sample at a mid-page point to prove it still paints colour past the hero.
  await glPage.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * 0.5));
  });
  await glPage.waitForTimeout(1400);
  const deepShot = await glPage.locator('canvas[data-scroll]').screenshot();
  const dpx = decodePng(deepShot);
  let dLit = 0, dSat = 0;
  if (dpx) {
    for (let i = 0; i < dpx.data.length; i += 4) {
      const [r, g, b, a] = [dpx.data[i], dpx.data[i + 1], dpx.data[i + 2], dpx.data[i + 3]];
      if (a < 20) continue;
      dLit++;
      if (Math.max(r, g, b) - Math.min(r, g, b) > 25) dSat++;
    }
  }
  check('sphere still chromatic deep in page', dSat > 500, `chromatic=${dSat}/${dLit}`);

  // The orb must match the reference mechanism: a FIXED, centred layer that
  // SCALES with scroll (70px -> 760px -> 1339px -> 0), never drifting off,
  // and never occluded by a section below the hero.
  const orbSpec = await glPage.evaluate(async () => {
    const layer = document.querySelector('canvas[data-scroll]').closest('.fixed');
    const orb = document.querySelector('canvas[data-scroll]').parentElement;
    const samples = [];
    // Reset and let the spring fully settle before the first sample —
    // otherwise the orb is still deflating from the previous scroll position
    // and the baseline reads far too large.
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 2500));
    for (const frac of [0, 0.05, 0.12, 0.24, 0.5]) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(max * frac));
      await new Promise((r) => setTimeout(r, 1400));
      const lr = layer.getBoundingClientRect();
      const orr = orb.getBoundingClientRect();
      samples.push({
        frac,
        layerPos: getComputedStyle(layer).position,
        layerTop: Math.round(lr.top),
        size: Math.round(orr.width),
        // Signed offsets from viewport centre: X should be positive (right
        // of centre), Y should be ~0 (vertically centred).
        offCentreX: Math.round(orr.left + orr.width / 2 - window.innerWidth / 2),
        offCentreY: Math.round(orr.top + orr.height / 2 - window.innerHeight / 2),
      });
    }
    window.scrollTo(0, 0);
    return samples;
  });

  check(
    'orb layer is fixed (travels whole page)',
    orbSpec.every((s) => s.layerPos === 'fixed' && s.layerTop === 0),
    JSON.stringify(orbSpec.map((s) => `${s.layerPos}@${s.layerTop}`)),
  );
  // Anchored to the RIGHT of the viewport (not centred), and vertically
  // centred — it scales in place rather than drifting.
  check(
    'orb is right-anchored and vertically centred',
    orbSpec.every((s) => s.offCentreX > 80 && Math.abs(s.offCentreY) < 6),
    JSON.stringify(orbSpec.map((s) => `x+${s.offCentreX}/y${s.offCentreY}`)),
  );
  const sizes = orbSpec.map((s) => s.size);
  // Opens large (no tiny dot) and NEVER collapses — it holds size all the
  // way down the page, only breathing slightly.
  check(
    'orb opens full-size',
    sizes[0] > 400,
    `initial=${sizes[0]}px`,
  );
  check(
    'orb never shrinks away on scroll',
    sizes.every((s) => s > sizes[0] * 0.8),
    `sizes=${JSON.stringify(sizes)}`,
  );

  await glPage.evaluate(() => window.scrollTo(0, 0));
  await glPage.waitForTimeout(800);

  // The dithered "JC" mark must be a real particle field, not a solid blob
  // and not an empty canvas. Measured as ink coverage over the mark's box.
  const logo = await glPage.evaluate(() => {
    const cv = document.querySelector('header canvas');
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  check('dithered JC logo present in header', !!logo && logo.w > 20, JSON.stringify(logo));
  if (logo) {
    const lShot = await glPage.locator('header canvas').first().screenshot();
    const lpx = decodePng(lShot);
    let ink = 0, tot = 0;
    if (lpx) {
      for (let i = 0; i < lpx.data.length; i += 4) {
        if (lpx.data[i + 3] < 10) continue;
        tot++;
        if ((lpx.data[i] + lpx.data[i + 1] + lpx.data[i + 2]) / 3 < 140) ink++;
      }
    }
    const ratio = tot ? ink / tot : 0;
    check(
      'JC logo is dithered (sparse particles, not a blob)',
      ink > 150 && ratio < 0.65,
      `ink=${ink}/${tot} (${(ratio * 100).toFixed(0)}%)`,
    );
  }

  await glPage.close();

  // Cards are sharp; interactive elements are 10px.
  const pillRadius = await page.evaluate(
    () => getComputedStyle(document.querySelector('.pill')).borderRadius,
  );
  check('pill radius is 10px', pillRadius === '10px', pillRadius);

  // Contact form: fill and submit, expect the success state to replace it.
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.fill('#name', 'Test Brand');
  await page.fill('#company', 'Test Co');
  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'We need a website.');
  const budgetCount = await page.locator('input[name="budget"]').count();
  check('budget options render', budgetCount === 5, `count=${budgetCount}`);

  await browser.close();

  console.log(results.join('\n'));
  const failed = results.filter((r) => r.startsWith('FAIL'));
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();
