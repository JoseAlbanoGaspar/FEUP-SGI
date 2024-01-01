import * as THREE from 'three'
import { MySpriteSheets } from "./MySpritesheets.js"

class MyEndDisplay extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const geometry = new THREE.PlaneGeometry( 250, 250, 100, 100 );
        const displayMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const display = new THREE.Mesh(geometry, displayMaterial)
        display.position.set(-400, 32, 1)
        display.rotation.y = Math.PI/2
        display.scale.set(1, 0.5, 1)

        this.createPlayerCar()
        this.createOpponentCar()
        this.createPlayerTime()
        this.createOpponentTime()
        this.createWinner()
        
        this.app.scene.add(display)

    }

    createLevel() {
        
    }

    createPlayerCar() {
        const p = new MySpriteSheets(this.app, 44.8)
        p.position.set(-400, 68, 110)

        this.app.scene.add(p)

    }

    createOpponentCar() {
        const o = new MySpriteSheets(this.app, 44)
        o.position.set(-400, 68, 86)

        this.app.scene.add(o)

    }

    createPlayerTime() {
        const p = new MySpriteSheets(this.app, 44.8)
        p.position.set(-398, 58, 110)

        const t = new MySpriteSheets(this.app, 48.5)
        t.position.set(-398, 58, 94)

        const i = new MySpriteSheets(this.app, 38.3)
        i.position.set(-398, 58, 86)

        const m = new MySpriteSheets(this.app, 42)
        m.position.set(-398, 58, 72)

        const e = new MySpriteSheets(this.app, 34.4)
        e.position.set(-398, 58, 64)

        this.app.scene.add(p)
        this.app.scene.add(t)
        this.app.scene.add(i)
        this.app.scene.add(m)
        this.app.scene.add(e)
    }

    createOpponentTime(){
        const o = new MySpriteSheets(this.app, 44)
        o.position.set(-400, 48, 110)

        const t = new MySpriteSheets(this.app, 48.5)
        t.position.set(-400, 48, 94)

        const i = new MySpriteSheets(this.app, 38.3)
        i.position.set(-400, 48, 86)

        const m = new MySpriteSheets(this.app, 42)
        m.position.set(-400, 48, 72)

        const e = new MySpriteSheets(this.app, 34.4)
        e.position.set(-400, 48, 64)

        this.app.scene.add(o)
        this.app.scene.add(t)
        this.app.scene.add(i)
        this.app.scene.add(m)
        this.app.scene.add(e)
    }

    createWinner() {
        let i = new MySpriteSheets(this.app, 8)
    }
    
}

export { MyEndDisplay };

