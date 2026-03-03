import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Convertit une powerstat en nombre.
 * Retourne 0 si la valeur est "null", null, undefined ou non numérique.
 */
function toNum(val) {
  const n = parseInt(val, 10)
  return isNaN(n) ? 0 : n
}

/**
 * Construit les stats de combat à partir des powerstats d'un héros.
 */
export function buildCombatStats(hero) {
  const ps = hero.powerstats
  const intelligence = toNum(ps.intelligence)
  const strength     = toNum(ps.strength)
  const speed        = toNum(ps.speed)
  const durability   = toNum(ps.durability)
  const power        = toNum(ps.power)
  const combat       = toNum(ps.combat)

  return {
    intelligence,
    strength,
    speed,
    durability,
    power,
    combat,
    hpMax:   50 + durability * 2,
    attaque: strength + Math.floor(power / 2),
    defense: Math.floor((durability + combat) / 2),
    vitesse: speed,
  }
}

/**
 * Calcule les dégâts infligés.
 * dégâts = max(1, attaque_attaquant - defense_défenseur / 2)
 */
function calcDamage(attacker, defender) {
  return Math.max(1, attacker.attaque - Math.floor(defender.defense / 2))
}


export const useBattleStore = defineStore('battle', () => {
  // Héros sélectionnés (objets complets de l'API)
  const heroA = ref(null)
  const heroB = ref(null)

  // Stats de combat calculées
  const statsA = ref(null)
  const statsB = ref(null)

  // HP actuels
  const hpA = ref(0)
  const hpB = ref(0)

  // Tour courant : 'A' ou 'B'
  const currentTurn = ref('A')

  // Journal de combat
  const log = ref([])

  // Vainqueur (null = en cours)
  const winner = ref(null)

  // Compteur de victoires par id (bonus)
  const winsByHeroId = ref(
    JSON.parse(localStorage.getItem('herowar_wins') || '{}')
  )

  const isOver = computed(() => winner.value !== null)

  const hpPercentA = computed(() =>
    statsA.value ? Math.max(0, (hpA.value / statsA.value.hpMax) * 100) : 100
  )
  const hpPercentB = computed(() =>
    statsB.value ? Math.max(0, (hpB.value / statsB.value.hpMax) * 100) : 100
  )

  /**
   * Définit les deux héros et calcule leurs stats.
   */
  function setHeroes(a, b) {
    heroA.value = a
    heroB.value = b
    statsA.value = buildCombatStats(a)
    statsB.value = buildCombatStats(b)
  }

  /**
   * Initialise ou réinitialise le combat.
   */
  function initBattle() {
    if (!heroA.value || !heroB.value) return
    hpA.value = statsA.value.hpMax
    hpB.value = statsB.value.hpMax
    log.value = []
    winner.value = null

    // Le héros avec la plus grande vitesse commence.
    // En cas d'égalité, heroA commence.
    currentTurn.value = statsB.value.vitesse > statsA.value.vitesse ? 'B' : 'A'

    log.value.push(
      `⚔️ Le combat commence ! ${currentTurn.value === 'A' ? heroA.value.name : heroB.value.name} attaque en premier.`
    )
  }

  /**
   * Joue un tour de combat.
   */
  function playTurn() {
    if (isOver.value) return

    const isAAttacking = currentTurn.value === 'A'
    const attacker     = isAAttacking ? statsA.value : statsB.value
    const defender     = isAAttacking ? statsB.value : statsA.value
    const attackerName = isAAttacking ? heroA.value.name : heroB.value.name
    const defenderName = isAAttacking ? heroB.value.name : heroA.value.name

    const dmg = calcDamage(attacker, defender)

    if (isAAttacking) {
      hpB.value = Math.max(0, hpB.value - dmg)
    } else {
      hpA.value = Math.max(0, hpA.value - dmg)
    }

    const remainingHp = isAAttacking ? hpB.value : hpA.value
    log.value.push(
      `💥 ${attackerName} attaque ${defenderName} et inflige ${dmg} dégâts. ${defenderName} a ${remainingHp} HP restants.`
    )

    // Vérification fin de combat
    if (hpA.value <= 0) {
      winner.value = heroB.value
      log.value.push(`🏆 Victoire de ${heroB.value.name} !`)
      _incrementWin(heroB.value.id)
      return
    }
    if (hpB.value <= 0) {
      winner.value = heroA.value
      log.value.push(`🏆 Victoire de ${heroA.value.name} !`)
      _incrementWin(heroA.value.id)
      return
    }

    // Changement de tour
    currentTurn.value = isAAttacking ? 'B' : 'A'
  }

  /**
   * Rejoue le duel avec les mêmes héros.
   */
  function replayBattle() {
    initBattle()
  }

  /**
   * Réinitialise tout (pour choisir de nouveaux héros).
   */
  function resetAll() {
    heroA.value = null
    heroB.value = null
    statsA.value = null
    statsB.value = null
    hpA.value = 0
    hpB.value = 0
    currentTurn.value = 'A'
    log.value = []
    winner.value = null
  }

  function _incrementWin(id) {
    winsByHeroId.value[id] = (winsByHeroId.value[id] || 0) + 1
    localStorage.setItem('herowar_wins', JSON.stringify(winsByHeroId.value))
  }

  return {
    heroA, heroB,
    statsA, statsB,
    hpA, hpB,
    currentTurn, log, winner,
    winsByHeroId,
    isOver, hpPercentA, hpPercentB,
    setHeroes, initBattle, playTurn, replayBattle, resetAll,
  }
})