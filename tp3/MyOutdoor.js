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
        this.app.scene.add(outdoor)

    }

}

export { MyOutdoor };

