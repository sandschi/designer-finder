# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Web Designer Finder" — a small React app that finds the closest web designer (from a fixed roster) to a customer address, using free OSM-based geocoding/routing, and surfaces a scheduling widget for booking the closest match.

## Commands

```bash
npm run dev       # start Vite dev server (frontend only, http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # eslint over the whole repo
npm run preview   # preview the production build
npm run vercel-dev # run the app + serverless /api function together via Vercel CLI (needed for local API calls)
```

There is no test suite in this repo.

To run the app with working designer data locally, use `npm run vercel-dev` (requires the Vercel CLI and Firebase credentials — see below), not `npm run dev` alone, since `npm run dev` has no backend to serve `/api/designers`.

## Architecture

**Frontend (`src/`)** — Vite + React 19, no router (single view).
- `App.jsx` wraps everything in `LanguageProvider` > `DesignerProvider` and renders only `SearchTab`.
- `context/DesignerContext.jsx` fetches the designer roster once on mount from the API (`import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'`) and exposes `{ designers, loading, error, refreshDesigners }`.
- `context/LanguageContext.jsx` holds the current UI language (`de`/`en`, persisted to `localStorage`), used with `src/utils/i18n.js`'s `getTranslation(lang, key)` lookup table.
- `components/SearchTab.jsx` is the only screen wired into the app: geocodes the customer address via `utils/geo.js`, rejects non-Austrian addresses (`countryCode !== 'at'`), fetches an OSRM driving route to every designer in parallel, sorts by duration, and renders results closest-first. The top result gets a TuCalendi booking widget injected via a dynamically-loaded external script (`widgets.tucalendi.com`).
- `components/DesignerTab.jsx` (add/remove designers UI) is **not mounted anywhere** and calls `addDesigner`/`removeDesigner`, which `DesignerContext` no longer provides. This is dead code left over from before the app went read-only — do not assume it works without wiring up write support first.
- `utils/geo.js` calls public OpenStreetMap services directly from the browser: Nominatim for geocoding, OSRM's public router for driving time/distance. No API keys, but rate-limited/best-effort public infra.

**Backend (`api/index.js`)** — a single Express app exposing only `GET /api/designers`, reading from Firestore via `firebase-admin`. This is exported as the handler for Vercel's serverless functions (see `vercel.json`, which rewrites `/api/*` to `api/index.js`). There is currently no write endpoint — the app is read-only in production (see commit "Refactor for Vercel deployment with Firestore (Read-Only Mode)").

Firebase Admin auth: uses `FIREBASE_SERVICE_ACCOUNT` env var (full service account JSON) if set, otherwise falls back to Application Default Credentials. `firestore.rules` denies all client-side writes (`allow write: if false`) — Firestore is only ever written to via the Admin SDK (server/scripts), never from the browser.

**Data seeding (`scripts/import_designers.js`)** — a one-off script with a hardcoded designer list, batch-written to the `designers` Firestore collection. Run with `GOOGLE_APPLICATION_CREDENTIALS` pointed at a service account key (see `VERCEL.md` for the exact steps). `server/data.json` is legacy data from before the Firestore migration.

## Deployment

Deploys to Vercel as a static frontend + serverless API (see `VERCEL.md`). Firebase project is `designer-finder-sandschi`. Deploying requires the `FIREBASE_SERVICE_ACCOUNT` env var to be set in the Vercel project settings.
