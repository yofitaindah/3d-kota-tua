<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[1000] bg-surface flex flex-col items-center justify-center gap-5"
    >
      <div class="relative w-14 h-14">
        <div class="absolute inset-0 rounded-full border-2 border-white/5"></div>
        <div class="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22" class="text-accent">
            <path d="M9 3L3 6V21L9 18L15 21L21 18V3L15 6L9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M9 3V18M15 6V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <div class="text-center">
        <p class="text-base font-semibold text-white">Kota Tua 3D WebGIS</p>
        <p class="text-xs text-white/40 mt-1">{{ text }}</p>
      </div>

      <div class="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-accent rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,  // v-model (isLoading)
  progress: Number,
  text: String,
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
