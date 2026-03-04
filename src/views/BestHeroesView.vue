<template>
    <div class="best-view">
      <h1 class="page-title"> Meilleurs combattants</h1>
  
      <p v-if="!rankedHeroes.length" class="no-data">
        Aucun combat joué pour l'instant.<br />
        <router-link to="/select" class="link">Lance ton premier duel !</router-link>
      </p>
  
      <div v-else class="leaderboard">
        <div
          v-for="(entry, index) in rankedHeroes"
          :key="entry.id"
          class="leaderboard-row"
          :class="`rank-${index + 1}`"
        >
          <div class="rank-number">{{ index + 1 }}</div>
          <img
            :src="entry.hero?.image?.url || 'https://via.placeholder.com/60?text=?'"
            :alt="entry.hero?.name || entry.id"
            class="rank-avatar"
          />
          <div class="rank-info">
            <p class="rank-name">{{ entry.hero?.name || `Héros #${entry.id}` }}</p>
            <p class="rank-publisher">{{ entry.hero?.biography?.publisher || '' }}</p>
          </div>
          <div class="rank-wins">
            <span class="wins-count">{{ entry.wins }}</span>
            <span class="wins-label">victoire{{ entry.wins > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>
  
      <div class="actions">
        <router-link to="/select" class="btn-primary" style="text-decoration:none;padding:10px 24px;border-radius:4px;font-weight:700;font-size:1rem;text-transform:uppercase;display:inline-block;background:linear-gradient(135deg,#00d4ff,#0099bb);color:#000;">
           Nouveau duel
        </router-link>
        <button v-if="rankedHeroes.length" class="btn-danger" @click="clearWins">
           Réinitialiser le classement
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useBattleStore } from '../stores/useBattleStore'
  import { useHeroesStore } from '../stores/useHeroesStore'
  
  const battleStore = useBattleStore()
  const heroesStore = useHeroesStore()
  
  // On charge les détails des héros depuis le cache
  const heroDetails = ref({})
  
  onMounted(async () => {
    for (const id of Object.keys(battleStore.winsByHeroId)) {
      const hero = await heroesStore.getHeroById(id)
      if (hero) heroDetails.value[id] = hero
    }
  })
  
  const rankedHeroes = computed(() => {
    return Object.entries(battleStore.winsByHeroId)
      .map(([id, wins]) => ({ id, wins, hero: heroDetails.value[id] || null }))
      .sort((a, b) => b.wins - a.wins)
  })
  
  function clearWins() {
    if (confirm('Réinitialiser tout le classement ?')) {
      battleStore.winsByHeroId = {}
      localStorage.removeItem('herowar_wins')
      heroDetails.value = {}
    }
  }
  </script>
  
  <style scoped>
  .best-view { max-width: 700px; margin: 0 auto; }
  
  .page-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 32px;
    color: var(--accent-gold);
  }
  
  .no-data {
    text-align: center;
    color: var(--text-muted);
    font-size: 1.1rem;
    padding: 60px 0;
    line-height: 2;
  }
  .link { color: var(--accent-blue); text-decoration: none; font-weight: 700; }
  
  .leaderboard { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  
  .leaderboard-row {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 20px;
    transition: transform 0.2s;
  }
  .leaderboard-row:hover { transform: translateX(4px); }
  
  .rank-1 { border-color: #ffd700; background: rgba(255,215,0,0.07); }
  .rank-2 { border-color: #c0c0c0; background: rgba(192,192,192,0.05); }
  .rank-3 { border-color: #cd7f32; background: rgba(205,127,50,0.05); }
  
  .rank-number {
    font-family: 'Bebas Neue', cursive;
    font-size: 1.8rem;
    width: 32px;
    text-align: center;
    color: var(--text-muted);
  }
  .rank-1 .rank-number { color: #ffd700; }
  .rank-2 .rank-number { color: #c0c0c0; }
  .rank-3 .rank-number { color: #cd7f32; }
  
  .rank-avatar {
    width: 56px; height: 56px;
    border-radius: 50%;
    object-fit: cover; object-position: top;
    border: 2px solid var(--border);
  }
  .rank-1 .rank-avatar { border-color: #ffd700; }
  
  .rank-info { flex: 1; }
  .rank-name { font-family: 'Bebas Neue', cursive; font-size: 1.3rem; letter-spacing: 2px; }
  .rank-publisher { color: var(--text-muted); font-size: 0.85rem; margin-top: 2px; }
  
  .rank-wins { text-align: right; }
  .wins-count {
    display: block;
    font-family: 'Bebas Neue', cursive;
    font-size: 2rem;
    line-height: 1;
    color: var(--accent-gold);
  }
  .wins-label { font-size: 0.75rem; color: var(--text-muted); }
  
  .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  </style>