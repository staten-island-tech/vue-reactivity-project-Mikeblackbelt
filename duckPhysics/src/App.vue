<template>
  <div ref="container" class="scene"></div>

  <DaveCard @load-dave="handleLoadDave" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { loadDave } from "./utils/loadDave";
import DaveCard from "./components/iLoveDave.vue";

const container = ref(null);

let scene, camera, renderer;
let dave = null;

let world;
let daveBody;
let groundBody;

onMounted(async () => {
  await RAPIER.init();

  // ----- THREE SETUP -----
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7eab3c);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  // ----- RAPIER SETUP -----
  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // Gravity is down

  // Ground
  const groundDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0);
  groundBody = world.createRigidBody(groundDesc);

  const groundCollider = RAPIER.ColliderDesc.cuboid(10, 1, 10);
  world.createCollider(groundCollider, groundBody);

  // Visual ground
  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 2, 20),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  groundMesh.position.set(0, -1, 0);
  scene.add(groundMesh);

  animate();
});

async function handleLoadDave() {

  dave = await loadDave(scene);

  // Create physics body for Dave
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 5, 0)
    .setLinearDamping(0.5);

  daveBody = world.createRigidBody(bodyDesc);

  // Use capsule for character (better than box)
  const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.5)
    .setRestitution(0.2)
    .setFriction(1.0);

  world.createCollider(colliderDesc, daveBody);

  // Apply a random force to Dave
  applyRandomForceToDave();
}

// Apply a random force left or right
function applyRandomForceToDave() {
  if (!daveBody) return;

  const randomDirection = Math.random() < 0.5 ? -1 : 1; // -1 for left, 1 for right
  const force = new RAPIER.Vector3(randomDirection * 5, 0, 0); // Apply force on X-axis (left or right)

  // Apply force to Dave's body
  daveBody.applyImpulse(force, true);
}

function animate() {
  requestAnimationFrame(animate);

  if (world) {
    world.step();
  }

  // Sync physics -> Three
  if (dave && daveBody) {
    const pos = daveBody.translation();
    const rot = daveBody.rotation();

    dave.position.set(pos.x, pos.y, pos.z);
    dave.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  }

  renderer.render(scene, camera);
}
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
}
</style>
