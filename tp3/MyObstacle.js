import * as THREE from 'three'

class MyObstacle extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const material = new THREE.MeshPhongMaterial({color: "#00ff00"})
        const box = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32)
        const obstacle = new THREE.Mesh(box, material)
        obstacle.receiveShadow = true
        obstacle.castShadow = true

        obstacle.position.set(45, 1, 0)
        
        this.app.scene.add(obstacle)
    }
}

export { MyObstacle };