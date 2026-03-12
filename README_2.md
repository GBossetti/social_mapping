# Social Emergency Map

A client-side map app for coordinating social emergency response. Drop markers for resources, institutions, and people at risk — filter, focus, and share.

## Stack

| Layer | Library |
|-------|---------|
| UI | React 19 + TypeScript |
| Build | Vite 7 + `@tailwindcss/vite` (Tailwind CSS v4) |
| Map | react-leaflet v5 + OpenStreetMap (Leaflet 1.9) |
| i18n | i18next + react-i18next |
| Routing | react-router-dom v7 |
| Deploy | GitHub Pages (`gh-pages`) |

No backend. No database. All data is static/in-memory.

## Getting started

**Prerequisites:** Node ≥ 18

```bash
git clone <repo-url>
cd social_mapping
npm install
npm run dev        # http://localhost:5173
```

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Type-check + production build → dist/
npm run preview    # Serve the production build locally
npm run lint       # ESLint
npm run deploy     # Build and push to gh-pages branch
```

## Project structure

```
src/
├── pages/
│   ├── Landing.tsx          # Landing / entry page
│   └── MapPage.tsx          # Main map page — marker state, filter state, modal trigger
├── components/
│   ├── MapView.tsx           # Leaflet map wrapper, marker refs, FocusMarkerHandler
│   ├── FilterSidebar.tsx     # Slide-in sidebar: filters, color pickers, marker list
│   └── AddMarkerModal.tsx    # Modal form for adding a new marker
├── data/
│   └── markers.json          # Static seed markers (safe to expose publicly)
├── i18n/
│   ├── en.json               # English translations
│   ├── es.json               # Spanish translations
│   └── ca.json               # Catalan translations
├── types.ts                  # Shared TypeScript types (MapMarker, FilterState, …)
├── main.tsx                  # App entry point, i18n init
└── index.css                 # Global styles (@import "tailwindcss")
```

## i18n

Three languages are supported out of the box: **English** (`en`), **Spanish** (`es`), **Catalan** (`ca`).

Translation files live in `src/i18n/`. To add a new language:
1. Copy `src/i18n/en.json` and translate the values.
2. Register the new locale in `src/main.tsx` where `i18next` is initialised.

## Architecture notes

**Leaflet icon fix** — `_getIconUrl` and `mergeOptions` are deleted from the default icon prototype in `MapView.tsx` to prevent the broken-icon issue with Vite/webpack bundlers.

**Sidebar → map focus flow** — Clicking a marker name in the sidebar calls `onFocusMarker(id)` → `MapPage` sets `focusedMarkerId` → `FocusMarkerHandler` (inside `MapView`) flies the map to that position and opens the popup via stored marker refs.

**Tailwind v4** — Uses the Vite plugin (`@tailwindcss/vite`). There is no `tailwind.config.js`. Utility classes are imported via `@import "tailwindcss"` in `index.css`.

**Static data** — `src/data/markers.json` contains example markers used as seed data. User-added markers are held in React state (`userMarkers` in `MapPage`) and are not persisted between sessions.
