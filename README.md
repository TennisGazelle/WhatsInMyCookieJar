# WhatsInMyCookieJar

One-page demo: what a browser can infer before you click “Accept Cookies,” plus a cookie jar that lists real same-origin cookies (name and value).

**Agent / contributor docs:** [.cursor/README.md](.cursor/README.md)

## Layout

| Path | Role |
|------|------|
| `index.html` + `src/` | React + Vite app (production target) |
| `src/components/` | Cards, modals, tables (colocated CSS) |
| `src/utils/cookies.ts` | Same-origin cookie reads for the jar modal |
| `prototype-goal.html` | Original static reference implementation |
| `src/styles/reveal-animations.css` | Shared text/card reveal animations (copied to `styles/` on build for prototype) |
| `.cursor/` | Hub/spoke documentation for agents |

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
npm run preview
```

Production deploy (GitHub Pages, `www.whatsinmycookiejar.com`) is described in [.cursor/PRODUCTION.md](.cursor/PRODUCTION.md).
