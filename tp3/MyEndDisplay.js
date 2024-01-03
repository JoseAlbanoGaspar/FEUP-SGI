import * as THREE from 'three'
import { MySpriteSheets } from "./MySpritesheets.js"
import { MyPicking } from "./MyPicking.js"

class MyEndDisplay extends THREE.Object3D {

    constructor(app, winner, playerName, p_time, o_time, mode, color, colorOp) {
        super()
        this.app = app;
        this.mode = mode
        this.winner = winner
        this.playerName = playerName

        const texture = new THREE.TextureLoader().load("textures/celebration.png")
        let planegeometry = new THREE.PlaneGeometry(10, 10, 4, 4);
        let celebration = new THREE.MeshBasicMaterial({map: texture})
        const ret = new THREE.Mesh(planegeometry, celebration)
        ret.rotation.y = Math.PI/2
        ret.position.set(822, 30, 105)
        this.app.scene.add(ret)

        const geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );
        const displayMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const display = new THREE.Mesh(geometry, displayMaterial)
        display.position.set(820, 0, 0)
        display.rotation.y = Math.PI/2
        display.scale.set(1, 0.5, 1)

        this.sprite = new MySpriteSheets(this.app)
        this.add(this.sprite.createWord("level", 820, 60, 95, true))
        this.add(this.sprite.createWord("p_time", 820, 50, 95, true))
        this.add(this.sprite.createWord("o_time", 820, 40, 95, true))
        this.add(this.sprite.createWord("winner", 820, 30, 95, true))
        this.add(this.sprite.createWord("loser", 820, 20, 95, true))

        this.add(this.sprite.createNumbers(p_time.toString().split(".")[0], 820, 50, -40, true))
        this.add(this.sprite.createNumbers(o_time.toString().split(".")[0], 820, 40, -40, true))
        this.add(this.sprite.createWord("car "+playerName, 820, 10, 95, true))
        this.add(this.sprite.createWord("car op", 820, 0, 95, true))

        this.drawRank()
        this.drawMode()
        this.drawColor(color, 820, 10, -40)
        this.drawColor(colorOp, 820, 0, -40)

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const plane = new THREE.PlaneGeometry(60, 20, 60, 70);

        this.buttonInitRace = new THREE.Mesh(plane, planeMaterial);
        this.buttonInitRace.rotation.y = Math.PI/2
        this.buttonInitRace.position.set(822, -35, -70)
        this.buttonInitRace.name = "mybuttonExit"
        this.add(this.sprite.createWord("exit", 824, -35, -55, true))

        this.buttonRestart = new THREE.Mesh(plane, planeMaterial);
        this.buttonRestart.rotation.y = Math.PI/2
        this.buttonRestart.position.set(822, -35, 70)
        this.buttonRestart.name = "mybuttonRestart"
        this.add(this.sprite.createWord("restart", 824, -35, 92, true))
        
        this.add(display)
        this.add(this.buttonRestart)
        this.add(this.buttonInitRace)
    }

    /**
     * Generates the sprite for the winner and loser
     */
    drawRank() {
        if(this.winner === 0) {
            this.add(this.sprite.createWord(this.playerName, 820, 30, -40, true))
            this.add(this.sprite.createWord("opponent", 820, 20, -40, true))
        }

        else {
            this.add(this.sprite.createWord("opponent", 820, 30, -40, true))
            this.add(this.sprite.createWord(this.playerName, 820, 20, -40, true))
        }
    }

    /**
     * Generates the sprite for the given levels of difficulty
     */
    drawMode() {
        switch (this.mode) {
            case 0:
                this.add(this.sprite.createWord("easy", 820, 60, -40, true))
                break;
            case 1:
                this.add(this.sprite.createWord("medium", 820, 60, -40, true))
                break;
            case 2:
                this.add(this.sprite.createWord("hard", 820, 60, -40, true)) 
                break;   
            default:
                break;
        }
    }

    /**
     * Generates the sprites containing the name of the colors of the used cars to display
     */
    drawColor(color, x, y, z) {
        switch (color) {
            case "ff00ff":
                this.add(this.sprite.createWord("pink", x, y, z, true))
                break;
            case "ff1111":
                this.add(this.sprite.createWord("red", x, y, z, true))
                break;
            case "ffa511":
                this.add(this.sprite.createWord("orange", x, y, z, true))
                break;
            case "1111ff":
                this.add(this.sprite.createWord("blue", x, y, z, true))
                break;
            case "116411":
                this.add(this.sprite.createWord("green", x, y, z, true))
                break;
            case "7600bc":
                this.add(this.sprite.createWord("purple", x, y, z, true))
                break;
            default:
                break;
        }
    }

    /**
     * Uses picking to select between restart the race and quit
     */
    async choose() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonRestart)
        pickingButton.addPickableObjects(this.buttonInitRace)
        await pickingButton.pick()
        
        if(pickingButton.getIntersectedObject().name === "mybuttonRestart") {
            this.app.setActiveCamera("PlayerPark")
            return "choosePlayerCar"
        }

        else {
            this.app.setActiveCamera("Initial")
            return "start"
        }
    }
}

MyEndDisplay.prototype.isGroup = true

export { MyEndDisplay };

