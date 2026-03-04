<template>
    <div
      class="hero-card"
      :class="{
        'selected-a': selectedAs === 'A',
        'selected-b': selectedAs === 'B',
        'clickable': clickable
      }"
      @click="clickable && $emit('click', hero)"
    >
      <!-- Badge sélection -->
      <div v-if="selectedAs" class="selection-badge" :class="selectedAs === 'A' ? 'badge-a' : 'badge-b'">
        {{ selectedAs === 'A' ? '🔵 Héros 1' : '🔴 Héros 2' }}
      </div>
  
      <div class="hero-image-wrapper">
        <img
          :src="hero.image?.url || 'https://via.placeholder.com/150x200?text=?'"
          :alt="hero.name"
          class="hero-image"
          loading="lazy"
        />
      </div>
  
      <div class="hero-info">
        <h3 class="hero-name">{{ hero.name }}</h3>
        <p v-if="hero.biography?.['full-name']" class="hero-fullname">
          {{ hero.biography['full-name'] }}
        </p>
        <span class="hero-publisher">{{ hero.biography?.publisher || 'Unknown' }}</span>
  
        <!-- Stats de combat -->
        <div v-if="showStats && combatStats" class="combat-stats">
          <div class="stat-row">
            <span class="stat-label">HP</span>
            <span class="stat-value">{{ combatStats.hpMax }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">ATQ</span>
            <span class="stat-value">{{ combatStats.attaque }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">DEF</span>
            <span class="stat-value">{{ combatStats.defense }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">VIT</span>
            <span class="stat-value">{{ combatStats.vitesse }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { buildCombatStats } from '../stores/useBattleStore'
  
  const props = defineProps({
    hero: { type: Object, required: true },
    selectedAs: { type: String, default: null },
    clickable: { type: Boolean, default: false },
    showStats: { type: Boolean, default: false },
  })
  
  defineEmits(['click'])
  
  const combatStats = computed(() =>
    props.showStats && props.hero?.powerstats
      ? buildCombatStats(props.hero)
      : null
  )
  </script>
  
  <style scoped>
  .hero-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    transition: all 0.2s ease;
  }
  .hero-card.clickable {
    cursor: pointer;
  }
  .hero-card.clickable:hover {
    border-color: #444;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .hero-card.selected-a {
    border-color: var(--accent-blue);
    box-shadow: 0 0 16px rgba(0, 212, 255, 0.3);
  }
  .hero-card.selected-b {
    border-color: var(--accent-red);
    box-shadow: 0 0 16px rgba(255, 58, 58, 0.3);
  }
  
  .selection-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 2;
  }
  .badge-a { background: rgba(0, 212, 255, 0.2); color: var(--accent-blue); border: 1px solid var(--accent-blue); }
  .badge-b { background: rgba(255, 58, 58, 0.2); color: var(--accent-red);  border: 1px solid var(--accent-red); }
  
  .hero-image-wrapper {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: #0d0d18;
  }
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
  
  .hero-info {
    padding: 12px;
  }
  .hero-name {
    font-family: 'Bebas Neue', cursive;
    font-size: 1.3rem;
    letter-spacing: 2px;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  .hero-fullname {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hero-publisher {
    display: inline-block;
    background: rgba(255,215,0,0.1);
    color: var(--accent-gold);
    border: 1px solid rgba(255,215,0,0.3);
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .combat-stats {
    margin-top: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card2);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.82rem;
  }
  .stat-label { color: var(--text-muted); }
  .stat-value { font-weight: 700; color: var(--text-primary); }
  </style>