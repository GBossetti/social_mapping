# Social Emergency Map

A frontend prototype for coordinating social emergency response on a shared interactive map.

> For the product vision, personas, and feature roadmap see [PRODUCT.md](./PRODUCT.md).

---

## Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Map | react-leaflet v5 + OpenStreetMap |
| i18n | i18next + react-i18next |
| Routing | react-router-dom v7 |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone <repo-url>
cd social_mapping
npm install
npm run dev       # http://localhost:5173
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
src/
├── main.tsx                   # App entry point
├── App.tsx                    # Router setup
├── types.ts                   # Shared TypeScript types (Marker, Category, etc.)
├── index.css                  # Global styles + Tailwind import
├── pages/
│   ├── Landing.tsx            # Landing / home page
│   └── MapPage.tsx            # Main map page; owns marker state + focus logic
├── components/
│   ├── MapView.tsx            # Leaflet map wrapper; marker refs, FocusMarkerHandler
│   ├── FilterSidebar.tsx      # Filter panel; name click triggers map pan + popup
│   └── AddMarkerModal.tsx     # Modal for adding a new map marker
├── data/
│   └── markers.json           # Static mock markers (safe to expose publicly)
└── i18n/
    ├── index.ts               # i18next configuration
    ├── en.json                # English translations
    ├── es.json                # Spanish translations
    └── ca.json                # Catalan translations
```

---

## i18n

Supported languages: **English** (`en`), **Spanish** (`es`), **Catalan** (`ca`).

To add or update a translation:
1. Edit the relevant file in `src/i18n/`.
2. All three files share the same key structure — keep them in sync.

To add a new language, add a JSON file to `src/i18n/`, register it in `src/i18n/index.ts`, and add a switcher option to the UI.

---

## Architecture Notes

**Leaflet icon fix** — The default Leaflet icon loader is patched at startup (delete `_getIconUrl` + `mergeOptions`) to avoid broken marker images when bundled with Vite.

**Sidebar focus pattern** — Clicking a marker name in `FilterSidebar` calls `onFocusMarker(id)` → `MapPage` sets `focusedMarkerId` → `FocusMarkerHandler` (inside `MapView`) flies the map to that marker and opens its popup via stored marker refs.

**Static data** — All marker data is loaded from `src/data/markers.json`. There is no backend, no API, and no database. Everything is client-side.

---

## Contributing

1. Keep the app frontend-only — no backend dependencies.
2. Follow the Tailwind v4 import style: `@import "tailwindcss"` in CSS (no `tailwind.config.js`).
3. Add translations to all three language files when adding new UI strings.
