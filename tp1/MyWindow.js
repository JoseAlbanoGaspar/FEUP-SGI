import * as THREE from 'three';
import { MyApp } from './MyApp.js';

class MyWindow extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app 
     * @param {number} width 
     * @param {number} height 
     * @param {THREE.Texture} main_texture 
     * @param {THREE.Texture} img_texture 
     */
    constructor(app, width, height, main_texture, img_texture) {
        super();
        this.app = app;
        this.type = 'Group';

        let mainFrameMaterial = new THREE.MeshStandardMaterial({ 
            map: main_texture ?? null,
            color: "#ffffff", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })
        
        let imgFrameMaterial = new THREE.MeshStandardMaterial({ 
            map: img_texture ?? null,
            color: "#ffffff", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        // Create mainFrame with basic material
        let mainFrame = new THREE.BoxGeometry( width,  height,  0.1 );
        this.mainFrameMesh = new THREE.Mesh( mainFrame, mainFrameMaterial );

        let imgFrame = new THREE.BoxGeometry( width - 0.2,  height - 0.2,  0.1 );
        this.imgFrameMesh = new THREE.Mesh( imgFrame, imgFrameMaterial );
        this.imgFrameMesh.position.z = 0.04

        this.mainFrameMesh.add(this.imgFrameMesh);
        this.add(this.mainFrameMesh)
    }
}

MyWindow.prototype.isGroup = true;

export { MyWindow};