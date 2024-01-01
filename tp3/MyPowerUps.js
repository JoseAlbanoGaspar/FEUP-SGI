import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor(app, x, z) {
        super()
        this.app = app

        this.collided = false;
        let texture = new THREE.TextureLoader().load("textures/powerup.jpg")
        const material = new THREE.MeshPhongMaterial({map: texture})
        const box = new THREE.BoxGeometry(3, 3, 3, 32, 32, 32)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(x, 3, z)

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