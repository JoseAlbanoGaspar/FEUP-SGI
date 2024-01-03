import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

        this.playerName = "";
        this.x = 401, this.y = -30, this.z = 16

        let texture = new THREE.TextureLoader().load("textures/initialMenu.jpg")
        const menuMaterial = new THREE.MeshBasicMaterial({ map: texture})
        const plane = new THREE.PlaneGeometry( 400, 250, 100, 100 );
        //const menuMaterial = new THREE.MeshBasicMaterial({color: "#808080"})
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
        this.app.scene.add(this.sprite.createWord("feup turismo", 401, 60, 40, true))
        this.app.scene.add(this.sprite.createWord("start", 401, 0, 16, true))

        this.app.scene.add(this.sprite.createWord("inês gaspar", 401, -70, 170, true))
        this.app.scene.add(this.sprite.createWord("josé gaspar", 401, -70, -90, true))
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
                this.auxFunction("a")
                break;
            case 'b':
               this.auxFunction("b")
                break;
            case 'c':
                this.auxFunction("c")
                break;
            case 'd':
                this.auxFunction("d")
                break;
            case 'e':
                this.auxFunction("e")
                break;
            case 'f':
                this.auxFunction("f")
                break;
            case 'g':
                this.auxFunction("g")
                break;
            case 'h':
                this.auxFunction("h")
                break;
            case 'i':
                this.auxFunction("i")
                break;
            case 'j':
                this.auxFunction("j")
                break;
            case 'k':
                this.auxFunction("k")
                break;
            case 'l':
                this.auxFunction("l")
                break;
            case 'm':
                this.auxFunction("m")
                break;
            case 'n':
                this.auxFunction("n")
                break;
            case 'o':
                this.auxFunction("o")
                break;
            case 'p':
                this.auxFunction("p")
                break;
            case 'q':
                this.auxFunction("q")
                break;
            case 'r':
                this.auxFunction("r")
                break;
            case 's':
                this.auxFunction("s")
                break;
            case 't':
                this.auxFunction("t")
                break;
            case 'u':
                this.auxFunction("u")
                break;
            case 'v':
                this.auxFunction("v")
                break;
            case 'w':
                this.auxFunction("w")
                break;
            case 'x':
                this.auxFunction("x")
                break;
            case 'y':
                this.auxFunction("y")
                break;
            case 'z':
                this.auxFunction("z")
                break;
            default:
                break;
            }
        }

        auxFunction(char) {
            this.app.scene.add(this.sprite.createWord(char, this.x, this.y, this.z, true))
            this.playerName += char
            this.z = this.z - 8
        }
    }

export { MyInitialMenu };