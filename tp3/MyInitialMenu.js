import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const plane = new THREE.PlaneGeometry( 400, 200, 100, 100 );
        const menuMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const menu = new THREE.Mesh(plane, menuMaterial)
        menu.position.set(398, 0, 0)
        menu.rotation.y = Math.PI/2

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        this.buttonInit = new THREE.Mesh(geometry, planeMaterial);
        this.buttonInit.rotation.y = Math.PI/2
        this.buttonInit.position.set(400, 0, 0)
        this.buttonInit.name = "mybuttoninit"

        let sprite = new MySpriteSheets(this.app)
        sprite.createWord("start", 401, 0, 16, true)
        this.app.scene.add(menu)
        this.app.scene.add(this.buttonInit)

    }

    async start() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonInit)
        await pickingButton.pick()
        
        if(pickingButton.getIntersectedObject().name === "mybuttoninit") return "choosePlayerCar"
       
    }

}

export { MyInitialMenu };