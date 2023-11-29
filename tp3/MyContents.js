import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCar } from './car/MyCar.js';
import { MyTrack } from './MyTrack.js';
import { MyParkingLot } from './MyParkingLot.js';
import { MyObstacle } from './MyObstacle.js';
import { MyPowerUps } from './MyPowerUps.js';

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

        // shadows
        this.mapSize = 4096

        this.car == null
        this.initialized = false
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

    async initializeTrackandCar() {
        this.track = new MyTrack(this.app);
        await this.track.loadAndProcessImage(); // Wait for image processing to finish
        this.car = new MyCar(this.app, 50 ,0, this.track.getTrackPixels());
        this.app.scene.add(this.car);
        this.initialized = true; // Set the initialization flag to true after car creation

    }

    initializeParkingLots() {
        const playerPark = new MyParkingLot()
        playerPark.position.set(145, 0, -80);
        
        const opponentPark = new MyParkingLot()
        opponentPark.position.set(145, 0, 80);

        const obstaclesPark = new MyParkingLot()
        obstaclesPark.position.set(145, 0, 0);

        this.app.scene.add(playerPark)
        this.app.scene.add(opponentPark)
        this.app.scene.add(obstaclesPark)
    }

    drawObstacle() {
        const obs = new MyObstacle(this.app)
        return obs
    }

    drawPowerUps() {
        const powerups = new MyPowerUps(this.app)
        return powerups
    }

    stateGame(state) {
        switch (state) {
            case "start":
                startGame()
                break;
            
            case "game":
                startGame()
                break;
                
            case "end":
                endGame()
                break;    
        
            default:
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

        this.initializeTrackandCar()        
        
        const planeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "000000", emissive: 1, shininess: 3});
        const geometry = new THREE.PlaneGeometry( 250, 250, 100, 100 )

        const rectangle = new THREE.Mesh(geometry, planeMaterial)
        rectangle.rotation.x = 3 * Math.PI / 2 
        this.app.scene.add(rectangle)

        this.initializeParkingLots()
        this.drawObstacle()
        this.drawPowerUps()

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
    }

}

export { MyContents };