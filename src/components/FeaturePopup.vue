<template>
  <div
    class="absolute bottom-12 right-14 z-30 w-64 rounded-xl overflow-hidden shadow-2xl border border-white/[0.09] animate-slide-up"
    style="background:#151c28"
  >
    <div class="flex items-center justify-between px-3 py-2.5" style="background:#1a2535">
      <span class="text-[9px] font-semibold uppercase tracking-widest text-accent/70">{{ layerName }}</span>
      <button @click="$emit('close')" class="text-white/30 hover:text-white/70 transition-colors" v-html="ICONS.close"></button>
    </div>

    <div class="px-3 py-2 border-b border-white/[0.06]">
      <p class="text-sm font-semibold text-white truncate">{{ title }}</p>
    </div>

    <div class="px-3 py-2 max-h-52 overflow-y-auto sidebar-scroll space-y-1">
      <div v-if="rows.length === 0" class="text-xs text-white/25 text-center py-3">
        Tidak ada data tersedia.
      </div>
      <div
        v-for="row in rows"
        :key="row.key"
        class="flex justify-between items-baseline gap-2 py-1 border-b border-white/[0.04] last:border-0"
      >
        <span class="text-[10px] text-white/35 flex-shrink-0 max-w-[100px]">{{ row.label }}</span>
        <span class="text-xs text-white/70 text-right break-all">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ICONS } from '../config/icons.js'

defineProps({
  layerName: String,
  title: String,
  rows: Array,
})

defineEmits(['close'])
</script>
