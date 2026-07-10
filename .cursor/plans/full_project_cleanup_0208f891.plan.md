---
name: Full project cleanup
overview: Remove leftover assets and dead code from the hero/polish iterations, fix stale image references, and verify the app still builds cleanly.
todos:
  - id: assets-cleanup
    content: Remove unused images/.DS_Store; retarget pets gallery off hero-bg.png; normalize video path
    status: pending
  - id: dead-code
    content: Delete unused scroll-reveal hook/component; grep for stale imports/paths
    status: pending
  - id: verify-build
    content: Lint touched files and run production build
    status: pending
isProject: false
---

# Full project cleanup

Default scope: **code + assets + reference fixes + lint/build** — not another visual redesign.

## Assets
In [`public/images/`](public/images/):

- Delete unused **`story-field.jpg`** (story section uses video only; no code references).
- Delete **`.DS_Store`**.
- Retarget the only remaining `hero-bg.png` use in [`src/components/product/product-page-client.js`](src/components/product/product-page-client.js) (pets gallery) to an existing product/category image (e.g. `product-rabbit.png`), then delete obsolete **`hero-bg.png`**.
- Keep **`hero-bg.jpg`** (hero) and **`video.MP4`** (story). Normalize the story video `src` to `/images/video.mp4` for case-safe URLs (same file on macOS).

## Dead code
Delete unused modules (no imports elsewhere):

- [`src/hooks/use-scroll-reveal.js`](src/hooks/use-scroll-reveal.js)
- [`src/components/ui/scroll-reveal.js`](src/components/ui/scroll-reveal.js)

Already gone from earlier polish (confirm no stale imports): `farm-marquee.js`, `parallax-strip.js`.

## Reference / hygiene pass
- Grep for stale paths (`hero-bg.png`, `story-field`, `new1`/`new2`, deleted components).
- Quick scan of [`src/components/home/`](src/components/home/) + chrome for leftover comments/debug only if present.
- No plan-file edits; no new features.

## Verify
- Run lint on touched areas and `npm run build` to confirm a clean production build.
