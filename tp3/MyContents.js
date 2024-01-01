import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
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
        this.initialized = false
        this.state = "start"
        this.oldState = null
    }

    initializeParkingLots() {
        this.playerPark = new MyParkingLot()
        this.playerPark.position.set(145, 0, -80);
        this.car1 = new MyCar(this.app, 145, -90, Math.PI, "#ff0000", true)
        this.car2 = new MyCar(this.app, 145, -76, Math.PI, "#ff00ff", true)
        this.car3 = new MyCar(this.app, 145, -62, Math.PI, "#ffa500", true)
        
        this.opponentPark = new MyParkingLot()
        this.opponentPark.position.set(145, 0, 80);
        this.carOpponent1 = new MyCar(this.app, 145, 70, Math.PI, "#0000ff", true)
        this.carOpponent2 = new MyCar(this.app, 145, 84, Math.PI, "#006400", true)
        this.carOpponent3 = new MyCar(this.app, 145, 98, Math.PI, "#7600bc", true)

        this.obstaclesPark = new MyParkingLot()
        this.obstaclesPark.position.set(145, 0, 0);
        this.obst1 = new MyObstacle(this.app, 145, 2, 3)
        this.obst1.name = "obs1"
        this.obst2 = new MyObstacle(this.app, 145, 2, 16)
        this.obst2.name = "obs2"
        this.obst3 = new MyObstacle(this.app, 145, 2, -10)
        this.obst3.name = "obs3"

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

    drawPowerUps() {
        const powerups = new MyPowerUps(this.app, 20, 80)
        this.powerUps.push(powerups)
        return powerups
    }

    colisionWithObstacle() {
        for (let obstacle in this.obstacles){
            let distance = this.playerCar.getPosition().distanceTo(this.obstacles[obstacle].position);
            if(distance <= 3){
                const newMaterial = new THREE.MeshPhongMaterial({color: "#808080"})
                this.obstacles[obstacle].material = newMaterial
                this.playerCar.reduceVelocity()
            }
        }
    }
  
    async colisionWithPowerUps() {
        for (let powerUp in this.powerUps){       
            let distance = this.playerCar.getPosition().distanceTo(this.powerUps[powerUp].getObject().position);
            if (distance <= 2 && !this.powerUps[powerUp].previouslyCollided()){                
                this.state = "chooseObstacle"  
                this.playerCar.increaseVelocity()
                this.powerUps[powerUp].disableCollision()
            }
            else if (distance > 2) {
                this.powerUps[powerUp].enableCollision()
            }
        }
    }

    colisionWithOtherCar() {
        let distance = this.playerCar.getPosition().distanceTo(this.opponentCar.getPosition());
        if(distance <= 5){
            this.playerCar.stop()
        }
    }

    async stateGame() {
        switch (this.state) {
            case "start":
                this.app.setActiveCamera("Initial")
                let st = new MyInitialMenu(this.app)
                this.state = await st.start()
                this.oldState = "start"
                break;

            case "choosePlayerCar":
                this.app.setActiveCamera("PlayerPark")
                this.oldState = "choosePlayerCar"
                await this.choosePlayerCar()
                this.state = "chooseOpponentCar"
                break;

            case "chooseOpponentCar":
                //this.app.setActiveCamera("OpponentPark")
                this.oldState = "chooseOpponentCar"
                await this.chooseOpponentCar()
                this.initialState()
                this.state = "gameMenu"
                break;
                
            case "gameMenu":
                //this.app.setActiveCamera("GameMenu")
                this.oldState = "gameMenu"
                let menu = new MyGameMenu(this.app)
                this.state = await menu.choose()
                break;
                    
            case "game":
                this.OldStatestate ="game"
                //MyGame
                break;

            case "chooseObstacle":
                this.oldState ="chooseObstacle"
                this.race.pauseGame()
                await this.chooseObstacle()
                this.race.resumeGame()
                this.state = "game"
              
                break; 

            case "pause":
                this.state = "pause"

                break;    
                
            case "end":
                this.state = "end"
                new MyEndDisplay(this.app)
                break;    
        
            default:
                //default exist the game
                //exit()
                console.log("nvjhbrvbnvrhj")
                break;
        }
    }

    async choosePlayerCar() {
        let pickingPlayer = new MyPicking(this.app, "car")
        pickingPlayer.addPickableObjects(this.car1)
        pickingPlayer.addPickableObjects(this.car2)
        pickingPlayer.addPickableObjects(this.car3)

        await pickingPlayer.pick()
    
        this.colorPlayer = pickingPlayer.getOriginalColor()

        return
        
    }

    async chooseOpponentCar(){
        let pickingOpponent = new MyPicking(this.app, "car")
        pickingOpponent.addPickableObjects(this.carOpponent1)
        pickingOpponent.addPickableObjects(this.carOpponent2)
        pickingOpponent.addPickableObjects(this.carOpponent3)

        await pickingOpponent.pick()

        this.colorOpponent = pickingOpponent.getOriginalColor()
    }

    async chooseObstacle() {
        let pickingObstacle = new MyPicking(this.app, "obstacle")
        pickingObstacle.addPickableObjects(this.obst1)
        pickingObstacle.addPickableObjects(this.obst2)
        pickingObstacle.addPickableObjects(this.obst3)
        pickingObstacle.addPickableObjects(this.track)

        await pickingObstacle.pick()

        pickingObstacle.addNotPickableObject(this.track.name)
        return
    
    }

    initialState() {
        this.playerCar = new MyCar(this.app, 47, 0, Math.PI / 2, this.colorPlayer, true);
        this.opponentCar = new MyCar(this.app, 56, 0, 0, this.colorOpponent, false);
        this.race = new MyRace(this.app, this.playerCar, this.opponentCar, this.track);
        this.drawPowerUps()
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        const pointLight = new THREE.PointLight( 0xffffff, 1000, 0 );
        pointLight.position.set( 0, 20, 0 );
        // shadows
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = this.mapSize;
        pointLight.shadow.mapSize.height = this.mapSize;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 100;
        //this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        //this.app.scene.add( pointLightHelper );

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

        let outdoor = new MyOutdoor(this.app)

        // --------------------------------------------------------------
        //    END OF LIGHTS AND STATIC ELEMENTS OF THE SCENARIO
        // --------------------------------------------------------------

        // INITIALIZE RACE
        this.track = new MyTrack();
        this.track.mesh.name = "mytrack";

        this.initializeParkingLots()

        //this.drawObstacle()
        this.stateGame(this.state)

        //shaders

        // generating the samples for shaders
        const texture1  = new THREE.TextureLoader().load('textures/obstacle.png' )
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        
        this.shaderSamplers = {
            'obstacle' : texture1
        }

        /**
         * Usage:
         *  index 0 - shader for pulsing obstacles
         *  index 1 - TBD
         *  index 2 - TBD 
         *  ...
         */
        this.shaders = [
                new MyShader(this.app, "Color mix shading", "Uses two flat colors and color mix to shade the object",
                    "shaders/pulsing.vert", "shaders/pulsing.frag", {
                        timeFactor: {type: 'f', value: 0.0 },
                        uSampler: {type: 'sampler2D', value: texture1 }
                })
            ]
        
        this.waitForShaders()

    }

    //-------------- BEGIN OF SHADER FUNCTIONS ----------------------

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
         // set initial shader
         //this.onSelectedShaderChanged(this.selectedShaderIndex);
 
         // set initial shader details visualization
         //this.onShaderCodeVizChanged(this.showShaderCode);
    }

    setCurrentShader(shader, selectedObject) {
        if (shader === null || shader === undefined) {
            return
        }
        console.log("Selected shader '" + shader.name + "'")
  
        if (selectedObject !== null) {
            selectedObject.material = shader.material
            selectedObject.material.needsUpdate = true
        }
    }

    //-----------------END OF SHADER FUNCTIONS ----------------------

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
        }

        // update shaders
        for (const currentShader in this.shaders)
            if (this.shaders[currentShader] !== undefined && this.shaders[currentShader] !== null) {
                this.shaders[currentShader].update(this.app.clock.getElapsedTime())
                
        }

    }

}

export { MyContents };