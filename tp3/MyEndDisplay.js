import * as THREE from 'three'
import { MySpriteSheets } from "./MySpritesheets.js"
import { MyPicking } from "./MyPicking.js"

class MyEndDisplay extends THREE.Object3D {

    constructor(app, winner, playerName, p_time, o_time, mode) {
        super()
        this.app = app;

        const geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );
        const displayMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const display = new THREE.Mesh(geometry, displayMaterial)
        display.position.set(820, 0, 0)
        display.rotation.y = Math.PI/2
        display.scale.set(1, 0.5, 1)

        let sprite = new MySpriteSheets(this.app)
        this.app.scene.add(sprite.createWord("level", 820, 60, 95, true))
        this.app.scene.add(sprite.createWord("p_time", 820, 50, 95, true))
        this.app.scene.add(sprite.createWord("o_time", 820, 40, 95, true))
        this.app.scene.add(sprite.createWord("winner", 820, 30, 95, true))
        this.app.scene.add(sprite.createWord("loser", 820, 20, 95, true))

        this.app.scene.add(sprite.createNumbers(p_time.toString().split(".")[0], 820, 50, -40, true))
        this.app.scene.add(sprite.createNumbers(o_time.toString().split(".")[0], 820, 40, -40, true))
        
        switch (mode) {
            case 0:
                this.app.scene.add(sprite.createWord("easy", 820, 60, -40, true))
                break;
            case 1:
                this.app.scene.add(sprite.createWord("medium", 820, 60, -40, true))
                break;
            case 2:
                this.app.scene.add(sprite.createWord("hard", 820, 60, -40, true)) 
                break;   
            default:
                break;
        }
        if(winner === 0) {
            this.app.scene.add(sprite.createWord(playerName, 820, 30, -40, true))
            this.app.scene.add(sprite.createWord("opponent", 820, 20, -40, true))
        }

        else {
            this.app.scene.add(sprite.createWord("opponent", 820, 30, -40, true))
            this.app.scene.add(sprite.createWord(playerName, 820, 20, -40, true))
        }

        this.app.scene.add(sprite.createWord("car player", 820, 10, 95, true))
        this.app.scene.add(sprite.createWord("car op", 820, 0, 95, true))

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const plane = new THREE.PlaneGeometry(60, 20, 60, 70);

        this.buttonInitRace = new THREE.Mesh(plane, planeMaterial);
        this.buttonInitRace.rotation.y = Math.PI/2
        this.buttonInitRace.position.set(822, -35, -70)
        this.buttonInitRace.name = "mybuttonInit"
        this.app.scene.add(sprite.createWord("start", 824, -35, -55, true))

        this.buttonRestart = new THREE.Mesh(plane, planeMaterial);
        this.buttonRestart.rotation.y = Math.PI/2
        this.buttonRestart.position.set(822, -35, 70)
        this.buttonRestart.name = "mybuttonRestart"
        this.app.scene.add(sprite.createWord("restart", 824, -35, 92, true))
        
        this.app.scene.add(display)
        this.app.scene.add(this.buttonRestart)
        this.app.scene.add(this.buttonInitRace)

    }

    async choose() {
        let info = ["restart"]
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonRestart)
        pickingButton.addPickableObjects(this.buttonInitRace)
        await pickingButton.pick()
        
        if(pickingButton.getIntersectedObject().name === "mybuttonRestart") {
            this.app.setActiveCamera("PlayerPark")
            info.push("choosePlayerCar")
            return info
        }

        else {
            this.app.setActiveCamera("Initial")
            info.push("start")
            return info
        }
    }

}

export { MyEndDisplay };

