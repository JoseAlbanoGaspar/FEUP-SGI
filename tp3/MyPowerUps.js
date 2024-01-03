import * as THREE from 'three'

class MyPowerUps extends THREE.Object3D {

    constructor(app, x, z) {
        super()
        this.app = app

        this.collided = false;
        let texture = new THREE.TextureLoader().load("textures/powerup.jpg")
        const material = new THREE.MeshPhongMaterial({map: texture})
        const box = new THREE.IcosahedronGeometry(2)
        const powerups = new THREE.Mesh(box, material)
        powerups.receiveShadow = true
        powerups.castShadow = true

        powerups.position.set(x, 3.5, z)

        this.app.scene.add(powerups)
        this.mesh = powerups
    }
    /**
     * Get the mesh
     */
    getObject() {
        return this.mesh;
    }

    /**
     * Detects if the object was previously collided with the car
     */
    previouslyCollided() {
        return this.collided
    }

    /**
     * Used to avoid multiple colision detections in consecutive frames
     */
    disableCollision() {
        this.collided = true
    }

    /**
     * Used to avoid multiple colision detections in consecutive frames
     */
    enableCollision() {
        this.collided = false
    }
}


export { MyPowerUps };