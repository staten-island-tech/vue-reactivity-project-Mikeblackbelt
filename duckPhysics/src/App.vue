<template>
  <div class="ui">
    <div class="ui-stat">🪙 {{ davePoints.toFixed(0) }} pts</div>
    <div class="ui-stat">⚡ {{ davePointsPerSecond.toFixed(1) }} pts/sec</div>
  </div>

  <div ref="container" class="scene"></div>
<!-- in template, next to DaveCard -->
<UpgradeShop
  :davePoints="davePoints"
  @spend-points="davePoints -= $event"
  @apply-upgrade="handleUpgrade"
/>
  <DaveCard
    :cost="daveCost"
    :canAfford="davePoints >= daveCost"
    :bigCost="bigDaveCost"
    :canAffordBig="davePoints >= bigDaveCost"
    @load-dave="handleLoadDave"
    @load-big-dave="handleLoadBigDave"
    :amount="daveCount"
    :amount2="bigDaveCount"
  />
</template>

<script setup>

import { onMounted, onUnmounted, ref, computed } from "vue";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { loadDave } from "./utils/loadDave";
import DaveCard from "./components/iLoveDave.vue";
// in script, add the import
import UpgradeShop from "./components/shop.vue";

// and the handler function

const container = ref(null);

let scene, camera, renderer;
let dave = null;
let world;
let daveBody;
let animationId;

const davePoints = ref(1033);
const daveCount = ref(0);
const bigDaveCount = ref(0);
const daveCost = ref(10);
const bigDaveCost = ref(100);

const basePointsPerDave = ref(1);
const globalMultiplier = ref(1);
const bigDaveMultiplier = ref(1);

const davePointsPerSecond = computed(() => {
  return (
    daveCount.value * basePointsPerDave.value * globalMultiplier.value +
    bigDaveCount.value * 10 * globalMultiplier.value * bigDaveMultiplier.value
  );
});

let productionInterval = null;

const FIXED_TIMESTEP = 1 / 60;
const GROUND_Y = -1;
const GROUND_HALF_HEIGHT = 1;
const GROUND_SURFACE_Y = GROUND_Y + GROUND_HALF_HEIGHT;

onMounted(async () => {
  await RAPIER.init();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7eab3c);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.value.appendChild(renderer.domElement);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.integrationParameters.dt = FIXED_TIMESTEP;
  world.integrationParameters.numSolverIterations = 8;
  world.integrationParameters.numAdditionalFrictionIterations = 4;

  const groundDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, GROUND_Y, 0);
  const groundBody = world.createRigidBody(groundDesc);
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(10, GROUND_HALF_HEIGHT, 10).setFriction(0.8).setRestitution(0.1),
    groundBody
  );

  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 2, 20),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  groundMesh.position.set(0, GROUND_Y, 0);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  spawnWall(world, -10, 0, 0, 10, 3, 0.5);
  spawnWall(world,  10, 0, 0, 10, 3, 0.5);
  spawnWall(world,   0, 0, -5, 0.5, 3, 10);
  spawnWall(world,   0, 0,  5, 0.5, 3, 10);

  window.addEventListener("resize", onResize);

  productionInterval = setInterval(() => {
    davePoints.value += davePointsPerSecond.value;
  }, 1000);

  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onResize);
  clearInterval(productionInterval);
  renderer.dispose();
});

function spawnWall(world, x, y, z, hw, hh, hd) {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
  world.createCollider(RAPIER.ColliderDesc.cuboid(hw, hh, hd), body);
}

async function handleLoadDave() {
  if (davePoints.value < daveCost.value) return;
  davePoints.value -= daveCost.value;
  daveCost.value = Math.ceil(daveCost.value * 1.2);

  dave = await loadDave(scene);
  if (dave) {
    dave.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  }

  daveCount.value += 1;

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, GROUND_SURFACE_Y + 2.5, 0)
    .setLinearDamping(0.8)
    .setAngularDamping(0.9);
  daveBody = world.createRigidBody(bodyDesc);
  world.createCollider(
    RAPIER.ColliderDesc.capsule(0.2, 0.4).setFriction(0.8).setRestitution(0.1),
    daveBody
  );
  applyRandomForceToDave();
}

async function handleLoadBigDave() {
  if (davePoints.value < bigDaveCost.value) return;
  davePoints.value -= bigDaveCost.value;
  bigDaveCost.value = Math.ceil(bigDaveCost.value * 1.5);

  dave = await loadDave(scene);
  if (dave) {
    dave.scale.set(2, 4, 2);
    dave.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  }

  bigDaveCount.value += 1;

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, GROUND_SURFACE_Y + 4, 0)
    .setLinearDamping(0.8)
    .setAngularDamping(0.9);
  daveBody = world.createRigidBody(bodyDesc);
  world.createCollider(
    RAPIER.ColliderDesc.capsule(1.2, 0.8).setFriction(0.8).setRestitution(0.1),
    daveBody
  );
  applyRandomForceToDave();
}

function applyRandomForceToDave() {
  if (!daveBody) return;
  const dir = Math.random() < 0.5 ? -1 : 1;
  const mass = daveBody.mass();
  daveBody.applyImpulse(new RAPIER.Vector3(dir * mass * 2, 0, 0), true);
}
function handleUpgrade(effect) {
  if (effect.type === 'multiplier') {
    basePointsPerDave.value *= effect.value
  } else if (effect.type === 'bigMultiplier') {
    bigDaveMultiplier.value *= effect.value
  } else if (effect.type === 'baseBoost') {
    basePointsPerDave.value += effect.value
  } else if (effect.type === 'globalMultiplier') {
    globalMultiplier.value *= effect.value
  }
}
let accumulator = 0;
let lastTime = performance.now();

function animate() {
  animationId = requestAnimationFrame(animate);

  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (world) {
    accumulator += delta;
    while (accumulator >= FIXED_TIMESTEP) {
      world.step();
      accumulator -= FIXED_TIMESTEP;
    }
  }

  if (dave && daveBody) {
    const pos = daveBody.translation();
    const rot = daveBody.rotation();
    dave.position.set(pos.x, pos.y - 0.4, pos.z);
    dave.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
}

.ui {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
}

.ui-stat {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 10px;
  font-family: sans-serif;
  letter-spacing: 0.3px;
}
</style>