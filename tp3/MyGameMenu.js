import * as THREE from 'three'

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });

        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        //Levels of dificulties
        this.buttonEasy = new THREE.Mesh(geometry, planeMaterial);
        this.buttonEasy.rotation.y = Math.PI/2
        this.buttonEasy.position.set(0, 100, 0)
        this.buttonEasy.name = "mybuttoneasy"
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, planeMaterial)
        this.buttonMedium.rotation.y = Math.PI/2
        this.buttonMedium.position.set(0, 80, 0)
        this.buttonMedium.name = "mybuttonmedium"
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, planeMaterial)
        this.buttonHard.rotation.y = Math.PI/2
        this.buttonHard.position.set(0, 60, 0)
        this.buttonHard.name = "mybuttonhard"
        this.app.scene.add(this.buttonHard)

    }
}

export { MyGameMenu };