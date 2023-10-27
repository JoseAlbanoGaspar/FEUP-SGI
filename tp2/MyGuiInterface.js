import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

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
     * Initialize the gui interface
     */
    init() {
        this.cameraFolder = this.datgui.addFolder('Camera')
        this.createCameraDropdown();
        // note that we are using a property from the app 
        this.cameraFolder.open()
    }
}

export { MyGuiInterface };