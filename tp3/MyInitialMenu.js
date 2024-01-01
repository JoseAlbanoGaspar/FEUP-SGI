import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const plane = new THREE.PlaneGeometry( 200, 200, 100, 100 );
        const menuMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const menu = new THREE.Mesh(plane, menuMaterial)
        menu.position.set(398, 100, 0)
        menu.rotation.y = Math.PI/2

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        this.buttonInit = new THREE.Mesh(geometry, planeMaterial);
        this.buttonInit.rotation.y = Math.PI/2
        this.buttonInit.position.set(400, 100, 0)
        this.buttonInit.name = "mybuttoninit"

        this.app.scene.add(menu)
        this.app.scene.add(this.buttonInit)

    }

    createWord(word) {

        let x = 401, y = 100, z = 16
        const aux = new MySpriteSheets(this.app)
        let start = aux.getCharacters().get(word)
        
        for(let i = 0; i < start.length; i++) {
            let temp = aux.drawCharacter(start[i])
            temp.position.set(x, y, z)
            z = z-8
            this.app.scene.add(temp)
        }
        return
    
    }

    async start() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonInit)
        await pickingButton.pick()
        
        if(pickingButton.getIntersectedObject().name === "mybuttoninit") return "choosePlayerCar"
       
    }

}

export { MyInitialMenu };