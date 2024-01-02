import * as THREE from 'three'
import { MySpriteSheets } from "./MySpritesheets.js"
import { MyPicking } from "./MyPicking.js"
import { MyFirework } from './MyFirework.js';

class MyEndDisplay extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        const geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );
        const displayMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const display = new THREE.Mesh(geometry, displayMaterial)
        display.position.set(820, 0, 0)
        display.rotation.y = Math.PI/2
        display.scale.set(1, 0.5, 1)

        let sprite = new MySpriteSheets(this.app)
        sprite.createWord("p_time", 820, 50, 95, true)
        sprite.createWord("o_time", 820, 40, 95, true)
        sprite.createWord("winner", 820, 30, 95, true)
        sprite.createWord("loser", 820, 20, 95, true)

        sprite.createNumbers(this.app.contents.race.getPlayerLap(), 820, 50, -40, true)
        sprite.createNumbers(this.app.contents.race.getOpponentLap(), 820, 40, -40, true)

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const plane = new THREE.PlaneGeometry(50, 20, 60, 70);

        this.buttonRestart = new THREE.Mesh(plane, planeMaterial);
        this.buttonRestart.rotation.y = Math.PI/2
        this.buttonRestart.position.set(822, -35, -70)
        this.buttonRestart.name = "mybuttonRestart"

        this.buttonInitRace = new THREE.Mesh(plane, planeMaterial);
        this.buttonInitRace.rotation.y = Math.PI/2
        this.buttonInitRace.position.set(822, -35, 70)
        this.buttonInitRace.name = "mybuttonInit"
        
        this.app.scene.add(display)
        this.app.scene.add(this.buttonRestart)
        this.app.scene.add(this.buttonInitRace)

        let firework = new MyFirework(this.app)

    }

    async choose() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonRestart)
        pickingButton.addPickableObjects(this.buttonInitRace)
        await pickingButton.pick()
        
        if(pickingButton.getIntersectedObject().name === "mybuttonRestart") {
            this.app.setActiveCamera("Initial")
            return "start"
        }

        else {
            this.app.setActiveCamera("PlayerPark")
            return "choosePlayerCar"
        }
       
    }
}

export { MyEndDisplay };

