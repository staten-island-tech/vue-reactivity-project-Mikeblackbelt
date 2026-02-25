<template>
  <div class="card" @click="handleClick">
    <h2>Load Dave</h2>
    <p>Click to spawn Dave in the scene</p>
  </div>
</template>

<script setup>
const emit = defineEmits(['load-dave'])

function handleClick() {
  emit('load-dave')
}
</script>

<style scoped>
.card {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: 0.2s;
}

.card:hover {
  transform: scale(1.05);
}
</style>