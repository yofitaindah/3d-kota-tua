/**
 * CONFIG — semua konstanta aplikasi di satu tempat
 * Edit file ini untuk ubah layer, kamera, basemap default, dll.
 */

export const CONFIG = {
  sceneLayers: [
    {
      url: "/arcgis-proxy/server/rest/services/Hosted/Building_UDGL_Kota_Tua/SceneServer",
      originalUrl:
        "https://tataruang.jakarta.go.id/server/rest/services/Hosted/Building_UDGL_Kota_Tua/SceneServer",
      title: "Bangunan 3D - Kota Tua",
      popupFields: [
        { key: "OBJECTID", label: "Object ID" },
        { key: "name", label: "Nama Bangunan" },
        { key: "fid", label: "Feature ID" },
        { key: "class", label: "Kelas Bangunan" },
        { key: "function", label: "Fungsi Bangunan" },
        { key: "usage", label: "Penggunaan" },
        { key: "description", label: "Deskripsi" },
        { key: "measuredHeight", label: "Ketinggian (m)" },
        { key: "roofType", label: "Tipe Atap" },
        { key: "storeysAboveGround", label: "Lantai di Atas Tanah" },
        { key: "storeysBelowGround", label: "Lantai di Bawah Tanah" },
        { key: "ConstructionMethod", label: "Metode Konstruksi" },
        { key: "IsLandmarked", label: "Landmark" },
        { key: "relativeToTerrain", label: "Posisi Relatif Terrain" },
        { key: "creationDate", label: "Tanggal Pembuatan" },
        { key: "yearOfConstruction", label: "Tahun Konstruksi" },
      ],
    },
  ],

  featureLayers: [
    {
      url: "/arcgis-proxy/server/rest/services/Hosted/rdtr_clip_kota_tua/FeatureServer/0",
      originalUrl:
        "https://tataruang.jakarta.go.id/server/rest/services/Hosted/rdtr_clip_kota_tua/FeatureServer/0",
      title: "RDTR - Kota Tua",
      popupFields: [{ key: "NAMOBJ", label: "Nama Zona" }],
      renderer: {
        type: "unique-value",
        field: "NAMOBJ",
        defaultSymbol: {
          type: "simple-fill",
          color: [180, 180, 180, 0.4],
          outline: { color: [120, 120, 120, 0.6], width: 0.5 },
        },
        uniqueValueInfos: [
          // ── Air & Jalan ──────────────────────────────────
          {
            value: "Badan Air",
            label: "Badan Air",
            symbol: {
              type: "simple-fill",
              color: [100, 180, 255, 0.75],
              outline: { color: [30, 120, 200], width: 0.5 },
            },
          },
          {
            value: "Badan Jalan",
            label: "Badan Jalan",
            symbol: {
              type: "simple-fill",
              color: [160, 160, 160, 0.75],
              outline: { color: [100, 100, 100], width: 0.5 },
            },
          },
          // ── Hijau ────────────────────────────────────────
          {
            value: "Jalur Hijau",
            label: "Jalur Hijau",
            symbol: {
              type: "simple-fill",
              color: [100, 200, 100, 0.75],
              outline: { color: [30, 150, 30], width: 0.5 },
            },
          },
          {
            value: "Taman Kota",
            label: "Taman Kota",
            symbol: {
              type: "simple-fill",
              color: [80, 210, 120, 0.75],
              outline: { color: [20, 160, 60], width: 0.5 },
            },
          },
          {
            value: "Taman RW",
            label: "Taman RW",
            symbol: {
              type: "simple-fill",
              color: [130, 220, 140, 0.75],
              outline: { color: [50, 170, 70], width: 0.5 },
            },
          },
          {
            value: "Taman RT",
            label: "Taman RT",
            symbol: {
              type: "simple-fill",
              color: [160, 230, 160, 0.75],
              outline: { color: [70, 180, 80], width: 0.5 },
            },
          },
          {
            value: "Perlindungan Setempat",
            label: "Perlindungan Setempat",
            symbol: {
              type: "simple-fill",
              color: [60, 180, 80, 0.75],
              outline: { color: [10, 130, 40], width: 0.5 },
            },
          },
          // ── Perumahan ────────────────────────────────────
          {
            value: "Perumahan Kepadatan Sangat Tinggi",
            label: "Perumahan Kepadatan Sangat Tinggi",
            symbol: {
              type: "simple-fill",
              color: [255, 160, 80, 0.75],
              outline: { color: [200, 100, 0], width: 0.5 },
            },
          },
          // ── Komersial ────────────────────────────────────
          {
            value: "Perdagangan dan Jasa Skala Kota",
            label: "Perdagangan dan Jasa Skala Kota",
            symbol: {
              type: "simple-fill",
              color: [255, 80, 80, 0.75],
              outline: { color: [180, 0, 0], width: 0.5 },
            },
          },
          {
            value: "Perdagangan dan Jasa Skala WP",
            label: "Perdagangan dan Jasa Skala WP",
            symbol: {
              type: "simple-fill",
              color: [255, 130, 130, 0.75],
              outline: { color: [180, 50, 50], width: 0.5 },
            },
          },
          {
            value: "Perdagangan dan Jasa Skala SWP",
            label: "Perdagangan dan Jasa Skala SWP",
            symbol: {
              type: "simple-fill",
              color: [255, 180, 180, 0.75],
              outline: { color: [180, 100, 100], width: 0.5 },
            },
          },
          // ── Perkantoran & Industri ────────────────────────
          {
            value: "Perkantoran",
            label: "Perkantoran",
            symbol: {
              type: "simple-fill",
              color: [160, 100, 220, 0.75],
              outline: { color: [100, 40, 160], width: 0.5 },
            },
          },
          {
            value: "Kawasan Peruntukan Industri",
            label: "Kawasan Peruntukan Industri",
            symbol: {
              type: "simple-fill",
              color: [120, 80, 60, 0.75],
              outline: { color: [80, 40, 20], width: 0.5 },
            },
          },
          // ── SPU ──────────────────────────────────────────
          {
            value: "SPU Skala Kota",
            label: "SPU Skala Kota",
            symbol: {
              type: "simple-fill",
              color: [80, 160, 255, 0.75],
              outline: { color: [0, 100, 200], width: 0.5 },
            },
          },
          {
            value: "SPU Skala Kecamatan",
            label: "SPU Skala Kecamatan",
            symbol: {
              type: "simple-fill",
              color: [120, 190, 255, 0.75],
              outline: { color: [40, 130, 210], width: 0.5 },
            },
          },
          {
            value: "SPU Skala Kelurahan",
            label: "SPU Skala Kelurahan",
            symbol: {
              type: "simple-fill",
              color: [160, 210, 255, 0.75],
              outline: { color: [80, 160, 220], width: 0.5 },
            },
          },
          // ── Lainnya ──────────────────────────────────────
          {
            value: "Pertahanan dan Keamanan",
            label: "Pertahanan dan Keamanan",
            symbol: {
              type: "simple-fill",
              color: [180, 60, 60, 0.75],
              outline: { color: [120, 0, 0], width: 0.5 },
            },
          },
          {
            value: "Transportasi",
            label: "Transportasi",
            symbol: {
              type: "simple-fill",
              color: [220, 180, 60, 0.75],
              outline: { color: [160, 120, 0], width: 0.5 },
            },
          },
        ],
      },
    },
  ], // tambahkan kembali jika ada FeatureLayer

  /**
   * Kamera awal — tilt: 0 → tampil 2D saat landing.
   * User bisa klik kanan + drag untuk tilt ke 3D.
   */
  camera: {
    position: {
      spatialReference: { wkid: 4326 },
      longitude: 106.811,
      latitude: -6.145,
      z: 2000, // altitude lebih tinggi untuk bird-eye 2D
    },
    heading: 0, // utara
    tilt: 0, // 0 = 2D top-down
  },

  defaultBasemap: "satellite",
};

