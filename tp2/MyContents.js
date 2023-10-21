import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
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

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");	
        this.activeCameraName = null
    }

    convertRGBtoTHREEColor(rgbColor) {
        return new THREE.Color(
            rgbColor.r / 255, // Convert 0-255 range to 0.0-1.0
            rgbColor.g / 255,
            rgbColor.b / 255
          );
    }

    addGlobals(data) {
        console.log("Adding Globals...")
        console.log(data)
        // dealing with ambient 
        const ambientData = data.options.ambient
        const ambientLightColor = this.convertRGBtoTHREEColor(ambientData)
          
        if (ambientData.isColor) {
            const ambientLight = new THREE.AmbientLight(ambientLightColor);
            this.app.scene.add(ambientLight);
        }  
          
        // dealing with background
        this.app.scene.background = this.convertRGBtoTHREEColor(data.options.background)

        // dealing with fog
        if (data.fog)
            this.app.scene.fog = new THREE.Fog( this.convertRGBtoTHREEColor(data.fog.color), data.fog.near, data.fog.far );
    }

    addCameras(data) {
        console.log('camera')
        console.log(data.cameras)

        this.activeCameraName = data.activeCameraName

        for (const cameraKey in data.cameras) {
            if (data.cameras.hasOwnProperty(cameraKey)) {
                const camera = data.cameras[cameraKey];
                if (camera.type === 'perspective') {
                    const fov = camera.angle
                    const aspect = window.innerWidth / window.innerHeight;

                    const perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, camera.near, camera.far);
                    perspectiveCamera.position.set(camera.location[0], camera.location[1], camera.location[2])

                    const target = new THREE.Vector3(camera.target[0], camera.target[1], camera.target[2]); 
                    perspectiveCamera.lookAt(target);

                    this.app.buildCamera(camera.id, perspectiveCamera)
                }
                else { //orthogonal        
                    const orthogonalCamera = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);

                    orthogonalCamera.position.set(camera.location[0], camera.location[1], camera.location[2])

                    const target = new THREE.Vector3(camera.target[0], camera.target[1], camera.target[2]); 
                    orthogonalCamera.lookAt(target);

                    this.app.buildCamera(camera.id, orthogonalCamera)
                }
            }
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
    
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
        
        this.addGlobals(data); // add globals
        this.addCameras(data); // add cameras
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
      /* 
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item
        console.log(data)
        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }*/
    }

    update() {
        
    }
}

export { MyContents };