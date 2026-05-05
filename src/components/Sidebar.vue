<template>
  <aside
    class="relative flex flex-col h-full z-10 overflow-hidden transition-all duration-300 ease-in-out border-r border-white/[0.07]"
    :class="open ? 'w-72 min-w-[288px]' : 'w-0 min-w-0'"
    style="background: #151c28;"
  >
    <div v-show="open" class="flex flex-col h-full w-72">

      <!-- Header -->
      <div class="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07] flex-shrink-0" style="background:#101620">
        <div class="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style="background:#2563EB">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M9 3L3 6V21L9 18L15 21L21 18V3L15 6L9 3Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M9 3V18M15 6V21" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-white">3D Kawasan Kota Tua</p>
        </div>
      </div>

      <!-- Search -->
      <div class="px-3 py-2.5 border-b border-white/[0.07] flex-shrink-0 relative" ref="searchContainer">
        <div
          class="flex items-center gap-2 rounded-md px-3 h-8 border bg-white/5 transition-colors"
          :class="searchFocused ? 'border-accent/60' : 'border-white/10'"
        >
          <!-- Loading spinner atau search icon -->
          <span v-if="searchLoading" class="text-white/40 flex-shrink-0">
            <svg class="animate-spin" viewBox="0 0 16 16" fill="none" width="14" height="14">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="20" stroke-dashoffset="10"/>
            </svg>
          </span>
          <span v-else class="text-white/30 flex-shrink-0" v-html="ICONS.search"></span>
 
          <input
            v-model="localSearch"
            @focus="searchFocused = true"
            @blur="handleBlur"
            @keydown.escape="clearSearch"
            @keydown.enter="selectFirst"
            @keydown.arrow-down.prevent="navigateDown"
            @keydown.arrow-up.prevent="navigateUp"
            type="text"
            placeholder="Cari alamat atau bangunan…"
            autocomplete="off"
            class="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none"
          />
          <button
            v-if="localSearch"
            @click="clearSearch"
            class="text-white/30 hover:text-white/60 transition-colors text-xs flex-shrink-0"
          >✕</button>
        </div>
 
        <!-- Dropdown hasil pencarian -->
        <div
          v-if="searchResults.length > 0 && searchFocused"
          class="absolute left-3 right-3 top-full mt-1 rounded-md border border-white/[0.1] overflow-hidden shadow-xl z-50"
          style="background:#1a2535"
        >
          <div
            v-for="(result, i) in searchResults"
            :key="result.place_id"
            @mousedown.prevent="selectResult(result)"
            class="flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors border-b border-white/[0.05] last:border-0"
            :class="highlightIndex === i ? 'bg-accent/20' : 'hover:bg-white/[0.05]'"
          >
            <svg class="flex-shrink-0 mt-0.5 text-accent/60" viewBox="0 0 16 16" fill="none" width="12" height="12">
              <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5Z" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
            </svg>
            <div class="min-w-0">
              <p class="text-xs text-white/80 truncate">{{ result.display_name.split(',')[0] }}</p>
              <p class="text-[10px] text-white/35 truncate">{{ result.display_name.split(',').slice(1, 3).join(',') }}</p>
            </div>
          </div>
 
          <!-- Footer Nominatim credit -->
          <div class="px-3 py-1.5 border-t border-white/[0.05]" style="background:#151c28">
            <p class="text-[9px] text-white/20 text-right">© OpenStreetMap / Nominatim</p>
          </div>
        </div>
 
        <!-- Empty state -->
        <div
          v-if="searchEmpty && searchFocused && localSearch.length >= 3"
          class="absolute left-3 right-3 top-full mt-1 rounded-md border border-white/[0.1] px-3 py-3 shadow-xl z-50"
          style="background:#1a2535"
        >
          <p class="text-xs text-white/35 text-center">Lokasi tidak ditemukan</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-white/[0.07] flex-shrink-0" style="background:#0f1620">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-all duration-150 border-b-2"
          :class="activeTab === tab.id
            ? 'text-accent border-accent'
            : 'text-white/35 border-transparent hover:text-white/60'"
        >
          <span v-html="ICONS[tab.icon]"></span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto sidebar-scroll">

        <!-- LAYERS TAB -->
        <div v-show="activeTab === 'layers'" class="p-3 space-y-3">
          <div>
            <!-- Layer toggles -->
            <div class="mt-2 space-y-0.5">
              <div
                v-for="layer in layerToggles"
                :key="layer.id"
                class="flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/[0.04] cursor-pointer transition-colors group"
                @click="$emit('toggle-layer', layer)"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: layer.color }"></span>
                  <span class="text-xs text-white/60 group-hover:text-white/80 transition-colors">{{ layer.name }}</span>
                </div>
                <!-- Toggle switch -->
                <div
                  class="relative w-8 h-4 rounded-full tog-track flex-shrink-0"
                  :style="{ background: layer.enabled ? '#3B82F6' : 'rgba(255,255,255,0.12)' }"
                >
                  <div
                    class="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm tog-thumb"
                    :style="{ left: layer.enabled ? '18px' : '2px' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Basemap -->
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-2 px-1">Basemap</p>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="bm in BASEMAPS"
                :key="bm.id"
                @click="$emit('change-basemap', bm.id)"
                class="flex flex-col items-center gap-1.5 p-2 rounded-md border text-[10px] transition-all duration-150"
                :class="currentBasemap === bm.id
                  ? 'border-accent text-accent bg-accent/10 font-semibold'
                  : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'"
              >
                <div class="w-full h-7 rounded" :style="bm.style"></div>
                {{ bm.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- LEGEND TAB -->
        <div v-show="activeTab === 'legend'" class="p-3 space-y-3">
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-2 px-1">Ketinggian Bangunan (m)</p>
            <div class="px-1">
              <div class="h-4 w-full rounded-sm mb-1" style="background: linear-gradient(to right, #1e3a6a, #2563eb, #60a5fa, #bfdbfe)"></div>
              <div class="flex justify-between text-[9px] text-white/30">
                <span>0m</span><span>30m</span><span>60m</span><span>100m+</span>
              </div>
            </div>
          </div>
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-2 px-1">Kategori Bangunan</p>
            <div class="space-y-1">
              <div v-for="cat in RDTR_LEGEND" :key="cat.label" class="flex items-center gap-2.5 py-1 px-1">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: cat.color }"></span>
                <span class="text-[11px] text-white/55">{{ cat.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TOOLS TAB -->
        <div v-show="activeTab === 'tools'" class="p-3 space-y-3">
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-2 px-1">Analisis</p>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                @click="$emit('toggle-sun')"
                class="flex flex-col items-center gap-1.5 p-3 rounded-md border text-[11px] transition-all"
                :class="sunPanelOpen
                  ? 'border-amber-400/60 text-amber-400 bg-amber-400/10'
                  : 'border-white/[0.08] text-white/50 hover:border-amber-400/40 hover:text-amber-400 hover:bg-amber-400/5'"
              >
                <span v-html="ICONS.sun"></span>
                Sun Study
              </button>
              <button
                @click="$emit('toggle-measure')"
                class="flex flex-col items-center gap-1.5 p-3 rounded-md border text-[11px] transition-all"
                :class="measurePanelOpen
                  ? 'border-emerald-400/60 text-emerald-400 bg-emerald-400/10'
                  : 'border-white/[0.08] text-white/50 hover:border-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-400/5'"
              >
                <span v-html="ICONS.measure"></span>
                Ukur Jarak
              </button>
            </div>
            <p class="text-[9px] text-white/20 px-1 mt-2">Panel analisis muncul di dalam peta.</p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex-shrink-0 px-4 py-2.5 border-t border-white/[0.07]" style="background:#0f1620">
        <p class="text-[9px] text-white/20 text-center">Data: tataruang.jakarta.go.id · ArcGIS 4.29</p>
      </div>

    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ICONS } from '../config/icons.js'
import { BASEMAPS, TABS, RDTR_LEGEND} from '../config/index.js'

const props = defineProps({
  open: Boolean,
  searchQuery: String,
  currentBasemap: String,
  layerToggles: Array,
  sunPanelOpen: Boolean,
  measurePanelOpen: Boolean,
})

const emit = defineEmits([
  'toggle-sidebar',
  'update:searchQuery',
  'toggle-layer',
  'change-basemap',
  'toggle-sun',
  'toggle-measure',
  'fly-to',
])

const activeTab       = ref('layers')
const localSearch     = ref('')
const searchFocused   = ref(false)
const searchLoading   = ref(false)
const searchResults   = ref([])
const searchEmpty     = ref(false)
const highlightIndex  = ref(-1)
const searchContainer = ref(null)

let debounceTimer = null

watch(localSearch, (val) => {
  emit('update:searchQuery', val)
  searchEmpty.value = false
  highlightIndex.value = -1

  if (val.trim().length < 3) {
    searchResults.value = []
    searchLoading.value = false
    return
  }

  searchLoading.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      const params = new URLSearchParams({
        q: val,
        format: 'json',
        addressdetails: 1,
        limit: 6,
        countrycodes: 'id',
        'accept-language': 'id',
      })
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
      const data = await res.json()
      searchResults.value = data
      searchEmpty.value = data.length === 0
    } catch (err) {
      console.error('[Nominatim]', err)
      searchResults.value = []
      searchEmpty.value = true
    } finally {
      searchLoading.value = false
    }
  }, 500)
})

function selectResult(result) {
  localSearch.value = result.display_name.split(',')[0]
  searchResults.value = []
  searchFocused.value = false
  emit('fly-to', {
    longitude: parseFloat(result.lon),
    latitude:  parseFloat(result.lat),
    zoom: 17,
  })
}

function navigateDown() {
  if (highlightIndex.value < searchResults.value.length - 1) highlightIndex.value++
}
function navigateUp() {
  if (highlightIndex.value > 0) highlightIndex.value--
}
function selectFirst() {
  const idx = highlightIndex.value >= 0 ? highlightIndex.value : 0
  if (searchResults.value[idx]) selectResult(searchResults.value[idx])
}
function clearSearch() {
  localSearch.value = ''
  searchResults.value = []
  searchEmpty.value = false
  searchFocused.value = false
  emit('update:searchQuery', '')
}
function handleBlur() {
  setTimeout(() => { searchFocused.value = false }, 150)
}
</script>
