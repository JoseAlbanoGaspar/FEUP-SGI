import * as THREE from 'three';
import { Mesh, MeshBasicMaterial, RectAreaLight, Triangle } from 'three';
import { MyAxis } from './MyAxis.js';
import { MyCake } from './MyCake.js';
import { MyTable } from './MyTable.js';
import { MyWindow } from './MyWindow.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

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

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures/floor.jpg');

        texture.wrapS = THREE.RepeatWrapping; // Repeat the texture in the horizontal direction (U)
        texture.wrapT = THREE.RepeatWrapping; // Repeat the texture in the vertical direction (V)
        texture.repeat.set(2, 2);

        // jar related
        
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8         // maximum defined in MyGuiInterface
        this.samplesV = 8        // maximum defined in MyGuiInterface
        

        // journal
        this.builder2 = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 16         // maximum defined in MyGuiInterface
        this.samplesV = 16         // maximum defined in MyGuiInterface

        // plane material
        this.planeMaterial = new THREE.MeshPhongMaterial({ map:texture, color: "#a28e81", 
            specular: "#a28e81", emissive: "#000000", shininess: 10 })
        
        this.table = null;
        this.cake = null;
        this.cakeSlice = null;
        this.window = null;
        this.beatleGroup = new THREE.Group();
        this.jar = new THREE.Group();
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

        let wallsMaterial = new THREE.MeshStandardMaterial({ color: "#f0f0f0", 
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

        this.pointLight = new THREE.PointLight(0xffa500, 20, 1, Math.PI/10, 10, 2);
        this.pointLight.position.set(0, 3, 0);

        this.app.scene.add(this.pointLight)
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

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures/wood.jpg');
        const texture1 = textureLoader.load('textures/view.png');
        const picture1 = textureLoader.load('textures/picture1.jpg');
        const student = textureLoader.load('textures/student.jpeg')

        this.window1 = new MyWindow(this.app, 2, 2, texture, picture1);
        this.window1.position.y = 4
        this.window1.position.x = -2
        this.window1.position.z = -5
        this.app.scene.add(this.window1)

        this.window2 = new MyWindow(this.app, 2, 2, texture, student);
        this.window2.position.y = 4
        this.window2.position.x = 2
        this.window2.position.z = -5
        this.app.scene.add(this.window2)

        let material = new THREE.MeshPhongMaterial({ 
            color: "#ffffff", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        const geometry = new THREE.BoxGeometry( 0.5, 3, 0.5 ); 
        const rectangle = new THREE.Mesh( geometry, material ); 
        rectangle.scale.set(0.1, 1, 0.1)
        rectangle.position.x = -4.8
        rectangle.position.y = 4
        rectangle.position.z = 0
        this.app.scene.add( rectangle );

        const retangleHorizontal = new THREE.Mesh(geometry, material);
        retangleHorizontal.rotation.x = Math.PI / 2
        retangleHorizontal.position.x = -4.8
        retangleHorizontal.position.y = 4
        retangleHorizontal.position.z = 0
        retangleHorizontal.scale.set(0.1, 1.3, 0.1)
        this.app.scene.add(retangleHorizontal)


        this.window3 = new MyWindow(this.app, 4, 3, null, texture1);
        this.window3.rotation.y = Math.PI / 2
        this.window3.position.y = 4
        this.window3.position.x = -4.9
        this.window3.position.z = 0
        this.app.scene.add(this.window3)

        /*
        const rectLight = new THREE.DirectionalLight( 0xffffff, 2 );
        rectLight.position.set( -4.9, 4, 0);
        this.app.scene.add( rectLight )
        */

        this.window4 = new MyWindow(this.app, 5, 3, texture, null);
        this.window4.position.y = 4
        this.window4.position.x = 0
        this.window4.position.z = 5
        this.window4.rotation.y = Math.PI
        this.app.scene.add(this.window4)

        RectAreaLightUniformsLib.init()
        const rectLight = new THREE.RectAreaLight( 0xffffff, 10, 3.9, 2.5 );
        rectLight.position.set( -4.9, 5.5, 0);
        rectLight.rotation.y = -Math.PI / 2;
        rectLight.lookAt(1, 1, 0)
        this.app.scene.add( rectLight )
    }

    buildLamp() {
        const geometry = new THREE.BoxGeometry( 0.5, 3, 0.5 ); 
        const material = new MeshBasicMaterial({color: 0x000000})
        const rectangle = new THREE.Mesh( geometry, material ); 
        rectangle.scale.set(0.2, 1.4, 0.2)
        rectangle.position.x = 4
        rectangle.position.y = 1.9
        rectangle.position.z = 4
        this.app.scene.add( rectangle );

        let dif_cylinder = new THREE.CylinderGeometry(2.46, 1.34, 4, 36);
        let color_glass = new THREE.MeshPhongMaterial({color: 0xe1c16e, shininess: 3});
        this.glass = new THREE.Mesh( dif_cylinder, color_glass);
        this.glass.position.y = 4;
        this.glass.position.z = 4;
        this.glass.position.x = 4;
        this.glass.scale.set(0.3, 0.3, 0.3);
        this.glass.rotation.z = Math.PI;
        this.app.scene.add(this.glass);
    }

    buildBoardLightSupport() {
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
        specular: "#000000", emissive: "#000000", shininess: 50 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(3, 0.25, 0.25);
        const boxMesh = new THREE.Mesh( box, boxMaterial );
        this.app.scene.add(boxMesh)
        boxMesh.position.y = 5.2
        boxMesh.position.z = -5 + (0.25 / 2)
        boxMesh.position.x = -2

        const boxMesh2 = new THREE.Mesh( box, boxMaterial );
        this.app.scene.add(boxMesh2)
        boxMesh2.position.y = 5.2
        boxMesh2.position.z = -5 + (0.25 / 2)
        boxMesh2.position.x = 2
    }
    
    drawBezier(points) {
        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
    
        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( 16 );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 50.0} )

        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.beatleGroup.add(this.lineObj)
    }

    initBeatle() {
        // roda 1
        let points = [
            new THREE.Vector3( 0.0, 0.0, 0.0  ), // starting point
            new THREE.Vector3( 0.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  6.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  6.0, 0.0, 0.0 ),  // ending point
        ]
        
        this.drawBezier(points)

        //roda 2
        points = [
            new THREE.Vector3( 10.0, 0.0, 0.0  ), // starting point
            new THREE.Vector3( 10.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  16.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  16.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)

        // capô
        
        points = [
            new THREE.Vector3( 12.0, 4.0, 0.0  ), // starting point
            new THREE.Vector3( 12.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  16.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  16.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier([points[0], points[1], points[2], points[3]])

        // frente
        let x = 2.5
        points = [
            new THREE.Vector3( 8.0, 8.0, 0.0  ), // starting point
            new THREE.Vector3( 8.0 + x,  8.0, 0.0 ), // control point
            new THREE.Vector3(  12.0, 4.0 + x, 0.0 ),  // control point
            new THREE.Vector3(  12.0, 4.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)
        
        //trás
        x = 4.5
        points = [
            new THREE.Vector3( 8.0, 8.0, 0.0  ), // starting point
            new THREE.Vector3( 8.0 - x,  8.0, 0.0 ), // control point
            new THREE.Vector3(  0.0, x, 0.0 ),  // control point
            new THREE.Vector3(  0.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)

        this.beatleGroup.scale.set(0.2, 0.2, 0.2)
        this.app.scene.add(this.beatleGroup)
        this.beatleGroup.position.z = 4.8
        this.beatleGroup.position.y = 3.2
        this.beatleGroup.position.x = -1.5
    }

    createNurbsSurfaces() {  
        // are there any meshes to remove?
        if (this.meshes !== null) {
            // traverse mesh array
            for (let i=0; i<this.meshes.length; i++) {
                // remove all meshes from the scene
                 this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }
        // declare local variables

        let controlPoints = [];
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 2
        
        controlPoints = [   // U = 0
            [ // V = 0..1;
                [ -1.5, -1.5, 0.0, 1 ],
                [-0.5, 0, 0, 1 ],
                [ -1,  1.5, 0.0, 1 ]
            ],
        // U = 1
            [ // V = 0..1
                [ 0, -1.5, 2.0, 1 ],
                [0, 0, 1,1 ],
                [ 0,  1.5, 2.0, 1 ]
            ],
        // U = 2
            [ // V = 0..1
                [ 1.5, -1.5, 0.0, 1 ],
                [0.5, 0 , 0 , 1],
                [ 1,  1.5, 0.0, 1 ]
            ]
        ]

        const map = new THREE.TextureLoader().load( 'textures/jar.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        const jarMaterial = new THREE.MeshLambertMaterial( { map: map,
            side: THREE.DoubleSide,
         } );
        
        surfaceData = this.builder.build(controlPoints,
                      orderU, orderV, this.samplesU,
                      this.samplesV, jarMaterial)  

        mesh = new THREE.Mesh( surfaceData, jarMaterial );

        let othermesh = mesh.clone()
        othermesh.rotation.y = Math.PI

        this.jar.add(mesh)
        this.jar.add(othermesh)
        this.app.scene.add(this.jar)
        this.meshes.push (mesh)

        this.jar.scale.set(0.3, 0.3, 0.3)
        this.jar.position.set(-1.3,2.5,0.6)
        this.jar.rotation.y = Math.PI / 7
        }

        buildFlower(){
            const geometry = new THREE.CircleGeometry( 0.5, 40 ); 
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
            const circle = new THREE.Mesh( geometry, material );
            circle.rotation.x = -Math.PI / 2;
            circle.scale.set(0.3, 0.3, 0.3);
            circle.position.set(4, 6.01, 2);
            this.app.scene.add(circle);

           const material2 = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
           const petala = new THREE.BoxGeometry(0.5, 0.5, 0.001);
           const petala_mesh = new Mesh(petala, material2);
           petala_mesh.rotation.x = -Math.PI/2;
           petala_mesh.scale.set(0.5, 0.5, 0.5)
           petala_mesh.position.set(4, 6, 2.24);
           this.app.scene.add(petala_mesh)

           const petala_mesh2 = new Mesh(petala, material2);
           petala_mesh2.rotation.x = -Math.PI/2;
           petala_mesh2.scale.set(0.5, 0.5, 0.5)
           petala_mesh2.position.set(4, 6, 1.76);
           this.app.scene.add(petala_mesh2)

           const petala_mesh3 = new Mesh(petala, material2);
           petala_mesh3.rotation.x = -Math.PI/2;
           petala_mesh3.scale.set(0.5, 0.5, 0.5)
           petala_mesh3.position.set(3.8, 6, 2);
           this.app.scene.add(petala_mesh3)

           const petala_mesh4 = new Mesh(petala, material2);
           petala_mesh4.rotation.x = -Math.PI/2;
           petala_mesh4.scale.set(0.5, 0.5, 0.5)
           petala_mesh4.position.set(4.2, 6, 2);
           this.app.scene.add(petala_mesh4);

           
        let points = [
            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
            new THREE.Vector3( -0.6,  0.2, 0.0 ), // control point
            new THREE.Vector3(  0.6, -0.6, 1.0 ),  // control point
            new THREE.Vector3(  0.2, 0.6, 1.0 ),  // ending point
        ]
    
        //let position = new THREE.Vector3(-4,0,0)4
        //this.drawHull(position, points);
    
        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
    
        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( 24 );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(4.5,6,2.4);
        this.lineObj.rotation.x = Math.PI/2
        this.app.scene.add( this.lineObj );
        }

        createNurbsSurfaces2() {  
            // are there any meshes to remove?
    
            if (this.meshes !== null) {
                // traverse mesh array
    
                for (let i=0; i<this.meshes.length; i++) {
                    // remove all meshes from the scene
                    this.app.scene.remove(this.meshes[i])
                }
                this.meshes = [] // empty the array  
            }
    
            // declare local variables
            let controlPoints;
            let surfaceData;
            let mesh;
            let orderU = 2
            let orderV = 1
    
            // build nurb #1
    
            controlPoints =
            [   // U = 0
            [ // V = 0..1;
                [ -1.5, -1.5, 0.0, 1 ],
                [ -1.5,  1.5, 0.0, 1 ]
            ],
        // U = 1
            [ // V = 0..1
                [ 0, -1.5, 3.0, 1 ],
                [ 0,  1.5, 3.0, 1 ]
            ],
        // U = 2
            [ // V = 0..1
                [ 1.5, -1.5, 0.0, 1 ],
                [ 1.5,  1.5, 0.0, 1 ]
            ]
    ]    

        const journalMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff,
            side: THREE.DoubleSide,
         } );
        
         surfaceData = this.builder.build(controlPoints,
            orderU, orderV, this.samplesU,
            this.samplesV, journalMaterial)  

        mesh = new THREE.Mesh( surfaceData, journalMaterial );

        mesh.rotation.x = Math.PI / 2
        mesh.rotation.y = 0
        mesh.rotation.z = 0

        mesh.scale.set( 0.08, 0.15, 0.1 )
        mesh.position.set( 1.7, 2.25, 0.8 )
        this.app.scene.add( mesh )
        this.meshes.push (mesh)

    /*
            surfaceData = this.builder.build(controlPoints,
                          orderU, orderV, this.samplesU,
                          this.samplesV, this.material)  
    
            mesh = new THREE.Mesh( surfaceData, this.material );
    
            mesh.rotation.x = Math.PI / 2
            mesh.rotation.y = 0
            mesh.rotation.z = 0
    
            mesh.scale.set( 0.08, 0.15, 0.1 )
            mesh.position.set( 1.7, 2.27, 0.8 )
            this.app.scene.add( mesh )
            this.meshes.push (mesh)
            */
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

        this.spotLight = new THREE.SpotLight(0xffffff, 60, 1, (Math.PI / 180), 10, 0)
        this.spotLight.position.set(0, 4, 0)

        this.target = new THREE.Object3D();
        this.target.position.set(0, 1, 0); // Set the target coordinates
        this.app.scene.add(this.target);

        this.spotLight.target = this.target;
        this.app.scene.add(this.spotLight)

        this.cakeLight = new THREE.SpotLight(0xffffff, 150, 1, Math.PI/12, 10, 0)
        this.cakeLight.position.set(0, 2.3, 0);
        
        this.cakeLight.target = this.target;
        this.app.scene.add(this.cakeLight)

        /*
        //window light
        RectAreaLightUniformsLib.init()
        // Create a RectAreaLight
        const lightColor = 0xffffff; // Color of the light
        const lightIntensity = 50; // Intensity of the light
        const lightWidth = 5; // Width of the light
        const lightHeight = 5; // Height of the light
        this.rectAreaLight = new THREE.RectAreaLight(lightColor, lightIntensity, lightWidth, lightHeight);

        // Set the position of the RectAreaLight
        this.rectAreaLight.position.set(0, 2.3, 0);

        // Add the RectAreaLight to the scene
        this.app.scene.add(this.rectAreaLight);
        */

        // lamp
        this.pointLightLamp = new THREE.SpotLight(0xe1c16e, 100, 6, Math.PI/3, 1, 1);
        this.pointLightLamp.position.set(4, 4, 4);

        this.targetLamp = new THREE.Object3D();
        this.targetLamp.position.set(4, 0, 4); // Set the target coordinates
        this.app.scene.add(this.targetLamp);

        this.pointLightLamp.target = this.targetLamp;
        this.app.scene.add(this.pointLightLamp)

        // cake slice light
        this.sliceLight = new THREE.SpotLight(0xe1c16e, 20, 1.5, Math.PI/6, 1, 1);
        this.sliceLight.position.set(1.3, 3, -1);

        this.targetSlice = new THREE.Object3D();
        this.targetSlice.position.set(2,2,2);
        //this.app.scene.add(this.targetSlice)
        
        this.sliceLight.target = this.targetSlice
        this.app.scene.add(this.sliceLight)

        this.helper = new THREE.SpotLightHelper(this.sliceLight)

        // boards' lights
        const bl1 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl1.position.set(1,5.6,-4.6)

        const blTarget = new THREE.Object3D()
        blTarget.position.set(2,0,-5)

        bl1.target = blTarget
        this.app.scene.add(bl1)

        this.bl1helper = new THREE.SpotLightHelper(bl1)
        //this.app.scene.add(this.bl1helper)

        const bl2 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl2.position.set(2,5.6,-4.6)

        bl2.target = blTarget
        this.app.scene.add(bl2)

        const bl3 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl3.position.set(3,5.6,-4.6)

        bl3.target = blTarget
        this.app.scene.add(bl3)

        const bl4 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl4.position.set(-1,5.6,-4.6)

        const blTarget2 = new THREE.Object3D()
        blTarget2.position.set(-2,0,-5)

        bl4.target = blTarget2
        this.app.scene.add(bl4)

        const bl4helper = new THREE.SpotLightHelper(bl4)
        //this.app.scene.add(bl4helper)

        const bl5 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl5.position.set(-2,5.6,-4.6)

        bl5.target = blTarget2
        this.app.scene.add(bl5)

        const bl6 = new THREE.SpotLight(0xADD8E6, 20, 2.5, Math.PI/6, 1, 1);
        bl6.position.set(-3,5.6,-4.6)

        bl6.target = blTarget2
        this.app.scene.add(bl6)

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
        this.buildLamp()
        this.buildBoardLightSupport()
        this.initBeatle()
        this.createNurbsSurfaces()
        this.createNurbsSurfaces2()
        this.buildFlower()
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