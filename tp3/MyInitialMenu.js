import * as THREE from 'three'
import { MyPicking } from './MyPicking.js';
import { MySpriteSheets } from "./MySpritesheets.js"

class MyInitialMenu extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;

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

        let sprite = new MySpriteSheets(this.app)
        sprite.createWord("start", 401, 0, 16, true)
        this.app.scene.add(menu)
        this.app.scene.add(this.buttonInit)

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

    // Function to handle keydown events
    handleKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'a':
                console.log("a pressed");
                break;
            case 'b':
                console.log("b pressed");
                break;
            case 'c':
                console.log("c pressed");
                break;
            case 'd':
                console.log("d pressed");
                break;
            case 'e':
                console.log("e pressed");
                break;
            case 'f':
                console.log("f pressed");
                break;
            case 'g':
                console.log("g pressed");
                break;
            case 'h':
                console.log("h pressed");
                break;
            case 'i':
                console.log("i pressed");
                break;
            case 'j':
                console.log("j pressed");
                break;
            case 'k':
                console.log("k pressed");
                break;
            case 'l':
                console.log("l pressed");
                break;
            case 'm':
                console.log("m pressed");
                break;
            case 'n':
                console.log("n pressed");
                break;
            case 'o':
                console.log("o pressed");
                break;
            case 'p':
                console.log("p pressed");
                break;
            case 'q':
                console.log("q pressed");
                break;
            case 'r':
                console.log("r pressed");
                break;
            case 's':
                console.log("s pressed");
                break;
            case 't':
                console.log("t pressed");
                break;
            case 'u':
                console.log("u pressed");
                break;
            case 'v':
                console.log("v pressed");
                break;
            case 'w':
                console.log("w pressed");
                break;
            case 'x':
                console.log("x pressed");
                break;
            case 'y':
                console.log("y pressed");
                break;
            case 'z':
                console.log("z pressed");
                break;
            default:
                break;
            }
        }
    }

export { MyInitialMenu };