import * as THREE from 'three'

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });

        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        this.buttonInit = new THREE.Mesh(geometry, planeMaterial);
        this.buttonInit.rotation.y = Math.PI/2
        this.buttonInit.position.set(0, 100, 0)
        this.buttonInit.name = "mybuttoninit"

        this.app.scene.add(this.buttonInit)

    }


}

export { MyInitialMenu };