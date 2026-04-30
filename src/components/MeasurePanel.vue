<template>
  <div
    class="absolute bottom-10 z-20 w-60 rounded-lg border border-emerald-400/25 shadow-xl animate-slide-up"
    :class="offsetLeft ? 'left-[268px]' : 'left-3'"
    style="background:rgba(15,22,32,0.92);backdrop-filter:blur(10px);"
  >
    <div class="flex items-center justify-between px-3 py-2 border-b border-emerald-400/15">
      <div class="flex items-center gap-2">
        <span class="text-emerald-400" v-html="ICONS.measure"></span>
        <span class="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">Ukur Jarak</span>
      </div>
      <button @click="$emit('close')" class="text-white/30 hover:text-white/70 transition-colors" v-html="ICONS.close"></button>
    </div>

    <div class="p-3 space-y-2">
      <p class="text-[11px] text-white/35">Klik dua titik di peta untuk mengukur jarak.</p>
      <p v-if="result" class="text-sm font-semibold text-emerald-400">{{ result }}</p>
    </div>
  </div>
</template>

<script setup>
import { ICONS } from '../config/icons.js'

defineProps({
  result: String,
  offsetLeft: Boolean, // true jika SunStudyPanel juga terbuka
})

defineEmits(['close'])
</script>
