# WhatsInMyCookieJar — AI agent guidelines

One-page educational demo: what browsers can infer before cookie consent, plus a mocked “cookie jar” modal.

**Human README:** [../README.md](../README.md)

**Documentation hub:** [.cursor/README.md](README.md) — link to spokes; do not duplicate long reference content here.

---

## Update docs when code changes

Whenever you change code, update **all relevant documentation**. Do not leave documentation outdated.

| Change type | Update |
|-------------|--------|
| Deploy, domain, prod vs prototype | [PRODUCTION.md](PRODUCTION.md) |
| React structure, state, browser APIs | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Reveal timing, CSS classes, motion | [ANIMATIONS.md](ANIMATIONS.md) |
| GitHub Actions, build steps | [CICD.md](CICD.md) |
| Conventions or hub layout | This file and [README.md](README.md) |

Also update [../README.md](../README.md) when user-facing run/deploy instructions change.

---

## Code conventions

- **No magic strings.** Animation class names, stagger delays, and repeated literals belong in [../src/constants/reveal.ts](../src/constants/reveal.ts) (or a shared constants module). Import where needed.
- **Single source for reveal CSS:** [../src/styles/reveal-animations.css](../src/styles/reveal-animations.css) — imported by React; `prebuild` copies to `styles/` and `public/styles/` for [../prototype-goal.html](../prototype-goal.html). Do not fork animation rules into `App.css`.
- **Production target:** Vite build output (`dist/`) deployed to GitHub Pages — see [PRODUCTION.md](PRODUCTION.md).

---

## Repo relationship

This directory is a **nested git repository** (`TennisGazelle/WhatsInMyCookieJar`), often checked out inside the Arbor workspace. Agent work and docs live here only unless Arbor explicitly integrates this project.
