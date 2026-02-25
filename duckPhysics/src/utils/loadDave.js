import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function loadDave(scene) {
  const loader = new GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(
      '/dave.glb',
      (gltf) => {
        const model = gltf.scene

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)

        model.scale.set(1, 1, 1)

        scene.add(model)

        resolve(model)
      },
      undefined,
      reject
    )
  })
}