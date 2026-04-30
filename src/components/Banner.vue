<template>
  <div
    class="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-start gap-3 rounded-lg px-4 py-3 text-xs shadow-xl max-w-lg w-[calc(100%-2rem)] animate-slide-up"
    :class="{
      'bg-amber-950/90 border border-amber-500/40 text-amber-200': type === 'warn',
      'bg-red-950/90 border border-red-500/40 text-red-200': type === 'error',
      'bg-blue-950/90 border border-blue-500/40 text-blue-200': type === 'info',
    }"
  >
    <div class="flex-1 leading-relaxed" v-html="html"></div>
    <button @click="$emit('close')" class="opacity-50 hover:opacity-100 transition-opacity text-sm flex-shrink-0">✕</button>
  </div>
</template>

<script setup>
defineProps({
  type: String,  // 'warn' | 'error' | 'info'
  html: String,
})
defineEmits(['close'])
</script>
