import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCake } from './MyCake.js';
import { MyTable } from './MyTable.js';
import { MyWindow } from './MyWindow.js';

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

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
        
        this.table = null;
        this.cake = null;
        this.cakeSlice = null;
        this.window = null;
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }
    
    /**
     * builds the table
     */
    buildTable() {
        this.table = new MyTable(this.app, 4, 2.5, 0.2, 2, 0.2);
        this.app.scene.add(this.table)

    }

    /**
     * builds walls 
     */
    buildWalls() {

        //Builds the ground wall
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );

        // defining materials for walls
        let wallsMaterial = new THREE.MeshPhongMaterial({ color: "#f0f0f0", 
            specular: "#777777", emissive: "#000000", shininess: 30 })
        let wallHeight = 7;
        plane = new THREE.PlaneGeometry( 10, wallHeight )

        // note: frontWall is the visible wall with the frontal ortoghonal camera (actually is the backWall)
        this.frontWallMesh = new THREE.Mesh( plane, wallsMaterial );
        this.frontWallMesh.position.y = wallHeight / 2
        this.frontWallMesh.position.z = -5
        
        this.rightWallMesh = new THREE.Mesh(plane, wallsMaterial)
        this.rightWallMesh.position.x = -5
        this.rightWallMesh.position.y = wallHeight / 2
        this.rightWallMesh.rotation.y = Math.PI / 2
        
        this.backWallMesh = new THREE.Mesh(plane, wallsMaterial)
        this.backWallMesh.position.y = wallHeight / 2
        this.backWallMesh.position.z = 5
        this.backWallMesh.rotation.y = Math.PI
        
        this.leftWallMesh = new THREE.Mesh(plane, wallsMaterial)
        this.leftWallMesh.position.x = 5        
        this.leftWallMesh.position.y = wallHeight / 2
        this.leftWallMesh.rotation.y = 3 * Math.PI / 2
        
        this.app.scene.add( this.frontWallMesh );
        this.app.scene.add( this.rightWallMesh );
        this.app.scene.add( this.backWallMesh );
        this.app.scene.add( this.leftWallMesh );

    }

    /**
     * build cake
     */
    buildCake() {
        this.cake = new MyCake(this.app, 0.5, 0.5, 0, 11 * Math.PI / 6, - Math.PI/2, 2 * Math.PI / 6, 0.25, -0.125, 0.21650);
        this.app.scene.add(this.cake);
        this.cake.position.y = 2.3
        
    }

    buildCakeSlice(){
        this.cakeSlice = new MyCake(this.app, 0.5, 0.5, 0, Math.PI / 6, - Math.PI / 2, 4 * Math.PI / 6, 0.25, 0.125, 0.21650)
        this.app.scene.add(this.cakeSlice);
        this.cakeSlice.position.y = 2.3
        this.cakeSlice.position.x = 1.45
        this.cakeSlice.position.z = -0.25
        
    }

    buildPlate() {
        let plateCylinder = new THREE.CylinderGeometry(0.2, 0.2, 1, 36);
        let colorWhite = new THREE.MeshBasicMaterial({colorWhite: 0xffffff});
        this.plate = new THREE.Mesh( plateCylinder, colorWhite);
        this.plate.scale.set(3.2, 0, 3.2);
        this.plate.position.y = 2.11;
        this.app.scene.add( this.plate );

        this.plate1 = new THREE.Mesh( plateCylinder, colorWhite);
        this.plate1.scale.set(1.8, 0, 1.8);
        this.plate1.position.x = 1.5;
        this.plate1.position.y = 2.11;
        this.app.scene.add( this.plate1 );
    }

    buildGlass() {
        let dif_cylinder = new THREE.CylinderGeometry(2.46, 1.34, 4, 36);
        let color_glass = new THREE.MeshBasicMaterial({color: 0x084d6e});
        this.glass = new THREE.Mesh( dif_cylinder, color_glass);
        this.glass.position.y = 2.2;
        this.glass.position.z = -0.5;
        this.glass.position.x = 1;
        this.glass.scale.set(0.05, 0.08, 0.05);
        this.app.scene.add(this.glass);
    }

    buildCandle() {
        let cylinder = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 36);
        let candleMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        this.candle = new THREE.Mesh( cylinder, candleMaterial);
        this.candle.position.y = 2.6;
        this.app.scene.add( this.candle );

        let cone = new THREE.ConeGeometry(0.03, 0.06, 20);
        let coneMaterial = new THREE.MeshBasicMaterial({color: 0xffa500});
        this.flame = new THREE.Mesh( cone, coneMaterial );
        this.flame.position.y = 2.83;
        this.app.scene.add( this.flame );
    }

    buildBottle() {
        let cylinder = new THREE.CylinderGeometry(0.2, 0.2, 0.7, 36);
        let bottleMaterial = new THREE.MeshBasicMaterial({color: 0xadd8e6});
        this.bottle = new THREE.Mesh( cylinder, bottleMaterial);
        this.bottle.position.y = 2.3;
        this.bottle.position.z = -0.6;
        this.bottle.position.x = -1;
        this.app.scene.add(this.bottle);

        let tampaMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        this.tampa = new THREE.Mesh(cylinder, tampaMaterial);
        this.tampa.position.y = 2.86;
        this.tampa.position.x = -1;
        this.tampa.position.z = -0.6;
        this.tampa.scale.set(0.3, 0.08, 0.3);
        this.app.scene.add(this.tampa);

        let parte = new THREE.CylinderGeometry(0.05, 0.2, 0.2, 36);
        this.neck = new THREE.Mesh(parte, bottleMaterial);
        this.neck.position.x = -1;
        this.neck.position.z = -0.6;
        this.neck.position.y = 2.75;
        this.app.scene.add(this.neck);
    }

    buildWindow() {
        this.window = new MyWindow(this.app, 5, 3);
        this.window.position.y = 4
        this.window.position.z = -5
        this.app.scene.add(this.window)
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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        this.buildWalls()
        this.buildPlate()
        this.buildTable()
        this.buildCake()
        this.buildCandle()
        this.buildBottle()
        this.buildGlass()
        this.buildCakeSlice()
        this.buildWindow()

    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };