import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCar } from './car/MyCar.js';
import { MyTrack } from './MyTrack.js';
import { MyParkingLot } from './MyParkingLot.js';
import { MyObstacle } from './MyObstacle.js';
import { MyPowerUps } from './MyPowerUps.js';
import { MyInitialScreen } from './MyInitialScreen.js';
import { MyInterruptScreen } from './MyInterruptScreen.js';
import { MyRace } from './MyRace.js';
import { MyPicking } from './MyPicking.js';

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

        this.car == null
        this.obstacles = []
        this.powerUps = []
        this.initialized = false
        this.state = "start"
        this.playerCarColor = "#ff0000"
        this.opponentCarColor = "#0000ff"
        this.playerCar = new MyCar(this.app, 47, 0, Math.PI / 2, this.playerCarColor, true);
        this.opponentCar = new MyCar(this.app, 56, 0, 0, this.opponentCarColor, false);
        this.track = new MyTrack();
        this.track.mesh.name = "mytrack";
        this.race = new MyRace(this.app, this.playerCar, this.opponentCar, this.track);
       
    }

    /**
     * this function must be called for each group to enable shadows for each mesh
     */
    applyShadow(child) {
        if (child instanceof THREE.Mesh) {
            // Enable shadows for each mesh within the group
            child.castShadow = true; // for casting shadows
            child.receiveShadow = true; // for receiving shadows
          }
    }

    initializeParkingLots() {
        const playerPark = new MyParkingLot()
        playerPark.position.set(145, 0, -80);
        const car1 = new MyCar(this.app, 145, -90, Math.PI, this.playerCarColor, true)
        const car2 = new MyCar(this.app, 145, -76, Math.PI, "#ff00ff", true)
        const car3 = new MyCar(this.app, 145, -62, Math.PI, "#ffa500", true)
        
        const opponentPark = new MyParkingLot()
        opponentPark.position.set(145, 0, 80);
        const carOpponent1 = new MyCar(this.app, 145, 70, Math.PI, this.opponentCarColor, true)
        const carOpponent2 = new MyCar(this.app, 145, 84, Math.PI, "#006400", true)
        const carOpponent3 = new MyCar(this.app, 145, 98, Math.PI, "#7600bc", true)

        const obstaclesPark = new MyParkingLot()
        obstaclesPark.position.set(145, 0, 0);
        new MyObstacle(this.app, 145, 2, 3)
        new MyObstacle(this.app, 145, 2, 16)
        new MyObstacle(this.app, 145, 2, -10)

        this.app.scene.add(playerPark)
        this.app.scene.add(opponentPark)
        this.app.scene.add(obstaclesPark)

        this.app.scene.add(car1)
        this.app.scene.add(car2)
        this.app.scene.add(car3)
      
        this.app.scene.add(carOpponent1)
        this.app.scene.add(carOpponent2)
        this.app.scene.add(carOpponent3)
        
    }

    drawObstacle() {
        const obs = new MyObstacle(this.app, 45, 1, 3)
        const obs1 = new MyObstacle(this.app, -45, 1, 3)
        this.obstacles.push(obs)
        this.obstacles.push(obs1)
        return obs
    }

    colisionWithObstacle() {
        for (let obstacle in this.obstacles){
            let distance = this.playerCar.getPosition().distanceTo(this.obstacles[obstacle].position);
            if(distance <= 3){
                const newMaterial = new THREE.MeshPhongMaterial({color: "#808080"})
                this.obstacles[obstacle].material = newMaterial
                this.reduceVelocity()
            }
        }
    }

    // Car velocity reduce during 5 seconds
    reduceVelocity() {
        const duration = 5000
        const reductionRate = 0.1
        
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            const reducedVelocity = this.playerCar.velocity * (1 - reductionRate * (elapsed / duration));
            this.playerCar.velocity = reducedVelocity;
            if (elapsed >= duration) {
                clearInterval(intervalId);
            }
        }, 50); 
    }
  
    colisionWithPowerUps() {
        for (let powerUp in this.powerUps){
            let distance = this.playerCar.getPosition().distanceTo(this.powerUps[powerUp].position);
            //console.log("distance ", distance)
            if (distance <= 2){
                //const newMaterial = new THREE.MeshBasicMaterial({color: "0x000000"});
                const newMaterial = new THREE.MeshPhongMaterial({color: "#000000"})
                this.powerUps[powerUp].material = newMaterial
                this.app.scene.remove(this.powerUps[powerUp].mesh)
                this.powerUps.splice(powerUp)
                
                this.increaseVelocity()
                //force refresh
            }
        }
    }

    // Car velocity increase during 5 seconds
    increaseVelocity() {
        const duration = 5000;
        const increaseRate = 0.1;

        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;

            const increasedVelocity = this.playerCar.velocity * (1 + increaseRate * (elapsed / duration));
            this.playerCar.velocity = increasedVelocity;

            if (elapsed >= duration) {
                clearInterval(intervalId);
            }
        }, 50);
    }

    stop() {
        const duration = 5000;

        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;

            this.playerCar.velocity = 0;

            if (elapsed >= duration) {
                clearInterval(intervalId);
            }
        }, 50);
    }

    colisionWithOtherCar() {
        let distance = this.playerCar.getPosition().distanceTo(this.opponentCar.getPosition());
        //console.log("DISTANCE", distance);
        if(distance <= 4){
            this.stop()
        }
    }

    drawPowerUps() {
        const powerups = new MyPowerUps(this.app, 45, 10)
        this.powerUps.push(powerups)
        return powerups
    }

    stateGame() {
        switch (this.state) {
            case "start":
                //MyInitalPage
                console.log("INITIAL ", this.state)
                //let init = new MyInitialScreen(this.app)
                let init = new MyPicking(this.app)
                
                init.addNotPickeableObject(this.track.mesh.name)
                console.log(init.getNotPickeableObject())
                //this.state = init.startGame()
                break;
            
            case "game":
                //MyGame
                console.log("GAME ", this.state)
                break;

            case "pause":
                //pause screen
                let pause = new MyInterruptScreen(this.state)
                break;    
                
            case "end":
                //MyEndPage
                endGame()
                break;    
        
            default:
                //default exist the game
                exit()
                break;
        }
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

        // temporary directional light
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.app.scene.add(directionalLight)        
        
        const planeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "000000", emissive: 1, shininess: 3});
        const geometry = new THREE.PlaneGeometry( this.TRACK_SIZE, this.TRACK_SIZE, 100, 100 );

        const rectangle = new THREE.Mesh(geometry, planeMaterial)
        rectangle.rotation.x = 3 * Math.PI / 2 
        this.app.scene.add(rectangle)

        this.initializeParkingLots()
        this.drawObstacle()
        this.drawPowerUps()
        this.colisionWithObstacle()
        this.stateGame(this.state)

    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        if (this.initialized && this.car !== null) {
            this.car.update(Date.now(), this.track.getSizeTrack())
        }

        //this.stateGame(this.state)
        this.race.update(Date.now());
        this.colisionWithObstacle();
        this.colisionWithPowerUps();
        this.colisionWithOtherCar();

    }

}

export { MyContents };