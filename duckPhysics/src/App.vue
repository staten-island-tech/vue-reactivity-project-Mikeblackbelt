<template>
  <div ref="container" class="scene"></div>

  <DaveCard @load-dave="handleLoadDave" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { loadDave } from './utils/loadDave'
import DaveCard from './components/iLoveDave.vue'

const container = ref(null)

let scene, camera, renderer
let dave = null

onMounted(() => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x7eab3c);
  scene.fog = new THREE.FogExp2(0x7eab3c, 0.1);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.set(0, 1, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.value.appendChild(renderer.domElement)

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 2)
  light.position.set(5, 5, 5)
  scene.add(light)

  const ambient = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambient)

  scene.add(new THREE.PolarGridHelper(100, 100))

  animate()
})

async function handleLoadDave() {
  if (dave) return // prevent duplicates

  dave = await loadDave(scene)
}

function animate() {
  requestAnimationFrame(animate)

  if (dave) {
    dave.rotation.y += 0.01
  }

  renderer.render(scene, camera)
}
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
}
</style>