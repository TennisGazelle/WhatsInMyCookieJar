# WhatsInMyCookieJar

One-page demo: what a browser can infer before you click “Accept Cookies,” plus a cookie jar that lists real same-origin cookies (name and value).

**Agent / contributor docs:** [.cursor/README.md](.cursor/README.md)

## Layout

| Path | Role |
|------|------|
| `index.html` + `src/` | React + Vite app (production target) |
| `src/components/` | Cards, modals, tables (colocated CSS) |
| `src/utils/cookies.ts` | Same-origin cookie reads for the jar modal |
| `public/favicon_io/` | Favicon package (PNG, ICO, web manifest) for [favicon.io](https://favicon.io/) |
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

## Credits

- **Favicons** — Generated with [favicon.io](https://favicon.io/) from the cookie emoji (Twemoji `1f36a.svg`). Graphics © Twitter / Twemoji contributors; [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See [`public/favicon_io/about.txt`](public/favicon_io/about.txt) for full attribution.
