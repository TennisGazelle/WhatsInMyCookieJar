# Production

## What users see today

| URL / artifact | Role |
|----------------|------|
| **https://www.whatsinmycookiejar.com/** | GitHub Pages with custom domain (`public/CNAME` → `dist/CNAME` after build). Serves the **Vite production bundle** (`index.html` + hashed assets). |
| **`/prototype-goal.html`** (optional) | Copy of the original static prototype in `public/` for side-by-side QA. Not the primary entry point after the Vite cutover. |

## History

Previously, [pr-merge-handler.yaml](../.github/workflows/pr-merge-handler.yaml) **rsync’d the entire repo** to Pages with no build step. The live experience was [prototype-goal.html](../prototype-goal.html) (self-contained HTML + Tailwind CDN + inline JS). Root [index.html](../index.html) was only a Vite dev shell and did not work on static hosting.

## Current deploy model

1. `npm ci` && `npm run build` → `dist/`
2. `touch dist/.nojekyll` (disable Jekyll)
3. Upload `dist/` as the Pages artifact

Custom domain: `www.whatsinmycookiejar.com` via `public/CNAME`.

## Local production preview

```bash
npm run build
npm run preview
```

## Reference prototype

[prototype-goal.html](../prototype-goal.html) at repo root remains the behavioral reference. It links `styles/reveal-animations.css` (generated from [src/styles/reveal-animations.css](../src/styles/reveal-animations.css) on build). A copy may live under `public/` for deployed comparison URLs.
