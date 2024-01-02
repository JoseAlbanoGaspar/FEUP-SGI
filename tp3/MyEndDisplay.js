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

        let sprite = new MySpriteSheets(this.app)
        sprite.createWord("p_time")
        sprite.createWord("o_time")
        sprite.createWord("winner")
        sprite.createWord("loser")
        
        this.app.scene.add(display)

    }

    //FALTAM A COR DOS JOGADORES E OS BOTÕES DE REINICIAR
}

export { MyEndDisplay };

