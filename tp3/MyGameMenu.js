import * as THREE from 'three'
import { MySpriteSheets } from './MySpritesheets.js';

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });

        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        //Levels of dificulties
        this.buttonEasy = new THREE.Mesh(geometry, planeMaterial);
        
        this.buttonEasy.position.set(0, 120, 100)
        this.buttonEasy.name = "mybuttoneasy"

        this.createEasy()
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, planeMaterial)
        this.buttonMedium.position.set(0, 80, 100)
        this.buttonMedium.name = "mybuttonmedium"
        this.createMedium()
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, planeMaterial)
        this.buttonHard.position.set(0, 40, 100)
        this.buttonHard.name = "mybuttonhard"
        this.app.scene.add(this.buttonHard)

    }

    createEasy() {
        const e = new MySpriteSheets(this.app, 34.5)
        e.position.set(-12, 120, 102)

        const a = new MySpriteSheets(this.app, 30.8)
        a.position.set(-4, 120, 102)

        const s = new MySpriteSheets(this.app, 47.6)
        s.position.set(4, 120, 102)

        const y = new MySpriteSheets(this.app, 83.1)
        y.position.set(12, 120, 102)

        this.app.scene.add(e)
        this.app.scene.add(a)
        this.app.scene.add(s)
        this.app.scene.add(y)
    }

    createMedium() {
        const m = new MySpriteSheets(this.app, 42)
        m.position.set(-12, 80, 102)

        const e = new MySpriteSheets(this.app, 34.4)
        e.position.set(-4, 80, 102)

        const d = new MySpriteSheets(this.app, 33.5)
        d.position.set(4, 80, 102)

        this.app.scene.add(m)
        this.app.scene.add(e)
        this.app.scene.add(d)
    }

    createHard() {
        const h = new MySpriteSheets(this.app, )
        h.position.set(-12, 40, 42)
    }
}

export { MyGameMenu };