import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadDave(scene) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      '/dave.glb', // Ensure this path is correct
      (gltf) => {
        const model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Optionally scale the model
        model.scale.set(2, 2, 2.3); // Adjust scale if needed

        // Add model to the scene
        scene.add(model);

        // Resolve the promise with the model
        resolve(model);
      },
      (xhr) => {
        // Optional: Display progress in console or UI
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        // Handle error properly
        console.error('An error occurred while loading the model:', error);
        alert('Failed to load the model. Please check the console for details.');
        reject(error); // Reject the promise with the error
      }
    );
  });
}