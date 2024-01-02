import * as THREE from 'three'
import { MySpriteSheets } from './MySpritesheets.js';
import { MyPicking } from './MyPicking.js';

class MyGameMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        let texture = new THREE.TextureLoader().load("textures/background-menus.jpg")
        const backgroundColor = new THREE.MeshBasicMaterial({ map: texture})
        const background = new THREE.PlaneGeometry( 350, 350, 100, 100 );
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
        sprite.createWord("easy", -12, 80, 402, false)
        this.app.scene.add(this.buttonEasy)

        this.buttonMedium = new THREE.Mesh(geometry, mediumMaterial)
        this.buttonMedium.position.set(0, 40, 400, false)
        this.buttonMedium.name = "mybuttonmedium"
        sprite.createWord("medium", -20, 40, 402, false)
        this.app.scene.add(this.buttonMedium)

        this.buttonHard = new THREE.Mesh(geometry, hardMaterial)
        this.buttonHard.position.set(0, 0, 400)
        this.buttonHard.name = "mybuttonhard"
        sprite.createWord("hard", -12, 0, 402, false)
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
        if(pickingButtonMenu.getIntersectedObject().name === "mybuttoneasy" ||
            pickingButtonMenu.getIntersectedObject().name === "mybuttonmedium" ||
            pickingButtonMenu.getIntersectedObject().name === "mybuttonhard") 
            return "game"
       
    }
}

export { MyGameMenu };