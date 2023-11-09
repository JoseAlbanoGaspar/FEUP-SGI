import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MySceneData } from './parser/MySceneData.js';
import MyPrimitiveCreator from './MyPrimitiveCreator.js';
import MyLightsCreator from './MyLightsCreator.js';
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
		this.reader.open("scenes/demo/submission.xml");	
        this.activeCameraName = null
        this.materials = new Map()
        this.primitiveCreator = new MyPrimitiveCreator(app)
        this.lightsCreator = new MyLightsCreator(app)
    }

    convertRGBtoTHREEColor(rgbColor) {
        return new THREE.Color(
            rgbColor.r / 255, // Convert 0-255 range to 0.0-1.0
            rgbColor.g / 255,
            rgbColor.b / 255
          );
    }

    addGlobals(data) {
        //console.log("Adding Globals...")
        //console.log(data)
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
        //console.log('camera')

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

    addMaterials(data){
        //console.log("materials")

        let i = 0, j = 0
        for (const name in data.materials){
            const material = data.materials[name]
           
            const color = material.color
            //const shading = material.shading
            const emissive = material.emissive
            const shininess = material.shininess
            const specular = material.specular

            const materialObject = new THREE.MeshPhongMaterial({color: color, specular: specular, 
                emissive: emissive, shininess: shininess})

            if (material.textureref) {
                const texture = data.textures[material.textureref].filepath
                const textureMaterial = new THREE.TextureLoader().load(texture)
                materialObject.map = textureMaterial
            }    
            
            this.materials.set(name, materialObject)
            //const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
            //const cube = new THREE.Mesh( geometry, this.materials.get(name)); 
            //cube.position.set(i, j, j);
            //this.app.scene.add( cube );
            //i = i+1
        }
    }

    /**
     * 
     * @param {MySceneData} data 
     * The entry point of the graph traversal
     * In the end of this function the nodes are completely generated
     */
    addNodes(data) {
        let node = data.nodes[data.rootId]
        let defaultMaterial = (node.materialIds.length !== 0) ? node.materialIds[0] : null
        let sceneGroup = this.visit(node, this.materials.get(defaultMaterial))
        this.app.scene.add(sceneGroup)
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This traverse all the nodes of the graph
     * If it's a primitive draw the primitive with the activeMaterial, otherwise creates a group and do recursion
     */
    visit(node, activeMaterial) {
        let group = new THREE.Group()
        if (node.type === "primitive") { // deal with primitives
            group.add(this.dealWithPrimitives(node, activeMaterial))
        }
        else if (node.type === "pointlight" || node.type === "spotlight" || node.type === "directionallight") {
            group.add(this.dealWithLights(node))
        }

        else if (node.type === "node") {
            // update material if declared
            activeMaterial = (node.materialIds.length !== 0) ? this.materials.get(node.materialIds[0]) : activeMaterial
            //deal with node
            this.applyTransformations(group, node.transformations)
            for (const child in node.children) {
                //console.log(node.children[child])
                group.add(this.visit(node.children[child], activeMaterial))
            }
        } 

        return group
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * @param {THREE.Material} activeMaterial 
     * 
     * This function based on the primitive subtype, draws it 
     */
    dealWithPrimitives(node, activeMaterial) {
        if (node.subtype === "rectangle") {
           return this.primitiveCreator.drawRectangle(node, activeMaterial)
        }
        else if (node.subtype === "triangle") {
           return this.primitiveCreator.drawTriangle(node, activeMaterial)
        }
        else if (node.subtype === "box") {
           return this.primitiveCreator.drawBox(node, activeMaterial) 
        }   
        else if (node.subtype === "cylinder") {
           return this.primitiveCreator.drawCylinder(node, activeMaterial) 
        }
        else if (node.subtype === "sphere") {
           return this.primitiveCreator.drawSphere(node, activeMaterial)
        }
        else if (node.subtype === "nurbs") {
           return this.primitiveCreator.drawNurbs(node, activeMaterial) 
        }
    }

    /**
     * 
     * @param {MySceneData.node} node 
     * This function creates the lights of the scene
     */
    dealWithLights(node) {
        if (node.type === "pointlight") {
            return this.lightsCreator.createPointLight(node)
        }
        else if (node.type === "spotlight") {
            return this.lightsCreator.createSpotLight(node)
        }
        else if (node.type === "directionallight") {
            return this.lightsCreator.createDirectionalLight(node)
        }
    }

    /**
     * 
     * @param {THREE.Group} group 
     * @param {Array} transformations
     */
    applyTransformations(object, data) {
        for(let i = 0; i < data.length; i++){
            const transf = data[i];
            if(transf.type == "T")
                object.position.set(object.position.x + transf.translate[0], object.position.y + transf.translate[1], object.position.z + transf.translate[2]);
            else if(transf.type == "R")
                object.rotation.set(
                    object.rotation.x + THREE.MathUtils.degToRad(transf.rotation[0]),
                    object.rotation.y + THREE.MathUtils.degToRad(transf.rotation[1]),
                    object.rotation.z + THREE.MathUtils.degToRad(transf.rotation[2])
                );
            else if(transf.type == "S")
                object.scale.set(object.scale.x * transf.scale[0], object.scale.y * transf.scale[1], object.scale.z * transf.scale[2]);
        }

        object.updateMatrix()

        return object;
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
        //console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
        console.log(data)
        this.addGlobals(data); // add globals
        this.addCameras(data); // add cameras
        this.addMaterials(data); //add materials
        this.addNodes(data); //traverse nodes
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