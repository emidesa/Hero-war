<template>
    <div class="hp-bar-wrapper">
      <div class="hp-numbers">
        <span class="hp-current">{{ current }}</span>
        <span class="hp-sep">/</span>
        <span class="hp-max">{{ max }}</span>
        <span class="hp-label">HP</span>
      </div>
      <div class="hp-track">
        <div
          class="hp-fill"
          :style="{ width: pct + '%' }"
          :class="hpClass"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
  current: { type: Number, default: 0 }, 
  max:     { type: Number, default: 1 },
})
  
  const pct = computed(() => Math.max(0, (props.current / props.max) * 100))
  
  const hpClass = computed(() => {
    if (pct.value > 50) return 'hp-green'
    if (pct.value > 25) return 'hp-yellow'
    return 'hp-red'
  })
  </script>
  
  <style scoped>
  .hp-bar-wrapper { width: 100%; }
  .hp-numbers {
    display: flex;
    align-items: baseline;
    gap: 3px;
    margin-bottom: 4px;
    font-size: 0.9rem;
  }
  .hp-current { font-weight: 700; font-size: 1.1rem; }
  .hp-sep     { color: var(--text-muted); }
  .hp-max     { color: var(--text-muted); font-size: 0.85rem; }
  .hp-label   { color: var(--text-muted); font-size: 0.8rem; margin-left: 2px; }
  
  .hp-track {
    width: 100%;
    height: 10px;
    background: rgba(255,255,255,0.08);
    border-radius: 5px;
    overflow: hidden;
  }
  .hp-fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.4s ease, background 0.4s ease;
  }
  .hp-green  { background: linear-gradient(90deg, #00c853, #00e676); }
  .hp-yellow { background: linear-gradient(90deg, #f9a825, #ffeb3b); }
  .hp-red    { background: linear-gradient(90deg, #b71c1c, #f44336); }
  </style>