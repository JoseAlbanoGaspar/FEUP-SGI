import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor(app, x, z) {
        super()
        this.app = app

        const material = new THREE.MeshPhongMaterial({color: "#0000ff"})
        const box = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(x, 1, z)

        this.app.scene.add(powerups)
        return powerups

    }
}

export { MyPowerUps };