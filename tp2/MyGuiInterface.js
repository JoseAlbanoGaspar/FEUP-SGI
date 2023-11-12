import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';


/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
        this.cameraFolder = null
        this.cameraController = null
        this.lightFolder = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    createCameraDropdown() {
        this.cameraController = this.cameraFolder.add(this.app, 'activeCameraName', this.app.cameraNames).name('active camera');
      }


    updateCameraDropdown() {

        this.cameraFolder.children = []
        this.createCameraDropdown();
        const old_display = this.cameraFolder.domElement.lastChild.firstChild
        old_display.parentNode.removeChild(old_display)

    }

    /**
     * 
     * @param {*} subfolder 
     * @param {*} light 
     * 
     * This function adds light parameters of lights based on the type of light
     */
    addLightParameters(subfolder, light) {
        switch (light.constructor) {
            case THREE.SpotLight:
                subfolder.add(light, 'intensity', 0, 100).name('Intensity');
                subfolder.add(light, 'distance', 0, 200).name('Distance');
                subfolder.add(light, 'angle', 0, Math.PI / 2).name('Angle');
                subfolder.add(light, 'penumbra', 0, 1).name('Penumbra');
                subfolder.add(light, 'decay', 1, 2).name('Decay');                 
                break;
            case THREE.DirectionalLight:
                subfolder.add(light, 'intensity', 0, 2).name('Intensity');
                break;
            default: // THREE.PointLight
                subfolder.add(light, 'intensity', 0, 100).name('Intensity');
                break;
        }
    }

    /**
     * Initialize the gui interface
     */
    init() {
        this.cameraFolder = this.datgui.addFolder('Camera')
        this.createCameraDropdown();
        // note that we are using a property from the app 
        this.cameraFolder.open()

        this.lightFolder = this.datgui.addFolder('Lights')

        for (let [key, light] of this.app.contents.lights) {
            let subfolder = this.lightFolder.addFolder(key + ' - ' + light.type)
            
            subfolder.add({ visible: light.visible }, 'visible').name('Enable/Disable').onChange(function (value) {
                light.visible = value
            });
            subfolder.addColor({ color: light.color.getHex() }, 'color').onChange((color) => {
                light.color.set(color);
            }).name('Color');

            this.addLightParameters(subfolder, light)
            

            subfolder.close();       
        }
    }
}

export { MyGuiInterface };