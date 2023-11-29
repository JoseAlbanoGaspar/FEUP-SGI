import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app

        const material = new THREE.MeshPhongMaterial({color: "#0000ff"})
        const box = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(45, 1, 10)

        this.app.scene.add(powerups)

    }
}

export { MyPowerUps };