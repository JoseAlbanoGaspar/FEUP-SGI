import * as THREE from 'three';

class MyWindow extends THREE.Object3D {

    constructor(app, width, height) {
        super();
        this.app = app;
        this.type = 'Group';
        
        
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures/wood.jpg');

        let mainFrameMaterial = new THREE.MeshPhongMaterial({ 
            map: texture,
            color: "#ffffff", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })
        
        let imgFrameMaterial = new THREE.MeshPhongMaterial({ 
            //map: texture,
            color: "#ffffff", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        // Create mainFrame with basic material
        let mainFrame = new THREE.BoxGeometry( width,  height,  0.2 );
        this.mainFrameMesh = new THREE.Mesh( mainFrame, mainFrameMaterial );

        let imgFrame = new THREE.BoxGeometry( width - 0.2,  height - 0.2,  0.3 );
        this.imgFrameMesh = new THREE.Mesh( imgFrame, imgFrameMaterial );

        this.mainFrameMesh.add(this.imgFrameMesh);
        this.add(this.mainFrameMesh)
    }
}

MyWindow.prototype.isGroup = true;

export { MyWindow};