export const BASEMAPS = [
  {
    id: "satellite",
    label: "Satellite",
    style:
      "background: linear-gradient(135deg,#2d5016 0%,#4a7c2f 40%,#1e3a0e 100%)",
  },
  {
    id: "streets-navigation-vector",
    label: "Streets",
    style:
      "background: linear-gradient(135deg,#3d4a5c 0%,#2d3748 40%,#1a202c 100%)",
  },
  {
    id: "topo-vector",
    label: "Topo",
    style:
      "background: linear-gradient(135deg,#2d4a1e 0%,#4a6a32 40%,#1e3814 100%)",
  },
  {
    id: "dark-gray-vector",
    label: "Dark",
    style:
      "background: linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)",
  },
];

export const LAYER_TOGGLES_DEFAULT = [
  {
    id: "buildings",
    name: "Bangunan 3D (I3S)",
    color: "#5B8DB8",
    enabled: true,
  },
  {
    id: "rdtr",
    name: "RDTR - Kota Tua",
    color: "#5B8DB8",
    enabled: true,
  },
];

export const RDTR_LEGEND = [
  { color: "#64B4FF", label: "Badan Air" },
  { color: "#A0A0A0", label: "Badan Jalan" },
  { color: "#64C864", label: "Jalur Hijau / Taman" },
  { color: "#3CB450", label: "Perlindungan Setempat" },
  { color: "#FFA050", label: "Perumahan" },
  { color: "#FF5050", label: "Perdagangan & Jasa Skala Kota" },
  { color: "#FF8282", label: "Perdagangan & Jasa Skala WP/SWP" },
  { color: "#A064DC", label: "Perkantoran" },
  { color: "#785040", label: "Kawasan Industri" },
  { color: "#50A0FF", label: "SPU Skala Kota" },
  { color: "#78BEFF", label: "SPU Skala Kecamatan/Kelurahan" },
  { color: "#B43C3C", label: "Pertahanan & Keamanan" },
  { color: "#DCB43C", label: "Transportasi" },
];

export const TABS = [
  { id: "layers", label: "Layers", icon: "layers" },
  { id: "legend", label: "Legend", icon: "legend" },
  { id: "tools", label: "Tools", icon: "tools" },
];
