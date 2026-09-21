# JC Knox — studio site

Editorial one-pager for a founder-led brand & digital studio. Built to the
OFF+BRAND style reference in `DESIGN.md`: warm parchment canvas, one typeface,
one chromatic moment, no shadows.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production bundle into dist/
npm run preview   # serve the built bundle on :4173
npm run lint
```

## Editing content

**Everything you'd want to change lives in `src/content.ts`** — studio name,
email, nav, services, projects, client list, testimonials, budget bands.
No component needs touching to rebrand or reword the site.

## Contact form

The form posts JSON to `VITE_CONTACT_ENDPOINT`. Create `.env`:

```
VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Any endpoint accepting a JSON POST works (Formspree, Basin, your own API).
**With no endpoint set the form falls back to opening a prefilled mail draft**,
so enquiries are never silently dropped.

## The design system

Tokens live in `src/index.css` — once as Tailwind v4 `@theme` (so utilities
like `bg-parchment`, `text-display`, `rounded-cards` exist) and once on
`:root` for plain CSS. The whole visual language is six primitive classes:

| Class | Purpose |
|---|---|
| `.shell` | 1400px max width + 30px gutter. Every section uses it. |
| `.label` | 11px all-caps, 0.05em tracking — museum signage. |
| `.ghost-link` | The only text-link style. Arrow slides, underline wipes in. |
| `.pill` | The one state-change button; inverts to ink on hover. |
| `.grid-paper` | White card with a ruled grid — used by work/service tiles. |
| `.display` / `.headline` | Fluid `clamp()` display type at 0.80 leading. |

Rules worth not breaking: cards are `0px` radius, interactive elements are
`10px`. The iridescent gradient appears **exactly once**, in the hero sphere.
Nothing casts a shadow.

### Font

The design calls for *Ataero Retina OB Edition*, which is a licensed custom
face and is not bundled here — the page currently renders in the system sans
fallback. Drop the licensed woff2 into `public/fonts/` and add an `@font-face`
block at the top of `src/index.css`; the `--font-ataero-retina-ob-edition`
token already points at the family name, so nothing else changes.

## Verification

`verify.cjs` asserts the design contract against the running build — token
values in the DOM, 0.80 display leading, the gradient singleton, zero
box-shadows, the 2×5 logo grid, and no horizontal overflow at four viewports.

```bash
npm run build && npm run preview &   # then:
node verify.cjs                      # 23/23 checks
node shot.cjs                        # writes shot-*.png
```
