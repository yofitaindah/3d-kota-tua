<template>
  <div
    class="flex items-center justify-between h-11 px-3 flex-shrink-0 border-b border-white/[0.07] gap-3"
    style="background:#101620; z-index:5;"
  >
    <!-- Left: Toggle sidebar + title -->
    <div class="flex items-center gap-2.5">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
        v-html="ICONS.menu"
      ></button>
      <div class="hidden sm:flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
        <span class="text-xs font-medium text-white/60">Kawasan Kota Tua</span>
        <span class="text-white/20">·</span>
        <span class="text-xs text-white/30">3D Urban Scene</span>
      </div>
    </div>

    <!-- Right: Status + Coordinates -->
    <div class="flex items-center gap-2">
      <!-- Status pill -->
      <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.07] bg-white/[0.03]">
        <span
          class="w-1.5 h-1.5 rounded-full flex-shrink-0"
          :class="{
            'bg-amber-400 animate-pulse-dot': statusState === 'loading',
            'bg-emerald-400': statusState === 'ready',
            'bg-red-400': statusState === 'error',
          }"
        ></span>
        <span class="text-[10px] text-white/40">{{ statusText }}</span>
      </div>

      <!-- Coordinates -->
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.07] bg-white/[0.03]">
        <span class="text-white/25" v-html="ICONS.globe"></span>
        <span class="font-mono text-[10px] text-white/35 min-w-[120px]">{{ coordText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ICONS } from '../config/icons.js'

defineProps({
  statusState: String,
  statusText: String,
  coordText: String,
})

defineEmits(['toggle-sidebar'])
</script>
