/**
 * CONFIG — semua konstanta aplikasi di satu tempat
 * Edit file ini untuk ubah layer, kamera, basemap default, dll.
 */

export const CONFIG = {
  sceneLayers: [
    {
      url: '/arcgis-proxy/server/rest/services/Hosted/Building_UDGL_Kota_Tua/SceneServer',
      originalUrl: 'https://tataruang.jakarta.go.id/server/rest/services/Hosted/Building_UDGL_Kota_Tua/SceneServer',
      title: 'Bangunan 3D - Kota Tua',
      popupFields: [
        { key: 'OBJECTID', label: 'Object ID' },
        { key: 'name', label: 'Nama Bangunan' },
        { key: 'fid', label: 'Feature ID' },
        { key: 'class', label: 'Kelas Bangunan' },
        { key: 'function', label: 'Fungsi Bangunan' },
        { key: 'usage', label: 'Penggunaan' },
        { key: 'description', label: 'Deskripsi' },
        { key: 'measuredHeight', label: 'Ketinggian (m)' },
        { key: 'roofType', label: 'Tipe Atap' },
        { key: 'storeysAboveGround', label: 'Lantai di Atas Tanah' },
        { key: 'storeysBelowGround', label: 'Lantai di Bawah Tanah' },
        { key: 'ConstructionMethod', label: 'Metode Konstruksi' },
        { key: 'IsLandmarked', label: 'Landmark' },
        { key: 'relativeToTerrain', label: 'Posisi Relatif Terrain' },
        { key: 'creationDate', label: 'Tanggal Pembuatan' },
        { key: 'yearOfConstruction', label: 'Tahun Konstruksi' },
      ],
    },
  ],

  // featureLayers: [],  // tambahkan kembali jika ada FeatureLayer

  /**
   * Kamera awal — tilt: 0 → tampil 2D saat landing.
   * User bisa klik kanan + drag untuk tilt ke 3D.
   */
  camera: {
    position: {
      spatialReference: { wkid: 4326 },
      longitude: 106.811,
      latitude: -6.145,
      z: 2000,   // altitude lebih tinggi untuk bird-eye 2D
    },
    heading: 0,  // utara
    tilt: 0,     // 0 = 2D top-down
  },

  defaultBasemap: 'satellite',
}

export const BASEMAPS = [
  {
    id: 'satellite',
    label: 'Satellite',
    style: 'background: linear-gradient(135deg,#2d5016 0%,#4a7c2f 40%,#1e3a0e 100%)',
  },
  {
    id: 'streets-navigation-vector',
    label: 'Streets',
    style: 'background: linear-gradient(135deg,#3d4a5c 0%,#2d3748 40%,#1a202c 100%)',
  },
  {
    id: 'topo-vector',
    label: 'Topo',
    style: 'background: linear-gradient(135deg,#2d4a1e 0%,#4a6a32 40%,#1e3814 100%)',
  },
  {
    id: 'dark-gray-vector',
    label: 'Dark',
    style: 'background: linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)',
  },
]

export const LAYER_TOGGLES_DEFAULT = [
  { id: 'buildings', name: 'Bangunan 3D (I3S)', color: '#5B8DB8', enabled: true },
  { id: 'green', name: 'Ruang Terbuka Hijau', color: '#6BAD6B', enabled: true },
  { id: 'heritage', name: 'Kawasan Cagar Budaya', color: '#D4943A', enabled: true },
  { id: 'roads', name: 'Jaringan Jalan', color: '#B55252', enabled: false },
]

export const BUILDING_CATEGORIES = [
  { color: '#5B8DB8', label: 'Bangunan Bersejarah (< 1945)' },
  { color: '#7DB87D', label: 'Kolonial Belanda' },
  { color: '#D4943A', label: 'Bangunan Modern (1945–2000)' },
  { color: '#B55252', label: 'Tidak Terklasifikasi' },
]

export const TABS = [
  { id: 'layers', label: 'Layers', icon: 'layers' },
  { id: 'legend', label: 'Legend', icon: 'legend' },
  { id: 'tools', label: 'Tools', icon: 'tools' },
]
