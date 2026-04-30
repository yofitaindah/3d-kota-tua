# 3D WebGIS Kota Tua — Vite + Vue 3

Migrasi dari CDN + single `app.js` ke **Vite + Vue 3 SFC (Single File Components)**.

## Struktur Project

```
src/
├── main.js                    ← entry point (3 baris)
├── App.vue                    ← root component (orchestrate semua)
├── style.css                  ← global CSS + Tailwind + ArcGIS overrides
│
├── config/
│   ├── index.js               ← CONFIG, BASEMAPS, LAYER_TOGGLES_DEFAULT
│   └── icons.js               ← inline SVG strings
│
├── composables/
│   └── useArcGIS.js           ← semua logika ArcGIS (reactive state + methods)
│
└── components/
    ├── LoadingOverlay.vue     ← loading screen
    ├── TopToolbar.vue         ← toolbar atas (status, koordinat)
    ├── Sidebar.vue            ← sidebar kiri (layers, legend, tools)
    ├── MapControls.vue        ← zoom/home/tilt/fullscreen buttons
    ├── SunStudyPanel.vue      ← sun study widget
    ├── MeasurePanel.vue       ← measure distance widget
    ├── FeaturePopup.vue       ← popup info bangunan
    └── Banner.vue             ← notifikasi error/info
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Jalankan Express server dulu (proxy ArcGIS)
cd ../  # ke folder project Express kamu
node server.js

# 3. Jalankan Vite dev server (di folder ini)
npm run dev
# → http://localhost:5173
```

## Perubahan dari versi CDN

| Sebelum | Sesudah |
|---------|---------|
| `public/app.js` (~600 baris) | 8 komponen + 1 composable |
| Template HTML dalam string | `.vue` SFC dengan HTML beneran |
| Global `Vue` dari CDN | `import { ref } from 'vue'` |
| Tidak ada hot reload | HMR otomatis via Vite |

## Terrain / Elevation

Di `src/composables/useArcGIS.js`, bagian `initArcGIS()`:

```js
// Aktif sekarang: World Elevation Esri (global, sudah cukup untuk Jakarta)
ground: 'world-elevation'

// Untuk DTM kustom (DEMNAS, BIG, dll) — publish dulu ke ArcGIS Server:
// const dtmKustom = new ElevationLayer({
//   url: 'https://your-server/arcgis/rest/services/DTM_Jakarta/ImageServer'
// })
// ground: { layers: [dtmKustom] }
```

## Default 2D

`CONFIG.camera.tilt = 0` dan `is2D = ref(true)` di composable.
User bisa tilt ke 3D dengan **klik kanan + drag** atau tombol tilt di kanan bawah.
