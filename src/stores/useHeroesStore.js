import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const TOKEN = import.meta.env.VITE_SUPERHERO_TOKEN
const BASE_URL = `/superhero-api/${TOKEN}`

export const useHeroesStore = defineStore('heroes', () => {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const cache = ref({})

  /**
   * Recherche des héros par nom via l'API
   */
  async function searchHeroes(name) {
    if (!name.trim()) return
    loading.value = true
    error.value = null
    results.value = []

    try {
      const { data } = await axios.get(`${BASE_URL}/search/${encodeURIComponent(name)}`)
      if (data.response === 'success') {
        results.value = data.results
        // Mise en cache de chaque héros par id
        data.results.forEach(h => {
          cache.value[h.id] = h
        })
      } else {
        error.value = `Aucun héros trouvé pour "${name}"`
      }
    } catch (e) {
      error.value = 'Erreur de connexion à SuperHeroAPI. Vérifie ton token.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère un héros par id 
   */
  async function getHeroById(id) {
    if (cache.value[id]) return cache.value[id]
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`)
      if (data.response === 'success') {
        cache.value[id] = data
        return data
      }
    } catch (e) {
      console.error('Erreur getHeroById', e)
    }
    return null
  }

  function clearResults() {
    results.value = []
    error.value = null
  }

  return { results, loading, error, searchHeroes, getHeroById, clearResults }
})