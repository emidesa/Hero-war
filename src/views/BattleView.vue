<template>
    <div class="battle-view">
      <!-- Victoire -->
      <div v-if="store.isOver" class="winner-banner">
        <div class="winner-content">
          <p class="winner-label">Victoire !</p>
          <h2 class="winner-name">{{ store.winner?.name }}</h2>
          <img
            :src="store.winner?.image?.url"
            :alt="store.winner?.name"
            class="winner-img"
          />
          <div class="winner-actions">
            <button class="btn-primary" @click="replay">Rejouer le duel</button>
            <router-link to="/select" class="btn-gold" style="padding:10px 24px;border-radius:4px;font-weight:700;font-size:1rem;text-transform:uppercase;text-decoration:none;display:inline-block;background:linear-gradient(135deg,#ffd700,#cc9900);color:#000;">
               Nouveaux héros
            </router-link>
          </div>
        </div>
      </div>
  
      <!-- Arena -->
      <div class="arena">
        <!-- Héros A -->
        <div class="fighter fighter-a">
          <div class="fighter-image-wrap" :class="{ 'is-attacking': store.currentTurn === 'A' && !store.isOver }">
            <img :src="store.heroA?.image?.url" :alt="store.heroA?.name" />
          </div>
          <div class="fighter-info">
            <p class="fighter-name">{{ store.heroA?.name }}</p>
            <HpBar :current="store.hpA" :max="store.statsA?.hpMax || 1" />
            <div class="turn-indicator" v-if="store.currentTurn === 'A' && !store.isOver">À toi d'attaquer</div>
          </div>
        </div>
  
        <!-- VS central -->
        <div class="vs-center">
          <div class="vs-text">VS</div>
          <button
            v-if="!store.isOver"
            class="btn-danger btn-turn"
            @click="store.playTurn()"
          >
             Tour suivant
          </button>
        </div>
  
        <!-- Héros B -->
        <div class="fighter fighter-b">
          <div class="fighter-image-wrap" :class="{ 'is-attacking': store.currentTurn === 'B' && !store.isOver }">
            <img :src="store.heroB?.image?.url" :alt="store.heroB?.name" />
          </div>
          <div class="fighter-info">
            <p class="fighter-name">{{ store.heroB?.name }}</p>
            <HpBar :current="store.hpB" :max="store.statsB?.hpMax || 1" />
            <div class="turn-indicator" v-if="store.currentTurn === 'B' && !store.isOver">À toi d'attaquer</div>
          </div>
        </div>
      </div>
  
      <!-- Stats comparatives -->
      <div class="stats-compare">
        <h3 class="stats-title">Stats de combat</h3>
        <div class="stats-grid" v-if="store.statsA && store.statsB">
          <div v-for="stat in statRows" :key="stat.key" class="stat-compare-row">
            <span class="stat-val-a" :class="{ winner: store.statsA[stat.key] >= store.statsB[stat.key] }">
              {{ store.statsA[stat.key] }}
            </span>
            <span class="stat-name">{{ stat.label }}</span>
            <span class="stat-val-b" :class="{ winner: store.statsB[stat.key] >= store.statsA[stat.key] }">
              {{ store.statsB[stat.key] }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Journal de combat -->
      <div class="battle-log">
        <h3 class="log-title">Journal de combat</h3>
        <div class="log-entries" ref="logRef">
          <p
            v-for="(entry, i) in store.log"
            :key="i"
            class="log-entry"
            :class="{
              'log-attack': entry.includes('attaque'),
              'log-victory': entry.includes('Victoire'),
              'log-start': entry.includes('combat commence'),
            }"
          >
            {{ entry }}
          </p>
          <p v-if="!store.log.length" class="log-empty">Le combat n'a pas encore commencé…</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick } from 'vue'
  import { useBattleStore } from '../stores/useBattleStore'
  import HpBar from '../components/HpBar.vue'
  
  const store = useBattleStore()
  const logRef = ref(null)
  
  const statRows = [
    { key: 'hpMax',   label: 'HP Max' },
    { key: 'attaque', label: 'Attaque' },
    { key: 'defense', label: 'Défense' },
    { key: 'vitesse', label: 'Vitesse' },
  ]
  
  function replay() {
    store.replayBattle()
  }
  
  // Auto-scroll du journal
  watch(() => store.log.length, async () => {
    await nextTick()
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight
    }
  })
  </script>
  
  <style scoped>
  .battle-view { max-width: 900px; margin: 0 auto; }
  
  /* Winner banner */
  .winner-banner {
    background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05));
    border: 1px solid var(--accent-gold);
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    margin-bottom: 32px;
    animation: fadeIn 0.5s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  
  .winner-label { color: var(--accent-gold); font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
  .winner-name  { font-family: 'Bebas Neue', cursive; font-size: 3rem; letter-spacing: 4px; color: var(--accent-gold); }
  .winner-img {
    width: 100px; height: 100px;
    border-radius: 50%; object-fit: cover; object-position: top;
    border: 3px solid var(--accent-gold);
    margin: 16px auto;
    display: block;
  }
  .winner-actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
  
  /* Arena */
  .arena {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 16px;
    align-items: center;
    margin-bottom: 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
  }
  
  .fighter { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .fighter-a .fighter-image-wrap { border-color: var(--accent-blue); }
  .fighter-b .fighter-image-wrap { border-color: var(--accent-red); }
  
  .fighter-image-wrap {
    width: 120px; height: 150px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid var(--border);
    transition: all 0.3s;
  }
  .fighter-image-wrap.is-attacking {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
    transform: scale(1.05);
  }
  .fighter-b .fighter-image-wrap.is-attacking {
    box-shadow: 0 0 20px rgba(255, 58, 58, 0.6);
  }
  .fighter-image-wrap img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top;
  }
  
  .fighter-info { width: 100%; text-align: center; }
  .fighter-name {
    font-family: 'Bebas Neue', cursive;
    font-size: 1.4rem;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .turn-indicator {
    margin-top: 8px;
    font-size: 0.8rem;
    color: var(--accent-blue);
    font-weight: 700;
    animation: pulse 1s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  
  .vs-center { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .vs-text {
    font-family: 'Bebas Neue', cursive;
    font-size: 2.5rem;
    color: var(--accent-gold);
    letter-spacing: 4px;
    text-shadow: 0 0 20px rgba(255,215,0,0.5);
  }
  .btn-turn { font-size: 1rem; padding: 12px 20px; white-space: nowrap; }
  
  /* Stats compare */
  .stats-compare {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 20px;
  }
  .stats-title {
    font-size: 1rem;
    margin-bottom: 12px;
    color: var(--text-muted);
    letter-spacing: 1px;
  }
  .stats-grid { display: flex; flex-direction: column; gap: 6px; }
  .stat-compare-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }
  .stat-val-a, .stat-val-b {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text-muted);
    transition: color 0.3s;
  }
  .stat-val-a { text-align: right; }
  .stat-val-b { text-align: left; }
  .stat-val-a.winner { color: var(--accent-blue); }
  .stat-val-b.winner { color: var(--accent-red); }
  .stat-name { color: var(--text-muted); font-size: 0.85rem; text-align: center; white-space: nowrap; }
  
  /* Battle log */
  .battle-log {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
  }
  .log-title { font-size: 1rem; margin-bottom: 12px; color: var(--text-muted); }
  .log-entries {
    max-height: 260px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 4px;
  }
  .log-entry {
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 4px;
    background: var(--bg-card2);
    border-left: 3px solid var(--border);
    line-height: 1.4;
  }
  .log-attack  { border-left-color: var(--accent-red); }
  .log-victory { border-left-color: var(--accent-gold); background: rgba(255,215,0,0.05); font-weight: 700; color: var(--accent-gold); }
  .log-start   { border-left-color: var(--accent-blue); }
  .log-empty   { color: var(--text-muted); font-style: italic; text-align: center; padding: 20px; }
  </style>