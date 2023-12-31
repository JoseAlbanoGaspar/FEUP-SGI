import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

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

        this.createStart()
        this.app.scene.add(this.buttonInit)

    }

    createStart() {
        const s = new MySpriteSheets(this.app, 47.5)
        s.position.set(1, 100, 16)

        const t = new MySpriteSheets(this.app, 48.5)
        t.position.set(1, 100, 8)

        const a = new MySpriteSheets(this.app, 30.8)
        a.position.set(1, 100, 0)

        const r = new MySpriteSheets(this.app, 46.7)
        r.position.set(1, 100, -8)

        const t2 = new MySpriteSheets(this.app, 48.5)
        t2.position.set(1, 100, -16)

        this.app.scene.add(s)
        this.app.scene.add(t)
        this.app.scene.add(a)
        this.app.scene.add(r)
        this.app.scene.add(t2)
    }

    async start() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonInit)
        await pickingButton.pick()
        //console.log("PICKED OBJECT", pickingButton.getIntersectedObject().name)
        if(pickingButton.getIntersectedObject().name === "mybuttoninit") return "choosePlayerCar"
       
    }

}

export { MyInitialMenu };