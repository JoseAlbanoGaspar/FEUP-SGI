import * as THREE from 'three';
import { MyCar } from './car/MyCar.js';
import { MyTrack } from './MyTrack.js';
import { MyParkingLot } from './MyParkingLot.js';
import { MyObstacle } from './MyObstacle.js';
import { MyPowerUps } from './MyPowerUps.js';
import { MyRace } from './MyRace.js';
import { MyPicking } from './MyPicking.js';
import { MyShader } from './MyShader.js';
import { MyInitialMenu } from './MyInitialMenu.js';
import { MyGameMenu } from './MyGameMenu.js';
import { MyOutdoor } from './MyOutdoor.js';
import { MyEndDisplay } from './MyEndDisplay.js';
import { MySpriteSheets } from './MySpritesheets.js';
import { MyFirework } from './MyFirework.js';
import { MySkyBox } from './MySkyBox.js';
import { MyFence } from './MyFence.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.TRACK_SIZE = 250; // for now this value should not change - need to update the track.load() and car.mapCoordinatesToPixelIndex() first

        // shadows
        this.mapSize = 4096

        this.obstacles = []
        this.powerUps = []
        this.state = "start"
        this.oldState = null
        this.oldLapP = 0
        this.oldLapO = 0
        this.typeCollision = ""
        this.fireworks = []
        this.restarted = false
    }

    /**
     * Create and displays the parking lots
     */
    initializeParkingLots() {
        this.playerPark = new MyParkingLot(145, -80)
        this.car1 = new MyCar(this.app, 145, -90, Math.PI, "#ff1111", true)
        this.car2 = new MyCar(this.app, 145, -76, Math.PI, "#ff00ff", true)
        this.car3 = new MyCar(this.app, 145, -62, Math.PI, "#ffa511", true)
        
        this.opponentPark = new MyParkingLot(145, 80)
        this.carOpponent1 = new MyCar(this.app, 145, 70, Math.PI, "#1111ff", true)
        this.carOpponent2 = new MyCar(this.app, 145, 84, Math.PI, "#116411", true)
        this.carOpponent3 = new MyCar(this.app, 145, 98, Math.PI, "#7600bc", true)

        this.obstaclesPark = new MyParkingLot(145, 0)
        this.obst1 = new MyObstacle(this.app, 145, 2, 3, "obs1")
        this.obst2 = new MyObstacle(this.app, 145, 2, 16, "obs2")
        this.obst3 = new MyObstacle(this.app, 145, 2, -10, "obs3")

        this.obstacles.push(this.obst1)
        this.obstacles.push(this.obst2)
        this.obstacles.push(this.obst3)

        this.app.scene.add(this.playerPark)
        this.app.scene.add(this.opponentPark)
        this.app.scene.add(this.obstaclesPark)

        this.app.scene.add(this.car1)
        this.app.scene.add(this.car2)
        this.app.scene.add(this.car3)
      
        this.app.scene.add(this.carOpponent1)
        this.app.scene.add(this.carOpponent2)
        this.app.scene.add(this.carOpponent3)
        
    }

    /**
     * draw the powerups
     */
    drawPowerUps() {
        const powerups = new MyPowerUps(this.app, 20, 80)
        this.powerUps.push(powerups)
        return powerups
    }

    /**
     * detects collision with obstacles
     */
    colisionWithObstacle() {
        for (let obstacle in this.obstacles){
            let distance = this.playerCar.getPosition().distanceTo(this.obstacles[obstacle].position);
            if(distance <= 3){
                this.playerCar.reduceVelocity()
            }
        }
    }
  
    /**
     * Detects collision with powerups
     */
    colisionWithPowerUps() {
        for (let powerUp in this.powerUps){       
            let distance = this.playerCar.getPosition().distanceTo(this.powerUps[powerUp].getObject().position);
            if (distance <= 2 && !this.powerUps[powerUp].previouslyCollided()){         
                this.state = "chooseObstacle"  
                this.app.scene.add(this.sprite.createNumbers("150", -122, 58, -60, "v150"))
                this.playerCar.increaseVelocity()
                this.powerUps[powerUp].disableCollision()
            }
            else if (distance > 2) {
                this.powerUps[powerUp].enableCollision()
            }
        }
    }

    /**
     * detecs collision with the automatic car
     */
    colisionWithOtherCar() {
        let distance = this.playerCar.getPosition().distanceTo(this.opponentCar.getPosition());
        if(distance <= 5){
            this.playerCar.stop()
        }
    }

    /**
     * Changes the state of the game
     */
    async stateGame() {
        switch (this.state) {
            case "start":
                if(this.initial !== undefined) this.app.scene.remove(this.initial)
                this.initial = new MyInitialMenu(this.app)
                this.app.scene.add(this.initial)
                this.oldState = "start"
                this.state = await this.initial.start()
                this.playerName = this.initial.getPlayerName()
                this.app.setActiveCamera("PlayerPark")
                break;

            case "choosePlayerCar":
                this.oldState = "choosePlayerCar"
                await this.choosePlayerCar()
                this.state = "chooseOpponentCar"
                this.app.setActiveCamera("OpponentPark")
                break;

            case "chooseOpponentCar":
                this.oldState = "chooseOpponentCar"
                await this.chooseOpponentCar()
                this.app.setActiveCamera("GameMenu")
                this.state = "gameMenu"
                break;
                
            case "gameMenu":
                this.oldState = "gameMenu"
                let menu = new MyGameMenu(this.app)
                let info = await menu.choose()
                this.state = info[0]
                this.mode = info[1]
                this.initialState()
                this.app.setActiveCamera("Perspective")
                break;
                    
            case "game":
                this.oldState = "game"
                break;

            case "chooseObstacle":
                this.oldState ="chooseObstacle"
                this.race.pauseGame()
                await this.chooseObstacle()
                this.race.resumeGame()
                this.state = "game"
                break; 
                
            case "end":
                if(this.end !== undefined) this.app.scene.remove(this.end)
                this.oldState = "end"
                this.end = new MyEndDisplay(this.app, this.race.checkWinner(), this.playerName, this.race.getPlayerTime(), this.race.getOpponentTime(), this.mode, this.colorPlayer.getHex().toString(16), this.colorOpponent.getHex().toString(16))
                this.app.scene.add(this.end)
                this.state = await this.end.choose()
                this.restartGame()
                this.race.restart()
                break;    
            
            default:
                break;
        }
    }

    /**
     * Uses picking to choose the player car
     */
    async choosePlayerCar() {
        let pickingPlayer = new MyPicking(this.app, "car")
        pickingPlayer.addPickableObjects(this.car1)
        pickingPlayer.addPickableObjects(this.car2)
        pickingPlayer.addPickableObjects(this.car3)

        await pickingPlayer.pick()
    
        this.colorPlayer = pickingPlayer.getOriginalColor()
    }

    /**
     * Uses picking to choose the automatic car
     */
    async chooseOpponentCar(){
        let pickingOpponent = new MyPicking(this.app, "car")
        pickingOpponent.addPickableObjects(this.carOpponent1)
        pickingOpponent.addPickableObjects(this.carOpponent2)
        pickingOpponent.addPickableObjects(this.carOpponent3)

        await pickingOpponent.pick()

        this.colorOpponent = pickingOpponent.getOriginalColor()
    }

    /**
     * Uses picking to choose the obstacle and put it in a selected (by user) position
     */
    async chooseObstacle() {
        let pickingObstacle = new MyPicking(this.app, "obstacle")
        pickingObstacle.addPickableObjects(this.obst1)
        pickingObstacle.addPickableObjects(this.obst2)
        pickingObstacle.addPickableObjects(this.obst3)

        await pickingObstacle.pick()
    }

    /**
     * initializes the game state
     */
    initialState() {
        this.playerCar = new MyCar(this.app, 47, 0, Math.PI / 2, this.colorPlayer, true);
        this.opponentCar = new MyCar(this.app, 56, 0, 0, this.colorOpponent, false);
        this.race = new MyRace(this.app, this.playerCar, this.opponentCar, this.track, this.mode);
        this.drawPowerUps()
        this.app.scene.add(this.sprite.createNumbers(this.race.getPlayerLap(), -122, 78, -60, "pr" + this.race.getPlayerLap().toString()))
        this.app.scene.add(this.sprite.createNumbers(this.race.getOpponentLap(), -122, 68, -60, "or" + this.race.getOpponentLap().toString()))
        this.app.scene.add(this.sprite.createNumbers(120, -122, 58, -60, "v120"))
    }

    /**
     * generate mountains that are then animated with shaders
     */
    initMountains() {
        const planeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff"});
        const geometry = new THREE.PlaneGeometry( this.TRACK_SIZE / 2, this.TRACK_SIZE , 100, 100 );

        const rectangle = new THREE.Mesh(geometry, planeMaterial)
        rectangle.rotation.x = 3 * Math.PI / 2
        rectangle.rotation.z =  Math.PI / 2
        rectangle.position.set(0, -25, -187) 
        this.app.scene.add(rectangle)

        const rectangle2 = rectangle.clone()
        rectangle2.position.set(0, -25, 187)
        rectangle2.rotation.z =3 * Math.PI / 2 
        this.app.scene.add(rectangle2)
        this.mountains = []
        this.mountains.push(rectangle)
        this.mountains.push(rectangle2)
    }

    /**
     * Generates the fences on the background
     */
    initFence() {
        const fence = new MyFence()
        fence.position.set(0, 10, -110)

        const fence2 = fence.clone()
        fence2.position.set(0, 10, 110)

        this.app.scene.add(fence)
        this.app.scene.add(fence2)
    }

    /**
     * Generates the skybox
     */
    initSkyBox() {        
        const skyBox = new MySkyBox()
        skyBox.position.set(0, 249, 0)
        this.app.scene.add(skyBox)
    }

    /**
     * initializes the contents
     */
    init() {

        const pointLight = new THREE.PointLight( 0xffffff, 1000, 0 );
        pointLight.position.set( 0, 20, 0 );

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, Intensity
        directionalLight.position.set(0, 20, 0); // Set light direction
        
        // --------------------------------------------------------------
        //    INITIALIZING LIGHTS AND STATIC ELEMENTS OF THE SCENARIO
        // --------------------------------------------------------------

        // temporary directional light
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.app.scene.add(directionalLight);

        // Adding hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
        hemisphereLight.position.set(0, 20, 0);
        this.app.scene.add(hemisphereLight);
        
        // ground
        const textureLoader = new THREE.TextureLoader();
        
        const grass = textureLoader.load('textures/grass.jpg')
        grass.wrapS = THREE.RepeatWrapping;
        grass.wrapT = THREE.RepeatWrapping;
        grass.repeat.set(8, 8);

        const planeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", map: grass});
        const geometry = new THREE.PlaneGeometry( this.TRACK_SIZE, this.TRACK_SIZE, 100, 100 );
        const rectangle = new THREE.Mesh(geometry, planeMaterial)
        rectangle.rotation.x = 3 * Math.PI / 2 
        rectangle.name = "myplane"
        this.app.scene.add(rectangle)

        new MyOutdoor(this.app)
        this.sprite = new MySpriteSheets(this.app)

        this.initSkyBox()
        this.initFence()

        // --------------------------------------------------------------
        //    END OF LIGHTS AND STATIC ELEMENTS OF THE SCENARIO
        // --------------------------------------------------------------

        // INITIALIZE SCENE
        this.track = new MyTrack();
        this.track.mesh.name = "mytrack";
        this.app.setActiveCamera("Initial")
        this.initializeParkingLots()

        this.initMountains()
        this.stateGame(this.state)

        //shaders

        // generating the samples for shaders
        const texture1  = new THREE.TextureLoader().load('textures/obstacle.png' )
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;

        const texture2  = new THREE.TextureLoader().load('textures/terrain.jpg' )
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;

        const texture3  = new THREE.TextureLoader().load('textures/heightmap.jpg' )
        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;

        /**
         * Usage:
         *  index 0 - shader for pulsing obstacles
         *  index 1 - shader for mountains
         */
        this.shaders = [
                new MyShader(this.app, "Pulsing Obstacle", "Used to animate obstacles",
                    "shaders/pulsing.vert", "shaders/pulsing.frag", {
                        timeFactor: {type: 'f', value: 0.0 },
                        uSampler: {type: 'sampler2D', value: texture1 }
                }),
                new MyShader(this.app, 'Mountain', "generates mountain", "shaders/mountain.vert", "shaders/mountain.frag", {
                    uSampler1: {type: 'sampler2D', value: texture2 },
                    uSampler2: {type: 'sampler2D', value: texture3 }
                })
            ]
        
        this.waitForShaders()

    }

    //-------------- BEGIN OF SHADER FUNCTIONS ----------------------

    /**
     * Waits for all shaders to get initialized and sets them to the adequated objects
     */
    waitForShaders() {
        for (let i=0; i<this.shaders.length; i++) {
            if (this.shaders[i].ready === false) {
                setTimeout(this.waitForShaders.bind(this), 100)
                return;
            }
        }
         // set initial shader on obstacles
        for (const obstacle in this.obstacles) {
            this.setCurrentShader(this.shaders[0], this.obstacles[obstacle])
        }
        
        for (const mountain in this.mountains) {
            this.setCurrentShader(this.shaders[1], this.mountains[mountain])
        }
    }

    /**
     * Sets the shader to a object
     */
    setCurrentShader(shader, selectedObject) {
        if (shader === null || shader === undefined) {
            return
        }
  
        if (selectedObject !== null) {
            selectedObject.material = shader.material
            selectedObject.material.needsUpdate = true
        }
    }

    /**
     * Resets game
     */
    restartGame() {
        for (let obs in this.obstacles) {
            if(this.obstacles[obs].name === "obs1") {
                this.obstacles[obs].position.set(145, 2, 3)
            }
            else if(this.obstacles[obs].name === "obs2") {
                this.obstacles[obs].position.set(145, 2, 16)
            }
            else {
                this.obstacles[obs].position.set(145, 2, -10)
            }
        }
        this.sprite.removeNumber("pr" + this.oldLapP.toString())
        this.sprite.removeNumber("or" + this.oldLapO.toString())
        this.sprite.removeNumber("v150" + this.oldLapO.toString())

        this.oldLapO = 0
        this.oldLapP = 0
    }

    //-----------------END OF SHADER FUNCTIONS ----------------------

    /**
     * Updates the numbers displayed in the outdoor based on the update of the laps
     */
    updateSpritesheets() {
        if(this.oldLapP !== this.race.getPlayerLap()) {
            this.sprite.removeNumber("pr" + this.oldLapP.toString())
            this.app.scene.add(this.sprite.createNumbers(this.race.getPlayerLap(), -122, 78, -60, "pr" + this.race.getPlayerLap().toString()))
            this.oldLapP = this.race.getPlayerLap()
        }

        if(this.oldLapO !== this.race.getOpponentLap()){
            this.sprite.removeNumber("or" + this.oldLapO.toString())
            this.app.scene.add(this.sprite.createNumbers(this.race.getOpponentLap(), -122, 68, -60, "or" + this.race.getOpponentLap().toString()))
            this.oldLapO = this.race.getOpponentLap()
        }

        if(!this.playerCar.collided) {
            this.sprite.removeNumber("v150")
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        if(this.state !== this.oldState) this.stateGame(this.state)

        if(this.state === "game") {
            this.race.update(Date.now());
            this.colisionWithObstacle();
            this.colisionWithPowerUps();
            this.colisionWithOtherCar();
            this.updateSpritesheets()

            if(this.race.gameOver()) {
                this.state = "end"
            }
        }

        // update shaders
        for (const currentShader in this.shaders)
            if (this.shaders[currentShader] !== undefined && this.shaders[currentShader] !== null) {
                this.shaders[currentShader].update(this.app.clock.getElapsedTime())
        }

        //Fireworks
        if(this.state === "end") {
            if(Math.random()  < 0.1 ) {
                this.fireworks.push(new MyFirework(this.app, this))
            }

            for( let i = 0; i < this.fireworks.length; i++ ) {
                if (this.fireworks[i].done) {
                    this.fireworks.splice(i,1) 
                    continue 
                }
                this.fireworks[i].update()
            }
        }

    }

}

export { MyContents };