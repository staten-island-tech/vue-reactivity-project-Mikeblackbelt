<template>
  <div class="card" :class="{ disabled: !canAfford }" @click="handleClick">
    <h2>Dave</h2>
    <p>Produces 1 Dave Point Per Second</p>
    <p>Cost: {{ cost }} Dave Points</p>
    <p>Dave Amount: {{ amount }}</p>
  </div>
  <div class="card big" :class="{ disabled: !canAffordBig }" @click="handleClickBig">
    <h2>Big Dave</h2>
    <p>Produces 10 Dave Points Per Second</p>
    <p>Cost: {{ bigCost }} Dave Points</p>
    <p>Big Dave Population: {{ amount2 }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  cost: { type: Number, required: true },
  canAfford: { type: Boolean, default: true },
  bigCost: { type: Number, required: false },
  canAffordBig: { type: Boolean, default: true },
  amount: {type: Number, default: 0},
  amount2: {type: Number, default: 0}
})

const emit = defineEmits(['load-dave', 'load-big-dave'])

function handleClick() {
  if (!props.canAfford) return
  emit('load-dave')
}

function handleClickBig() {
  if (!props.canAffordBig) return
  emit('load-big-dave')
}
</script>

<style scoped>
.card {
  position: absolute;
  top: 160px;
  left: 20px;
  width: 200px;
  padding: 16px;
  background: rgb(51, 99, 255);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.card.big {
  top: 340px;
  background: rgb(180, 50, 255);
  border: 2px solid rgba(255,255,255,0.3);
  transform-origin: top left;
}

.card.big h2 {
  font-size: 1.4em;
  background: rgb(100, 100, 100);
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}
</style>