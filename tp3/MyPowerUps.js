import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor() {

        const material = new THREE.MeshPhongMaterial({color: "#0000ff"})
        const box = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(1, 1, 1)

    }
}

export { MyPowerUps };