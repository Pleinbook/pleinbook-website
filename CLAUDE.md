# Pleinbook website — working rules

Static marketing site and manual for the Pleinbook iPad app (app repo: `Pleinbook/Pleinbook`,
spec in its `docs/Design & MVP Spec.md`). See README.md for layout and conventions.

- **Static only.** Hosted on Cloudflare Pages from `dist/`. No SSR adapter, no server functions.
- Brush engines are **Dry** (stamping), **Wet** (smudge) and **Lasso** (fill). Never "Pixel" or "Colour Smudge".
- Name Krita only to describe compatibility ("imports Krita brush bundles"). The footer says Pleinbook is not affiliated with Krita.
  Never copy text or images from Krita's manual or website.
- New pages start as `draft: true`; the free/paid split is marked with the `Unlock` sidebar badge and `<ProFeature>`.
- **Look like the app.** Grained cream paper (`--pb-grain`), Fraunces for headings (`--pb-font-display`) and
  system type for everything else, and chrome as floating glass
  (`.pb-glass` in `src/styles/theme.css`; `starlight.css` applies it to the manual). The brushmark and its
  blue → green gradient come from the app icon. Check light, dark and 375 px wide before calling a change done.
- Mixing swatches and painted strokes use real engine colours (`src/data/mixes.ts`, sampled from the app repo's
  `docs/mixing/ladders.png`). Don't invent mixes.
- Permissive dependencies only (MIT/BSD/ISC/Apache; fonts under the SIL Open Font License); credit them on
  `/docs/reference/acknowledgements/`. Fonts are self-hosted, never loaded from Google.

```bash
npm run dev
npm run build
```
