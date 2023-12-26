import * as THREE from 'three'

class MyObstacle extends THREE.Object3D {

    constructor(app, x, y, z) {
        super()
        this.app = app;

        const material = new THREE.MeshPhongMaterial({color: "#00ff00"})
        const box = new THREE.BoxGeometry(4, 4, 4, 32, 32, 32)
        this.obstacle = new THREE.Mesh(box, material)
        this.obstacle.receiveShadow = true
        this.obstacle.castShadow = true

        this.obstacle.position.set(x, y, z)
        
        this.app.scene.add(this.obstacle)
        return this.obstacle
    }

}

export { MyObstacle };