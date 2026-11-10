# pleinbook.com

The Pleinbook website: homepage, manual, support, privacy and changelog. Built with
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build), output as static files.

```bash
npm install
npm run dev      # http://localhost:4321, drafts included
npm run build    # static site in dist/, drafts left out
```

## Hosting (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- No adapter or functions: every page is static HTML.

## App Store link

`src/data/site.ts` holds the App Store status (`soon`, `preorder` or `live`) and URL. Every App Store
button and the closing section of the homepage follow it, so pre-orders and launch day are one edit.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` (designed in code) |
| `/support/`, `/privacy/`, `/changelog/` | `src/content/docs/*.md` (`template: splash`, no sidebar) |
| `/docs/...` | `src/content/docs/docs/<section>/*.md` |

## Writing pages

- Every stub has `draft: true`. Drafts show in `npm run dev` with a banner and are left out of
  production builds. Delete the line to publish the page.
- Each stub has a comment listing what the page should cover. Delete it once the page is written.
- Sidebar groups fill themselves from their folders; order pages with `sidebar.order`.
  A new section folder needs one line in `astro.config.mjs`.
- Paid features: give the page `sidebar: { badge: { text: Unlock, variant: note } }`, and use
  `<ProFeature feature="…" />` (in `.mdx`) where a free page mentions a paid feature.
- Screenshots go in `src/assets/<section>/`; videos, badges and the OG image go in `public/`.

## Look

Built to feel like the app: cream paper with grain, floating glass chrome, Fraunces for headings
(self-hosted via `@fontsource-variable/fraunces`, imported in `theme.css`) and system type for the rest.

- `src/styles/theme.css`: tokens, the paper grain and the `.pb-glass` material.
- `src/styles/starlight.css`: puts the manual in the same clothes (capsule header, floating sidebar).
- `src/components/AppMock.astro`: the iPad on the homepage, framing a real screenshot
  (`src/assets/screenshots/`; the current one is a placeholder).
- `src/scripts/bristle.ts` + `src/data/strokes.ts`: seeded bristle brush strokes on `<canvas data-strokes>`.
- `src/data/mixes.ts`: real mixing-engine colours. Re-sample them if the engine changes.
- Icons: [Lucide](https://lucide.dev) (ISC), inlined by `src/components/Icon.astro`.
