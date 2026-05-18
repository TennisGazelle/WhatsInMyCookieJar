# WhatsInMyCookieJar

One-page demo: what a browser can infer before you click “Accept Cookies,” plus a mocked cookie-jar modal.

**Agent / contributor docs:** [.cursor/README.md](.cursor/README.md)

## Layout

| Path | Role |
|------|------|
| `index.html` + `src/` | React + Vite app (production target) |
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
