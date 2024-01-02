import * as THREE from 'three'
import { MySpriteSheets } from "./MySpritesheets.js"

class MyOutdoor extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        this.words = []

        const geometry = new THREE.PlaneGeometry( 250, 250, 100, 100 );
        const outdoorMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const outdoor = new THREE.Mesh(geometry, outdoorMaterial)
        outdoor.position.set(-125, 32, 1)
        outdoor.rotation.y = Math.PI/2
        outdoor.scale.set(1, 0.5, 1)
        let sprite = new MySpriteSheets(this.app)
        sprite.createWord("time", -122, 78, 110, true)
        sprite.createWord("p_round", -122, 68, 110, true)
        sprite.createWord("o_round", -122, 58, 110, true)
        sprite.createWord("max_velocity", -122, 48, 110, true)
        sprite.createWord("min_velocity", -122, 38, 110, true)
        this.app.scene.add(outdoor)

    }

    // createTime() {
    //     const t = new MySpriteSheets(this.app, 48.5)
    //     t.position.set(-122, 78, 110)

    //     const i = new MySpriteSheets(this.app, 38.3)
    //     i.position.set(-122, 78, 102)

    //     const m = new MySpriteSheets(this.app, 42)
    //     m.position.set(-122, 78, 94)

    //     const e = new MySpriteSheets(this.app, 34.4)
    //     e.position.set(-122, 78, 86)

    //     this.app.scene.add(t)
    //     this.app.scene.add(i)
    //     this.app.scene.add(m)
    //     this.app.scene.add(e)
    // }

    // createPlayerRounds() {
    //     const p = new MySpriteSheets(this.app, 44.8)
    //     p.position.set(-122, 68, 110)

    //     const r = new MySpriteSheets(this.app, 46.7)
    //     r.position.set(-122, 68, 94)

    //     const o = new MySpriteSheets(this.app, 44)
    //     o.position.set(-122, 68, 86)

    //     const u = new MySpriteSheets(this.app, 80.3)
    //     u.position.set(-122, 68, 78)

    //     const n = new MySpriteSheets(this.app, 43)
    //     n.position.set(-122, 68, 70)

    //     const d = new MySpriteSheets(this.app, 33.5)
    //     d.position.set(-122, 68, 62)

    //     this.app.scene.add(p)
    //     this.app.scene.add(r)
    //     this.app.scene.add(o)
    //     this.app.scene.add(u)
    //     this.app.scene.add(n)
    //     this.app.scene.add(d)
    // }

    // createOpponentRounds() {
    //     const o = new MySpriteSheets(this.app, 43.9)
    //     o.position.set(-122, 58, 110)

    //     const r = new MySpriteSheets(this.app, 46.7)
    //     r.position.set(-122, 58, 94)

    //     const o2 = new MySpriteSheets(this.app, 44)
    //     o2.position.set(-122, 58, 86)

    //     const u = new MySpriteSheets(this.app, 80.3)
    //     u.position.set(-122, 58, 78)

    //     const n = new MySpriteSheets(this.app, 43)
    //     n.position.set(-122, 58, 70)

    //     const d = new MySpriteSheets(this.app, 33.5)
    //     d.position.set(-122, 58, 62)

    //     this.app.scene.add(o)
    //     this.app.scene.add(r)
    //     this.app.scene.add(o2)
    //     this.app.scene.add(u)
    //     this.app.scene.add(n)
    //     this.app.scene.add(d)
    // }

}

export { MyOutdoor };

