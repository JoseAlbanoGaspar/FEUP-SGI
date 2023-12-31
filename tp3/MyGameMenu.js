import * as THREE from 'three'

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });

        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        //Levels of dificulties
        this.buttonEasy = new THREE.Mesh(geometry, planeMaterial);
        
        this.buttonEasy.position.set(0, 120, 40)
        this.buttonEasy.name = "mybuttoneasy"
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, planeMaterial)
        this.buttonMedium.position.set(0, 80, 40)
        this.buttonMedium.name = "mybuttonmedium"
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, planeMaterial)
        this.buttonHard.position.set(0, 40, 40)
        this.buttonHard.name = "mybuttonhard"
        this.app.scene.add(this.buttonHard)

    }
}

export { MyGameMenu };