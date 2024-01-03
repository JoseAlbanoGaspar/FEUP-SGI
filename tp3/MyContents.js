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
import { MySpriteSheets } from './MySpritesheets.js';
import { MyFirework } from './MyFirework.js';

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

    initializeParkingLots() {
        this.playerPark = new MyParkingLot(145, -80)
        this.car1 = new MyCar(this.app, 145, -90, Math.PI, "#ff0000", true)
        this.car2 = new MyCar(this.app, 145, -76, Math.PI, "#ff00ff", true)
        this.car3 = new MyCar(this.app, 145, -62, Math.PI, "#ffa500", true)
        
        this.opponentPark = new MyParkingLot(145, 80)
        this.carOpponent1 = new MyCar(this.app, 145, 70, Math.PI, "#0000ff", true)
        this.carOpponent2 = new MyCar(this.app, 145, 84, Math.PI, "#006400", true)
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

    drawPowerUps() {
        const powerups = new MyPowerUps(this.app, 20, 80)
        this.powerUps.push(powerups)
        return powerups
    }

    colisionWithObstacle() {
        for (let obstacle in this.obstacles){
            let distance = this.playerCar.getPosition().distanceTo(this.obstacles[obstacle].position);
            if(distance <= 3){
                this.typeCollision = "obstacle"
                this.app.scene.add(this.sprite.createWord("obstacle collision", -122, 28, 110, true))
                this.app.scene.add(this.sprite.createWord("elapsed time", -122, 18, 110, true))
                this.playerCar.reduceVelocity()
            }
        }
    }
  
    async colisionWithPowerUps() {
        for (let powerUp in this.powerUps){       
            let distance = this.playerCar.getPosition().distanceTo(this.powerUps[powerUp].getObject().position);
            if (distance <= 2 && !this.powerUps[powerUp].previouslyCollided()){ 
                this.typeCollision = "powerup"          
                this.collidedObs = true
                this.state = "chooseObstacle"  
                this.app.scene.add(this.sprite.createWord("powerup collision", -122, 28, 110, true))
                this.app.scene.add(this.sprite.createWord("elapsed time", -122, 18, 110, true))
                this.app.scene.add(this.sprite.createNumbers("150", -122, 58, -60, "v150"))
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
            this.typeCollision = "car"
            this.app.scene.add(this.sprite.createWord("car collision", -122, 28, 110, true))
            this.app.scene.add(this.sprite.createWord("elapsed time", -122, 18, 110, true))
            this.playerCar.stop()
        }
    }

    async stateGame() {
        switch (this.state) {
            case "start":
                let st = new MyInitialMenu(this.app)
                this.oldState = "start"
                this.state = await st.start()
                this.playerName = st.getPlayerName()
                console.log(this.playerName)
                this.app.setActiveCamera("PlayerPark")
                break;

            case "choosePlayerCar":
                if(this.restart === "restart") this.race.restart()
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

            case "pause":
                this.state = "pause"
                break;    
                
            case "end":
                this.oldState = "end"
                let end = new MyEndDisplay(this.app, this.race.checkWinner(), this.playerName, this.race.getPlayerTime(), this.race.getOpponentTime(), this.mode)
                let infos = await end.choose()
                this.state = infos[1]
                break;    
        
            default:
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

        await pickingObstacle.pick()
    }

    initialState() {
        this.playerCar = new MyCar(this.app, 47, 0, Math.PI / 2, this.colorPlayer, true);
        this.opponentCar = new MyCar(this.app, 56, 0, 0, this.colorOpponent, false);
        this.race = new MyRace(this.app, this.playerCar, this.opponentCar, this.track, this.mode);
        this.drawPowerUps()
        this.app.scene.add(this.sprite.createNumbers(this.race.getPlayerLap(), -122, 78, -60, "pr" + this.race.getPlayerLap().toString()))
        this.app.scene.add(this.sprite.createNumbers(this.race.getOpponentLap(), -122, 68, -60, "or" + this.race.getOpponentLap().toString()))
        this.app.scene.add(this.sprite.createNumbers(120, -122, 58, -60, "v120"))
    }

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

    initFence() {
        const geometry = new THREE.BoxGeometry(200, 2.5, 2.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: new THREE.TextureLoader().load('textures/fence.jpg')});
        const cube = new THREE.Mesh(geometry, material);

        const cube2 = cube.clone()
        cube2.position.set(0, 5, 0)

        const geometry1 = new THREE.BoxGeometry(2.5, 20, 2.5);
        const post = new THREE.Mesh(geometry1, material);

        const post1 = post.clone()
        post1.position.set(50, 0, 0)

        const post2 = post.clone()
        post2.position.set(-50, 0, 0)

        const post3 = post.clone()
        post3.position.set(100, 0, 0)

        const post4 = post.clone()
        post4.position.set(-100, 0, 0)

        const fence = new THREE.Group()
        fence.add(cube)
        fence.add(cube2)
        fence.add(post)
        fence.add(post1)
        fence.add(post2)
        fence.add(post3)
        fence.add(post4)
        fence.position.set(0, 10, -110)

        const fence2 = fence.clone()
        fence2.position.set(0, 10, 110)

        this.app.scene.add(fence)
        this.app.scene.add(fence2)
    }

    initSkyBox() {
         
        const width = 500
        const height = 500
        const depth = 500
        const textureLoader = new THREE.TextureLoader()

        //back plane
        const geometry = new THREE.PlaneGeometry( width, height )
        const materialObject = new THREE.MeshBasicMaterial({
            emissive: 1 })

        const textureMaterial = textureLoader.load('textures/panorama4.jpg')
        materialObject.map = textureMaterial
        
        const back_plane = new THREE.Mesh(geometry, materialObject)

        back_plane.position.set(0, 0, -depth/2)

        //front plane
        const geometry1 = new THREE.PlaneGeometry( width, height )
        const materialObject1 = new THREE.MeshBasicMaterial({ 
            emissive: 1})
        materialObject1.map = textureMaterial
        
        const front_plane = new THREE.Mesh(geometry1, materialObject1)
        front_plane.rotation.y = Math.PI
        front_plane.position.set(0, 0, depth/2)

        //left plane
        const geometry2 = new THREE.PlaneGeometry( depth, height )
        const materialObject2 = new THREE.MeshBasicMaterial({ 
            emissive: 1})

        materialObject2.map = textureMaterial
        
        const left_plane = new THREE.Mesh(geometry2, materialObject2)
        left_plane.rotation.y = Math.PI /2
        left_plane.position.set(-depth/2, 0, 0)

        //right plane
        const geometry3 = new THREE.PlaneGeometry( depth, height )

        const materialObject3 = new THREE.MeshBasicMaterial({
            emissive: 1})
        materialObject3.map = textureMaterial
        const right_plane = new THREE.Mesh(geometry3, materialObject3)
        right_plane.rotation.y = 3*Math.PI /2
        right_plane.position.set(depth/2, 0, 0)

        //top plane
        const geometry4 = new THREE.PlaneGeometry( width, depth )

        const materialObject4 = new THREE.MeshBasicMaterial({ 
            emissive: 1})
        
        const textureMaterialTop = textureLoader.load('textures/sky.jpg')
        materialObject4.map = textureMaterialTop
        
        const top_plane = new THREE.Mesh(geometry4, materialObject4)
        top_plane.rotation.x = Math.PI/2
        top_plane.position.set(0, height/2, 0)

        //bottom plane
        const geometry5 = new THREE.PlaneGeometry( width, depth )

        const materialObject5 = new THREE.MeshBasicMaterial({color: 0xffffff, 
            emissive: 1})
        const textureMaterialBottom = textureLoader.load('textures/grass.jpg')
        textureMaterialBottom.wrapS = THREE.RepeatWrapping;
        textureMaterialBottom.wrapT = THREE.RepeatWrapping;
        textureMaterialBottom.repeat.set(16, 16);

        materialObject5.map = textureMaterialBottom
 
        const bottom_plane = new THREE.Mesh(geometry5, materialObject5)
        bottom_plane.rotation.x = 3*Math.PI/2
        bottom_plane.position.set(0, -height/2, 0)

        let group = new THREE.Group()
        group.add(back_plane)
        group.add(front_plane)
        group.add(left_plane)
        group.add(right_plane)
        group.add(top_plane)
        group.add(bottom_plane)

        group.position.set(0, 249, 0)
        this.app.scene.add(group)
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
        
        this.shaderSamplers = {
            'obstacle' : texture1,
            'mountain' : texture2,
            'heightmap': texture3
        }

        /**
         * Usage:
         *  index 0 - shader for pulsing obstacles
         *  index 1 - shader for mountains
         *  index 2 - TBD 
         *  ...
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
         // set initial shader
         //this.onSelectedShaderChanged(this.selectedShaderIndex);
 
         // set initial shader details visualization
         //this.onShaderCodeVizChanged(this.showShaderCode);
    }

    setCurrentShader(shader, selectedObject) {
        if (shader === null || shader === undefined) {
            return
        }
  
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
            this.sprite.removeSprite("elapsed time")
            switch (this.typeCollision) {
                case "car":
                    this.sprite.removeSprite("car collision")
                    break;
            
                case "obstacle":
                    this.sprite.removeSprite("obstacle collision")
                    break;   
                
                case "powerup":
                    this.sprite.removeSprite("powerup collision")
                    this.sprite.removeNumber("v150")
                    break;
                default:
                    break;
            }
        
        }

    }

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

        if(this.state === "end") {
            if(Math.random()  < 0.1 ) {
                this.fireworks.push(new MyFirework(this.app, this))
            }

            // for each fireworks 
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