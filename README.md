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

## Changelog

One Markdown file per release in `src/changelog/`, named after the version (`1.0.0.md`):

```markdown
---
version: 1.0.1
date: 2027-01-20          # the day it went live on the App Store
summary: One or two sentences; also works as the App Store's "What's New".
engine: 21                # only when the release changes the brush engine version
draft: true               # delete to publish
---

### New
- …
### Improved
- …
### Fixed
- …
```

- The page (`/changelog/`) shows releases newest first, each linkable as `/changelog/#1.0.1`. Drafts show
  in `npm run dev` only.
- The Changelog links in the top bar and footer only appear once at least one release is published,
  and until then the page asks search engines not to list it, so nothing needs switching on at launch.
  The RSS feed (`/changelog.xml`) is always there, and lists published releases only.
- `engine:` adds a note that replays of older pages may look a little different.
- Tag each release in the app repo (`git tag v1.0.1`) so the next entry is the commits since the tag,
  written for people rather than developers.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` (designed in code) |
| `/support/`, `/privacy/` | `src/content/docs/*.md(x)` (`template: splash`, no sidebar) |
| `/changelog/`, `/changelog.xml` | `src/pages/changelog.astro`, `changelog.xml.ts` from `src/changelog/*.md` |
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
