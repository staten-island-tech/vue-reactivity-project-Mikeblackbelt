<template>
  <div class="card jotaro" :class="{ disabled: !canAfford }" @click="handleClick">
    <h2>Jotaro Kujo</h2>
    <p class="flavour">「やれやれだぜ」</p>
    <p>Produces <strong>67</strong> Dave Points/sec</p>
    <p>Cost: {{ cost }} Dave Points</p>
    <p>Jotaro Count: {{ amount }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  cost:     { type: Number,  required: true },
  canAfford: { type: Boolean, default: true },
  amount:   { type: Number,  default: 0 },
})

const emit = defineEmits(['load-jotaro'])

function handleClick() {
  if (!props.canAfford) return
  emit('load-jotaro')
}
</script>

<style scoped>
.card.jotaro {
  position: absolute;
  top: 520px;
  left: 20px;
  width: 200px;
  padding: 16px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
  border: 2px solid #e94560;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
  transition: 0.2s;
  color: #fff;
  font-family: sans-serif;
}

.card.jotaro:hover {
  transform: scale(1.05);
  box-shadow: 0 14px 40px rgba(233, 69, 96, 0.7);
}

.card.jotaro.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.card.jotaro h2 {
  font-size: 1.2em;
  margin: 6px 0 4px;
  color: #e94560;
  text-shadow: 0 0 8px rgba(233, 69, 96, 0.8);
}

.flavour {
  font-size: 0.75em;
  color: #aaa;
  margin: 0 0 8px;
  font-style: italic;
}

.ora-badge {
  background: #e94560;
  color: #fff;
  font-size: 0.65em;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 6px;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
</style>