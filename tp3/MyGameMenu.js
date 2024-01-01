import * as THREE from 'three'
import { MySpriteSheets } from './MySpritesheets.js';
import { MyPicking } from './MyPicking.js';

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        let texture = new THREE.TextureLoader().load("textures/background-menus.jpg")
        const backgroundColor = new THREE.MeshBasicMaterial({ map: texture})
        const background = new THREE.PlaneGeometry( 500, 500, 100, 100 );

        const backgroundMesh = new THREE.Mesh(background, backgroundColor)
        backgroundMesh.position.set(0, 100, 398)
        this.app.scene.add(backgroundMesh)

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ffff" });

        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        //Levels of dificulties
        this.buttonEasy = new THREE.Mesh(geometry, planeMaterial);
        
        this.buttonEasy.position.set(0, 180, 400)
        this.buttonEasy.name = "mybuttoneasy"

        this.createEasy()
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, planeMaterial)
        this.buttonMedium.position.set(0, 140, 400)
        this.buttonMedium.name = "mybuttonmedium"
        this.createMedium()
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, planeMaterial)
        this.buttonHard.position.set(0, 100, 400)
        this.buttonHard.name = "mybuttonhard"
        this.createHard()
        this.app.scene.add(this.buttonHard)

    }

    createEasy() {
        const e = new MySpriteSheets(this.app, 34.5)
        e.position.set(-12, 180, 402)

        const a = new MySpriteSheets(this.app, 30.8)
        a.position.set(-4, 180, 402)

        const s = new MySpriteSheets(this.app, 47.6)
        s.position.set(4, 180, 402)

        const y = new MySpriteSheets(this.app, 83.1)
        y.position.set(12, 180, 402)

        this.app.scene.add(e)
        this.app.scene.add(a)
        this.app.scene.add(s)
        this.app.scene.add(y)
    }

    createMedium() {
        const m = new MySpriteSheets(this.app, 42)
        m.position.set(-20, 140, 402)

        const e = new MySpriteSheets(this.app, 34.4)
        e.position.set(-12, 140, 402)

        const d = new MySpriteSheets(this.app, 33.5)
        d.position.set(-4, 140, 402)

        const i = new MySpriteSheets(this.app, 38.3)
        i.position.set(4, 140, 402)

        const u = new MySpriteSheets(this.app, 80.3)
        u.position.set(12, 140, 401)

        const m1 = new MySpriteSheets(this.app, 42)
        m1.position.set(20, 140, 402)

        this.app.scene.add(m)
        this.app.scene.add(e)
        this.app.scene.add(d)
        this.app.scene.add(i)
        this.app.scene.add(u)
        this.app.scene.add(m1)
    }

    createHard() {
        const h = new MySpriteSheets(this.app, 37.4)
        h.position.set(-12, 100, 402)

        const a = new MySpriteSheets(this.app, 30.8)
        a.position.set(-4, 100, 402)

        const r = new MySpriteSheets(this.app, 46.7)
        r.position.set(4, 100, 402)

        const d = new MySpriteSheets(this.app, 33.5)
        d.position.set(12, 100, 402)

        this.app.scene.add(h)
        this.app.scene.add(a)
        this.app.scene.add(r)
        this.app.scene.add(d)
    }

    async choose() {
        let pickingButtonMenu = new MyPicking(this.app, "button")
        pickingButtonMenu.addPickableObjects(this.buttonEasy)
        pickingButtonMenu.addPickableObjects(this.buttonMedium)
        pickingButtonMenu.addPickableObjects(this.buttonHard)
        await pickingButtonMenu.pick()
        if(pickingButtonMenu.getIntersectedObject().name === "mybuttoneasy") return "game"
       
    }
}

export { MyGameMenu };