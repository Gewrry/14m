# 14m

A Vite + React cinematic monthsary page.

## Local Development

```bash
npm install
npm run dev
```

## Build Check

```bash
npm run build
```

## Publish on GitHub Pages

1. Create a public GitHub repository.
2. Push this project to the `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Recommended: set `Source` to `GitHub Actions`, then run the `Deploy to GitHub Pages` workflow.
5. Alternative: set `Source` to `Deploy from a branch`, branch `main`, folder `/docs`.

This repo is configured for `https://gewrry.github.io/14m/`. The production build is written to `docs/` so GitHub Pages can serve compiled static files instead of the raw Vite source.

## Public Asset Note

Images committed in `src/assets/photos` or `public` will be publicly visible. Remove private metadata from photos before committing them.
