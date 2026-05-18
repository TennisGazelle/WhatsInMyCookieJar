# CICD

## Workflow

**File:** [.github/workflows/pr-merge-handler.yaml](../.github/workflows/pr-merge-handler.yaml)

**Triggers:** push to `master`, `workflow_dispatch`

**Permissions:** `contents: read`, `pages: write`, `id-token: write`

## Deploy steps

1. Checkout repository
2. `actions/setup-node@v4` — Node **22**, npm cache
3. `npm ci`
4. `npm run build` (`tsc -b && vite build` → `dist/`)
5. `touch dist/.nojekyll`
6. `actions/upload-pages-artifact` — path `dist`
7. `actions/deploy-pages@v4` — environment `github-pages`

`public/CNAME` (`www.whatsinmycookiejar.com`) is copied into `dist/` by Vite.

## Local checks (match CI)

```bash
npm ci
npm run lint
npm run build
```

## Previous behavior (removed)

The workflow used to `rsync` the full repo (including unbuilt `index.html` and `prototype-goal.html`) to Pages. That path is documented in [PRODUCTION.md](PRODUCTION.md) for history only.
