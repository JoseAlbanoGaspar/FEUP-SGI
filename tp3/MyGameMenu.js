import * as THREE from 'three'
import { MySpriteSheets } from './MySpritesheets.js';
import { MyPicking } from './MyPicking.js';

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        let texture = new THREE.TextureLoader().load("textures/background-menus.jpg")
        const backgroundColor = new THREE.MeshBasicMaterial({ map: texture})
        const background = new THREE.PlaneGeometry( 600, 350, 100, 100 );
        const backgroundMesh = new THREE.Mesh(background, backgroundColor)
        backgroundMesh.position.set(0, 0, 398)
        this.app.scene.add(backgroundMesh)

        const easyMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" })
        const mediumMaterial = new THREE.MeshBasicMaterial({ color: "#ffff00" })
        const hardMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" })
        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        let sprite = new MySpriteSheets(this.app)

        //Levels of dificulties
        this.buttonEasy = new THREE.Mesh(geometry, easyMaterial);
        this.buttonEasy.position.set(0, 80, 400)
        this.buttonEasy.name = "mybuttoneasy"
        this.app.scene.add(sprite.createWord("easy", -12, 80, 402, false))
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, mediumMaterial)
        this.buttonMedium.position.set(0, 40, 400, false)
        this.buttonMedium.name = "mybuttonmedium"
        this.app.scene.add(sprite.createWord("medium", -20, 40, 402, false))
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, hardMaterial)
        this.buttonHard.position.set(0, 0, 400)
        this.buttonHard.name = "mybuttonhard"
        this.app.scene.add(sprite.createWord("hard", -12, 0, 402, false))
        this.app.scene.add(this.buttonHard)

    }

    async choose() {
        let pickingButtonMenu = new MyPicking(this.app, "button")
        pickingButtonMenu.addPickableObjects(this.buttonEasy)
        pickingButtonMenu.addPickableObjects(this.buttonMedium)
        pickingButtonMenu.addPickableObjects(this.buttonHard)
        await pickingButtonMenu.pick()
        if(pickingButtonMenu.getIntersectedObject().name === "mybuttoneasy" ||
            pickingButtonMenu.getIntersectedObject().name === "mybuttonmedium" ||
            pickingButtonMenu.getIntersectedObject().name === "mybuttonhard") 
            return "game"
       
    }
}

export { MyGameMenu };