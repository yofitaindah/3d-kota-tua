<!--orchestrate semua komponen -->

<template>
  <div class="flex w-full h-full bg-surface font-sans text-white overflow-hidden">

    <!-- Loading Overlay -->
    <LoadingOverlay
      :model-value="isLoading"
      :progress="loadingProgress"
      :text="loadingText"
    />

    <!-- Sidebar -->
    <Sidebar
      :open="sidebarOpen"
      :search-query="searchQuery"
      :current-basemap="currentBasemap"
      :layer-toggles="layerToggles"
      :sun-panel-open="sunPanelOpen"
      :measure-panel-open="measurePanelOpen"
      @update:search-query="searchQuery = $event"
      @toggle-layer="toggleLayer"
      @change-basemap="onChangeBasemap"
      @toggle-sun="sunPanelOpen = !sunPanelOpen"
      @toggle-measure="onToggleMeasure"
      @fly-to="handleFlyTo"
    />

    <!-- Main content -->
    <main class="flex-1 relative overflow-hidden flex flex-col">

      <!-- Top toolbar -->
      <TopToolbar
        :status-state="statusState"
        :status-text="statusText"
        :coord-text="coordText"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <!-- ArcGIS SceneView container -->
      <div id="scene-view" class="flex-1 w-full relative"></div>

      <!-- Map Controls (zoom, home, tilt, fullscreen) -->
      <MapControls
        :is2-d="is2D"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @reset-view="resetView"
        @toggle-tilt="toggleTilt"
        @toggle-fullscreen="toggleFullscreen"
      />

      <!-- Sun Study Panel -->
      <SunStudyPanel
        v-if="sunPanelOpen"
        v-model="sunHour"
        @close="sunPanelOpen = false"
        @update:model-value="updateSun($event)"
      />

      <!-- Measure Panel -->
      <MeasurePanel
        v-if="measurePanelOpen"
        :result="measureResult"
        :offset-left="sunPanelOpen"
        @close="measurePanelOpen = false"
      />

      <!-- Banner notification -->
      <Banner
        v-if="bannerVisible"
        :type="bannerType"
        :html="bannerHtml"
        @close="bannerVisible = false"
      />

      <!-- Feature Popup -->
      <FeaturePopup
        v-if="popupVisible"
        :layer-name="popupLayerName"
        :title="popupTitle"
        :rows="popupRows"
        @close="popupVisible = false; clearHighlight()"
      />

      <!-- Bottom bar -->
      <div
        class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 border-t border-white/[0.05]"
        style="background:rgba(10,14,20,0.85);backdrop-filter:blur(8px);z-index:20"
      >
        <div class="flex items-center gap-1.5">
          <span
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="{
              'bg-amber-400 animate-pulse-dot': statusState === 'loading',
              'bg-emerald-400': statusState === 'ready',
              'bg-red-400': statusState === 'error',
            }"
          ></span>
          <span class="text-[10px] text-white/30">{{ statusText }}</span>
        </div>
        <span class="text-[10px] text-white/20">Scroll · Drag · Klik kanan untuk tilt</span>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Components
import LoadingOverlay from './components/LoadingOverlay.vue'
import Sidebar from './components/Sidebar.vue'
import TopToolbar from './components/TopToolbar.vue'
import MapControls from './components/MapControls.vue'
import SunStudyPanel from './components/SunStudyPanel.vue'
import MeasurePanel from './components/MeasurePanel.vue'
import Banner from './components/Banner.vue'
import FeaturePopup from './components/FeaturePopup.vue'

// Composable — semua logic ArcGIS di sini
import { useArcGIS } from './composables/useArcGIS.js'

// Config
import { LAYER_TOGGLES_DEFAULT } from './config/index.js'

// ── Local state (UI only) ────────────────────────────────────
const sidebarOpen = ref(true)
const searchQuery = ref('')
const currentBasemap = ref('satellite')
const sunPanelOpen = ref(false)
const measurePanelOpen = ref(false)
const sunHour = ref(10)
const measureResult = ref('')

// Layer toggles (reactive array of objects)
const layerToggles = reactive(
  LAYER_TOGGLES_DEFAULT.map(l => ({ ...l }))
)

// ── ArcGIS composable ────────────────────────────────────────
const {
  isLoading, loadingProgress, loadingText,
  statusState, statusText, coordText,
  popupVisible, popupTitle, popupLayerName, popupRows,
  bannerVisible, bannerType, bannerHtml,
  is2D,
  setProgress, setStatus, showBanner,
  initArcGIS, loadSDK,
  changeBasemap, resetView, toggleTilt,
  toggleLayer, updateSun,
  zoomIn, zoomOut, toggleFullscreen,
  clearHighlight, flyTo,
} = useArcGIS()

// ── Event handlers ───────────────────────────────────────────
function onChangeBasemap(id) {
  currentBasemap.value = id
  changeBasemap(id)
}

function onToggleMeasure() {
  measurePanelOpen.value = !measurePanelOpen.value
  if (measurePanelOpen.value) {
    showBanner('info', 'Klik dua titik di peta untuk mengukur jarak.')
  }
}

function handleFlyTo(payload) {
  flyTo(payload)
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => {
  // Simulasi progress saat booting
  setTimeout(() => { setProgress(25); }, 400)
  setTimeout(() => { setProgress(45); }, 900)

  // Load ArcGIS SDK, lalu init peta
  loadSDK(
    () => {
      setProgress(60)
      initArcGIS()
    },
    () => {
      setStatus('error', 'Gagal memuat ArcGIS SDK')
      showBanner('error', 'Gagal memuat ArcGIS JavaScript API. Periksa koneksi internet Anda.')
      isLoading.value = false
    }
  )
})
</script>
