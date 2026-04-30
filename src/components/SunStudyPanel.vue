<template>
  <div
    class="absolute left-3 bottom-10 z-20 w-60 rounded-lg border border-amber-400/25 shadow-xl animate-slide-up"
    style="background:rgba(15,22,32,0.92);backdrop-filter:blur(10px);"
  >
    <div class="flex items-center justify-between px-3 py-2 border-b border-amber-400/15">
      <div class="flex items-center gap-2">
        <span class="text-amber-400" v-html="ICONS.sun"></span>
        <span class="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">Sun Study</span>
      </div>
      <button @click="$emit('close')" class="text-white/30 hover:text-white/70 transition-colors" v-html="ICONS.close"></button>
    </div>

    <div class="p-3 space-y-2">
      <p class="text-[9px] font-semibold uppercase tracking-widest text-white/25">Posisi Matahari</p>
      <div class="flex items-center gap-2 text-[10px] text-white/35">
        <span>06:00</span>
        <input
          type="range"
          min="6" max="20" step="0.5"
          :value="modelValue"
          @input="$emit('update:modelValue', parseFloat($event.target.value))"
          class="flex-1 h-1 cursor-pointer"
          style="accent-color:#f59e0b;"
        />
        <span>20:00</span>
      </div>
      <p class="text-center text-lg font-semibold text-amber-400">{{ timeLabel }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ICONS } from '../config/icons.js'

const props = defineProps({
  modelValue: Number, // sunHour (v-model)
})

defineEmits(['update:modelValue', 'close'])

const timeLabel = computed(() => {
  const h = Math.floor(props.modelValue)
  const m = props.modelValue % 1 === 0.5 ? '30' : '00'
  return `${String(h).padStart(2, '0')}:${m}`
})
</script>
