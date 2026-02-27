import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function getPushOutVector(hitboxSizes1, hitboxSizes2, currentVelocityVector1, currentVelocityVector2, currentAccelerationVector1, currentAccelerationVector2, centerPos1, centerPos2) {
    //hitboxSizes1 is a 3d tuple (x,y,z)
    //hitboxSizes2 is a 3d tuple (x,y,z)
    //currentVector1 is the current acceleration vector of the first object
    //currentVector2 is the current acceleration vector of the second object
    //centerPos1 is the center position of the first object
    //centerPos2 is the center position of the second object
    const pushOutVector = new THREE.Vector3();
    //check if the hitboxes are colliding
    if (checkCollision(centerPos1, hitboxSizes1, centerPos2, hitboxSizes2)) {
        //calculate the push out vector
        pushOutVector.copy(centerPos1).sub(centerPos2);
        pushOutVector.normalize();
        pushOutVector.multiplyScalar(0.5); //push out by half the distance
    }
    return pushOutVector;
}


function checkCollision(centerPos1, hitboxSizes1, centerPos2, hitboxSizes2) {
    const halfExtents1 = new THREE.Vector3().copy(hitboxSizes1).multiplyScalar(0.5);
    const halfExtents2 = new THREE.Vector3().copy(hitboxSizes2).multiplyScalar(0.5);

    const delta = new THREE.Vector3().subVectors(centerPos2, centerPos1);
    const combinedHalfExtents = new THREE.Vector3().addVectors(halfExtents1, halfExtents2);

    return Math.abs(delta.x) < combinedHalfExtents.x &&
           Math.abs(delta.y) < combinedHalfExtents.y &&
           Math.abs(delta.z) < combinedHalfExtents.z;
}