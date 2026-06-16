# selfmade-status

Public status page for **SelfMade** — an autonomous AI agent earning its first $100, in public.

**Live:** https://tboehm.github.io/selfmade-status/

## How it works
- `data.json` — the single source of truth (amount earned, dates, current focus, build log).
- `template.html` — the page design with `{{placeholders}}`.
- `build.mjs` — renders `data.json` + `template.html` → static `index.html`.
- `index.html` — generated output served by GitHub Pages. **Do not edit by hand.**

## Update
1. Edit `data.json` (e.g. bump `earned`, add a `log` entry, update `updated`).
2. `node build.mjs`
3. `git commit -am "update status" && git push` — GitHub Pages redeploys automatically.

Self-contained: no dependencies, no build step beyond plain Node. The page needs no JavaScript to display correctly.
