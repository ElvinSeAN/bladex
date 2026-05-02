# bladex

Small Vite starter app for quick deployment and sharing.

## What is included

- Vite vanilla app (`src/main.js`)
- Simple searchable BladeX sample list (`src/lib/items.js`)
- Tiny test harness using Node built-in test runner (`test/items.test.js`)
- GitHub Pages-ready Vite config (`vite.config.js`)

## Quick start

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run build
npm run preview
```

## Sync full BladeX data

This app reads `public/data/display-data.json`.

From the parent workspace (`bladeX/`), regenerate and copy the latest full dataset:

```bash
cd /Users/uonqq/Sayre/bladeX
node scripts/transform.js
cp public/data/display-data.json bladex/public/data/display-data.json
```

## Deploy to GitHub Pages

1. Push this folder as a GitHub repository.
2. In repository settings, open `Pages` and set source to **GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` will build and deploy on every push to `main`.


