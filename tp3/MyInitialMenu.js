import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        this.playerName = "";
        this.x = 401, this.y = -30, this.z = 16

        const plane = new THREE.PlaneGeometry( 400, 200, 100, 100 );
        const menuMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
        const menu = new THREE.Mesh(plane, menuMaterial)
        menu.position.set(398, 0, 0)
        menu.rotation.y = Math.PI/2

        const planeMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
        const geometry = new THREE.PlaneGeometry(60, 30, 60, 70);

        this.buttonInit = new THREE.Mesh(geometry, planeMaterial);
        this.buttonInit.rotation.y = Math.PI/2
        this.buttonInit.position.set(400, 0, 0)
        this.buttonInit.name = "mybuttoninit"

        this.input = new THREE.Mesh(geometry, planeMaterial);
        this.input.rotation.y = Math.PI/2
        this.input.position.set(400, -40, 0)

        this.sprite = new MySpriteSheets(this.app)
        this.app.scene.add(this.sprite.createWord("start", 401, 0, 16, true))
        //this.app.scene.add(st)
        //let rt = this.sprite.createWord("restart", 401, -10, 16, true)
        //this.app.scene.add(rt)
        //this.sprite.removeSprite("restart")
        this.app.scene.add(menu)
        this.app.scene.add(this.buttonInit)
        this.app.scene.add(this.input)

        this.keyDownHandler = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.keyDownHandler);

    }

    async start() {
        let pickingButton = new MyPicking(this.app, "button")
        pickingButton.addPickableObjects(this.buttonInit)
        await pickingButton.pick()
        document.removeEventListener('keydown', this.keyDownHandler)
        if(pickingButton.getIntersectedObject().name === "mybuttoninit") return "choosePlayerCar"
       
    }

    getPlayerName() {
        return this.playerName
    }

    // Function to handle keydown events
    handleKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'a':
                this.app.scene.add(this.sprite.createWord("a", this.x, this.y, this.z, true))
                this.playerName += "a"
                this.z = this.z - 8
                console.log("a pressed");
                break;
            case 'b':
                this.app.scene.add(this.sprite.createWord("b", this.x, this.y, this.z, true))
                this.playerName += "b"
                this.z = this.z - 8
                console.log("b pressed");
                break;
            case 'c':
                this.app.scene.add(this.sprite.createWord("c", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("c")[0])
                this.z += "c"
                console.log("c pressed");
                break;
            case 'd':
                this.app.scene.add(this.sprite.createWord("d", this.x, this.y, this.z, true))
                this.playerName += "d"
                this.z = this.z - 8
                console.log("d pressed");
                break;
            case 'e':
                this.app.scene.add(this.sprite.createWord("e", this.x, this.y, this.z, true))
                this.playerName += "e"
                this.z = this.z - 8
                console.log("e pressed");
                break;
            case 'f':
                this.app.scene.add(this.sprite.createWord("f", this.x, this.y, this.z, true))
                this.playerName += "f"
                this.z = this.z - 8
                console.log("f pressed");
                break;
            case 'g':
                this.app.scene.add(this.sprite.createWord("g", this.x, this.y, this.z, true))
                this.playerName += "g"
                this.z = this.z - 8
                console.log("g pressed");
                break;
            case 'h':
                this.app.scene.add(this.sprite.createWord("h", this.x, this.y, this.z, true))
                this.playerName += "h"
                this.z = this.z - 8
                console.log("h pressed");
                break;
            case 'i':
                this.app.scene.add(this.sprite.createWord("i", this.x, this.y, this.z, true))
                this.playerName += "i"
                this.z = this.z - 8
                console.log("i pressed");
                break;
            case 'j':
                this.app.scene.add(this.sprite.createWord("j", this.x, this.y, this.z, true))
                this.playerName += "j"
                this.z = this.z - 8
                console.log("j pressed");
                break;
            case 'k':
                this.app.scene.add(this.sprite.createWord("k", this.x, this.y, this.z, true))
                this.playerName += "k"
                this.z = this.z - 8
                console.log("k pressed");
                break;
            case 'l':
                this.app.scene.add(this.sprite.createWord("l", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("l")[0])
                this.z = this.z - 8
                console.log("l pressed");
                break;
            case 'm':
                this.app.scene.add(this.sprite.createWord("m", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("m")[0])
                this.z = this.z - 8
                console.log("m pressed");
                break;
            case 'n':
                this.app.scene.add(this.sprite.createWord("n", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("n")[0])
                this.z = this.z - 8
                console.log("n pressed");
                break;
            case 'o':
                this.app.scene.add(this.sprite.createWord("o", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("o")[0])
                this.z = this.z - 8
                console.log("o pressed");
                break;
            case 'p':
                this.app.scene.add(this.sprite.createWord("p", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("p")[0])
                this.z = this.z - 8
                console.log("p pressed");
                break;
            case 'q':
                this.app.scene.add(this.sprite.createWord("q", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("q")[0])
                this.z = this.z - 8
                console.log("q pressed");
                break;
            case 'r':
                this.app.scene.add(this.sprite.createWord("r", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("r")[0])
                this.z = this.z - 8
                console.log("r pressed");
                break;
            case 's':
                this.app.scene.add(this.sprite.createWord("s", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("s")[0])
                this.z = this.z - 8
                console.log("s pressed");
                break;
            case 't':
                this.app.scene.add(this.sprite.createWord("t", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("t")[0])
                this.z = this.z - 8
                console.log("t pressed");
                break;
            case 'u':
                this.app.scene.add(this.sprite.createWord("u", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("u")[0])
                this.z = this.z - 8
                console.log("u pressed");
                break;
            case 'v':
                this.app.scene.add(this.sprite.createWord("v", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("v")[0])
                this.z = this.z - 8
                console.log("v pressed");
                break;
            case 'w':
                this.app.scene.add(this.sprite.createWord("w", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("w")[0])
                this.z = this.z - 8
                console.log("w pressed");
                break;
            case 'x':
                this.app.scene.add(this.sprite.createWord("x", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("x")[0])
                this.z = this.z - 8
                console.log("x pressed");
                break;
            case 'y':
                this.app.scene.add(this.sprite.createWord("y", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("y")[0])
                this.z = this.z - 8
                console.log("y pressed");
                break;
            case 'z':
                this.app.scene.add(this.sprite.createWord("z", this.x, this.y, this.z, true))
                this.playerName.push(this.sprite.characters.get("z")[0])
                this.z = this.z - 8
                console.log("z pressed");
                break;
            default:
                break;
            }
        }
    }

export { MyInitialMenu };