import * as THREE from 'three'

class MyObstacle extends THREE.Object3D {

    constructor() {

        const material = new THREE.MeshPhongMaterial({color: "#00ff00"})
        const box = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32)
        const obstacle = new THREE.Mesh(box, material)
        obstacle.receiveShadow = true
        obstacle.castShadow = true

        obstacle.position.set(0, 1, 0)

    }
}

export { MyObstacle };