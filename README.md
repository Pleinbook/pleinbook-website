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
| `/docs/...` | `src/content/docs/docs/*.mdx`: one page per topic, its sections listed in the left panel |

## Writing pages

- Manual pages are drafts (`draft: true`) until the manual launches: they show in `npm run dev` with
  a banner and are left out of production builds. Delete the line to publish a page.
- One page per topic, ordered by `sidebar.order`. Each `##` section shows in the left panel
  (`ManualSidebar.astro`, from `src/data/manual.ts`), so people can jump to it or scroll through.
- Under every `##`, add `<SearchTerms terms="…" />`: hidden words people might search for (synonyms,
  US spellings, other apps' names for things), which Pagefind indexes for that section.
- Paid features: give the page `sidebar: { badge: { text: Unlock, variant: note } }`, and use
  `<ProFeature feature="…" />` (in `.mdx`) where a free page mentions a paid feature. Name or count
  premium items (covers, papers, brush packs) only on the Pleinbook Unlock page; elsewhere, link to it.
- Images: `<Screenshot>` (a whole screen, or a crop with `width`), `<UiCrop>` (a strip of the
  interface beside its table) and `<ShotRow>` (labelled crops side by side). Videos, badges and the
  OG image go in `public/`.

## Manual screenshots

The manual's images are made by the app, not by hand:

1. In the app repo, `UITests/ManualScreenshotTests.swift` paints, opens each screen and saves a PNG.
   Run it on the iPad mini (A17 Pro) simulator, in portrait:

   ```sh
   cd ../Pleinbook && xcodegen generate
   TEST_RUNNER_PB_MANUAL_SHOTS=/tmp/pb-shots xcodebuild test -project Pleinbook.xcodeproj \
     -scheme Pleinbook -destination 'platform=iOS Simulator,name=iPad mini (A17 Pro)' \
     -derivedDataPath build/dd-ios "-only-testing:PleinbookUITests/ManualScreenshotTests"
   ```

   `testImportImage` needs a landscape picture in the simulator's photo library first
   (`xcrun simctl addmedia booted picture.jpg`). `testPageMenu` runs on the 13-inch iPad Pro, where
   the whole menu fits.
2. Here, `node scripts/manual-shots.mjs /tmp/pb-shots` turns the PNGs into `src/assets/manual/*.webp`:
   whole screens scaled to 1000 px, and crops (the top bar, the tool rail, the kit ring, the brush
   studies…) cut by the boxes listed in the script. Check any crop whose screen has changed.

## Keeping the manual current

The manual was last checked against app commit **`c1cb40f`** (10 Nov 2026, "Pencil pressure
calibration; similarity review round 3; probe material"). To catch up:

```sh
git -C ../Pleinbook log --oneline c1cb40f..main
git -C ../Pleinbook diff --stat c1cb40f..main -- App Packages
```

Look for new or renamed settings, menu items and buttons, brushes and brush packs, premium sets,
import and export formats, and anything the manual describes that has gone. Update the pages, retake
the screenshots that changed, then move the commit above to the one you checked against.

## Look

Built to feel like the app: cream paper with grain, floating glass chrome, Fraunces for headings
(a trimmed copy in `public/fonts/`, made from `@fontsource-variable/fraunces` by
`scripts/make-fonts.sh`, declared in `theme.css`) and system type for the rest.

- `src/styles/theme.css`: tokens, the paper grain and the `.pb-glass` material.
- `src/styles/starlight.css`: puts the manual in the same clothes (capsule header, floating sidebar).
- `src/components/AppMock.astro`: the iPad on the homepage, framing a real screenshot
  (`src/assets/screenshots/`; the current one is a placeholder).
- `src/scripts/bristle.ts` + `src/data/strokes.ts`: seeded bristle brush strokes on `<canvas data-strokes>`.
- `src/data/mixes.ts`: real mixing-engine colours. Re-sample them if the engine changes.
- Icons: [Lucide](https://lucide.dev) (ISC), inlined by `src/components/Icon.astro`.
