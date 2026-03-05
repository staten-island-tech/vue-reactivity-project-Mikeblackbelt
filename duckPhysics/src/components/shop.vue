<template>
  <div class="shop">
    <h3>⚗️ Upgrades</h3>
    <div
      v-for="upgrade in upgrades"
      :key="upgrade.id"
      class="upgrade"
      :class="{ disabled: !canAfford(upgrade), bought: upgrade.bought }"
      @click="handleBuy(upgrade)"
    >
      <div class="upgrade-icon">{{ upgrade.icon }}</div>
      <div class="upgrade-info">
        <strong>{{ upgrade.name }}</strong>
        <span>{{ upgrade.description }}</span>
        <span v-if="!upgrade.bought" class="cost">🪙 {{ upgrade.cost }}</span>
        <span v-else class="owned">✅ Owned</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  davePoints: { type: Number, required: true }
})

const emit = defineEmits(['apply-upgrade', 'spend-points'])

const upgrades = ref([
  {
    id: 'double-dave',
    name: 'Double Dave',
    description: 'Daves produce 2x points',
    icon: '✌️',
    cost: 500,
    bought: false,
    effect: { type: 'multiplier', value: 2 }
  },
  {
    id: 'turbo-dave',
    name: 'Turbo Dave',
    description: 'Daves produce 5x points',
    icon: '⚡',
    cost: 2000,
    bought: false,
    effect: { type: 'multiplier', value: 5 }
  },
  {
    id: 'big-dave-boost',
    name: 'Big Dave Boost',
    description: 'Big Daves produce 3x points',
    icon: '💪',
    cost: 1000,
    bought: false,
    effect: { type: 'bigMultiplier', value: 3 }
  },
  {
    id: 'dave-gang',
    name: 'Dave Gang',
    description: 'All Daves produce an extra +5 pts/sec each',
    icon: '👥',
    cost: 3000,
    bought: false,
    effect: { type: 'baseBoost', value: 5 }
  },
  {
    id: 'mega-dave',
    name: 'Mega Dave',
    description: 'Global 10x multiplier on everything',
    icon: '🌟',
    cost: 10000,
    bought: false,
    effect: { type: 'globalMultiplier', value: 10 }
  },
  {
    id: 'kil-dio',
    name: 'kil dio',
    description:  'mek jotaro kil dio evil, because this is 2x point YIPEE',
    icon: '🧛',
    cost: 4000,
    bought: false,
    effect: {type: 'jotaroMultipier', value: 2
    }
  }
])

function canAfford(upgrade) {
  return !upgrade.bought && props.davePoints >= upgrade.cost
}

function handleBuy(upgrade) {
  if (!canAfford(upgrade)) return
  emit('spend-points', upgrade.cost)
  upgrade.bought = true
  emit('apply-upgrade', upgrade.effect)
}
</script>

<style scoped>
.shop {
  position: absolute;
  top: 160px;
  right: 20px;
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: sans-serif;
  z-index: 10;
}

.shop h3 {
  color: white;
  margin: 0 0 4px 0;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

.upgrade {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1);
  transition: 0.2s;
  color: white;
}

.upgrade:hover:not(.disabled):not(.bought) {
  background: rgba(255,255,255,0.15);
  transform: translateX(-3px);
}

.upgrade.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.upgrade.bought {
  opacity: 0.6;
  cursor: default;
  border-color: rgba(0, 255, 100, 0.3);
}

.upgrade-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.upgrade-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.upgrade-info strong {
  font-size: 14px;
}

.cost {
  color: #ffd700;
  font-weight: 600;
}

.owned {
  color: #00ff88;
  font-size: 12px;
}
</style>