<template>
  <div class="absolute right-3 bottom-10 z-20 flex flex-col gap-1" style="pointer-events:auto;">

    <!-- Zoom In -->
    <button
      @click="$emit('zoom-in')"
      title="Zoom In"
      class="map-ctrl-btn w-8 h-8 flex items-center justify-center rounded border text-white/50 transition-all hover:text-white hover:border-white/25 hover:bg-white/10 active:scale-95"
      :style="btnStyle"
    >
      <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
        <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Zoom Out -->
    <button
      @click="$emit('zoom-out')"
      title="Zoom Out"
      class="map-ctrl-btn w-8 h-8 flex items-center justify-center rounded border text-white/50 transition-all hover:text-white hover:border-white/25 hover:bg-white/10 active:scale-95"
      :style="btnStyle"
    >
      <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
        <path d="M3 8H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="h-px mx-1 bg-white/10"></div>

    <!-- Home / Reset View -->
    <button
      @click="$emit('reset-view')"
      title="Reset View"
      class="map-ctrl-btn w-8 h-8 flex items-center justify-center rounded border text-white/50 transition-all hover:text-white hover:border-white/25 hover:bg-white/10 active:scale-95"
      :style="btnStyle"
      v-html="ICONS.home"
    ></button>

    <!-- Tilt 2D/3D toggle -->
    <button
      @click="$emit('toggle-tilt')"
      title="Toggle 2D / 3D"
      class="map-ctrl-btn w-8 h-8 flex items-center justify-center rounded border transition-all active:scale-95"
      :style="is2D
        ? 'background:rgba(59,130,246,0.18);border-color:rgba(59,130,246,0.6);color:#93c5fd;backdrop-filter:blur(6px);'
        : btnStyle"
      v-html="ICONS.tilt"
    ></button>

    <div class="h-px mx-1 bg-white/10"></div>

    <!-- Fullscreen -->
    <button
      @click="$emit('toggle-fullscreen')"
      title="Fullscreen"
      class="map-ctrl-btn w-8 h-8 flex items-center justify-center rounded border text-white/50 transition-all hover:text-white hover:border-white/25 hover:bg-white/10 active:scale-95"
      :style="btnStyle"
      v-html="ICONS.fullscreen"
    ></button>

  </div>
</template>

<script setup>
import { ICONS } from '../config/icons.js'

defineProps({
  is2D: Boolean,
})

defineEmits(['zoom-in', 'zoom-out', 'reset-view', 'toggle-tilt', 'toggle-fullscreen'])

const btnStyle = 'background:rgba(15,22,32,0.88);border-color:rgba(255,255,255,0.12);backdrop-filter:blur(6px);'
</script>
