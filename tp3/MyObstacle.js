import * as THREE from 'three'

class MyObstacle extends THREE.Object3D {

    constructor(app, x, z) {
        super()
        this.app = app;

        const material = new THREE.MeshPhongMaterial({color: "#00ff00"})
        const box = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32)
        const obstacle = new THREE.Mesh(box, material)
        obstacle.receiveShadow = true
        obstacle.castShadow = true

        obstacle.position.set(x, 1, z)
        
        this.app.scene.add(obstacle)
    }
}

export { MyObstacle };