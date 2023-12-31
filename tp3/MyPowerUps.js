import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor(app, x, z) {
        super()
        this.app = app

        this.collided = false;
        const material = new THREE.MeshPhongMaterial({color: "#0000ff"})
        const box = new THREE.IcosahedronGeometry(2, 0)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(x, 2, z)

        this.app.scene.add(powerups)
        this.mesh = powerups
    }

    getObject() {
        return this.mesh;
    }

    previouslyCollided() {
        return this.collided
    }

    disableCollision() {
        this.collided = true
    }

    enableCollision() {
        this.collided = false
    }
}


export { MyPowerUps };