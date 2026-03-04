<template>
    <div class="select-view">
      <h1 class="page-title">Choisissez vos combattants</h1>
  
      <!-- Panel de sélection en cours -->
      <div class="selection-panel">
        <div class="slot" :class="{ filled: battleStore.heroA }">
          <template v-if="battleStore.heroA">
            <img :src="battleStore.heroA.image?.url" :alt="battleStore.heroA.name" />
            <span>{{ battleStore.heroA.name }}</span>
            <button class="btn-remove" @click="battleStore.heroA = null">✕</button>
          </template>
          <template v-else>
            <div class="slot-empty">
              <span class="slot-icon">🔵</span>
              <span>Héros 1</span>
            </div>
          </template>
        </div>
  
        <div class="vs-badge">VS</div>
  
        <div class="slot" :class="{ filled: battleStore.heroB }">
          <template v-if="battleStore.heroB">
            <img :src="battleStore.heroB.image?.url" :alt="battleStore.heroB.name" />
            <span>{{ battleStore.heroB.name }}</span>
            <button class="btn-remove" @click="battleStore.heroB = null">✕</button>
          </template>
          <template v-else>
            <div class="slot-empty">
              <span class="slot-icon">🔴</span>
              <span>Héros 2</span>
            </div>
          </template>
        </div>
      </div>
  
      <!-- Bouton lancer le duel -->
      <div class="launch-wrapper">
        <button
          class="btn-danger btn-launch"
          :disabled="!battleStore.heroA || !battleStore.heroB"
          @click="launchBattle"
        >
            Lancer le duel !
        </button>
      </div>
  
      <!-- Barre de recherche -->
      <div class="search-bar">
        <input
          v-model="query"
          class="search-input"
          type="text"
          placeholder="Rechercher un super-héros..."
          @keyup.enter="search"
        />
        <button class="btn-primary" :disabled="heroesStore.loading || !query.trim()" @click="search">
          Rechercher
        </button>
      </div>
  
      <!-- Loader -->
      <div v-if="heroesStore.loading" class="loader">
        <div class="spinner" />
      </div>
  
      <!-- Erreur -->
      <p v-else-if="heroesStore.error" class="error-msg">{{ heroesStore.error }}</p>
  
      <!-- Résultats -->
      <div v-else-if="heroesStore.results.length" class="results-section">
        <p class="results-count">{{ heroesStore.results.length }} héros trouvés — clique pour sélectionner</p>
  
        <!-- Groupement par nom -->
        <div v-for="(group, name) in groupedResults" :key="name" class="hero-group">
          <template v-if="group.length > 1">
            <div class="variant-group">
              <p class="variant-label">{{ name }} <span class="variant-count">({{ group.length }} variantes)</span></p>
              <div class="results-grid">
                <HeroCard
                  v-for="hero in group"
                  :key="hero.id"
                  :hero="hero"
                  :selected-as="getSelectedAs(hero)"
                  :show-stats="true"
                  clickable
                  @click="selectHero(hero)"
                />
              </div>
            </div>
          </template>
  
          <!-- Une seule version -->
          <template v-else>
            <div class="results-grid single">
              <HeroCard
                v-for="hero in group"
                :key="hero.id"
                :hero="hero"
                :selected-as="getSelectedAs(hero)"
                :show-stats="true"
                clickable
                @click="selectHero(hero)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useHeroesStore } from '../stores/useHeroesStore'
  import { useBattleStore } from '../stores/useBattleStore'
  import HeroCard from '../components/HeroCard.vue'
  
  const router = useRouter()
  const heroesStore = useHeroesStore()
  const battleStore = useBattleStore()
  
  const query = ref('')
  
  async function search() {
    if (!query.value.trim()) return
    await heroesStore.searchHeroes(query.value)
  }
  
  function getSelectedAs(hero) {
    if (battleStore.heroA?.id === hero.id) return 'A'
    if (battleStore.heroB?.id === hero.id) return 'B'
    return null
  }
  
  function selectHero(hero) {
    // Désélectionner si déjà sélectionné
    if (battleStore.heroA?.id === hero.id) {
      battleStore.heroA = null
      return
    }
    if (battleStore.heroB?.id === hero.id) {
      battleStore.heroB = null
      return
    }
    // Sélectionner
    if (!battleStore.heroA) {
      battleStore.heroA = hero
    } else if (!battleStore.heroB) {
      battleStore.heroB = hero
    } else {
      // Les deux slots sont pris, remplace heroA
      battleStore.heroA = hero
    }
  }
  
  function launchBattle() {
    if (!battleStore.heroA || !battleStore.heroB) return
    battleStore.setHeroes(battleStore.heroA, battleStore.heroB)
    battleStore.initBattle()
    router.push('/battle')
  }
  
  // Groupe les résultats par nom 
  const groupedResults = computed(() => {
    const groups = {}
    heroesStore.results.forEach(hero => {
      const key = hero.name
      if (!groups[key]) groups[key] = []
      groups[key].push(hero)
    })
    return groups
  })
  </script>
  
  <style scoped>
  .select-view { max-width: 1100px; margin: 0 auto; }
  
  .page-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 28px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-red));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Selection panel */
  .selection-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  .slot {
    width: 140px;
    height: 80px;
    border: 2px dashed var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s;
  }
  .slot.filled {
    border-style: solid;
    border-color: var(--accent-blue);
    background: rgba(0, 212, 255, 0.05);
    padding: 8px;
    gap: 8px;
    flex-direction: row;
  }
  .slot.filled img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top;
    border: 2px solid var(--accent-blue);
  }
  .slot.filled span {
    font-weight: 700;
    font-size: 0.85rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn-remove {
    background: rgba(255,58,58,0.2);
    color: var(--accent-red);
    border: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    flex-shrink: 0;
  }
  .btn-remove:hover { background: var(--accent-red); color: #fff; }
  
  .slot-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  .slot-icon { font-size: 1.5rem; }
  
  .vs-badge {
    font-family: 'Bebas Neue', cursive;
    font-size: 2rem;
    color: var(--accent-gold);
    letter-spacing: 4px;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  
  /* Launch button */
  .launch-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
  }
  .btn-launch {
    font-size: 1.2rem;
    padding: 14px 40px;
    border-radius: 6px;
  }
  
  /* Search */
  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }
  .search-input {
    flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--accent-blue); }
  .search-input::placeholder { color: var(--text-muted); }
  
  /* Results */
  .results-count {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  
  /* Variant groups */
  .variant-group {
    margin-bottom: 20px;
  }
  .variant-label {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 8px;
    color: var(--text-primary);
    padding-left: 4px;
  }
  .variant-count {
    color: var(--accent-gold);
    font-size: 0.85rem;
  }
  </style>