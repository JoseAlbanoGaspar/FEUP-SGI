import * as THREE from 'three';

class MyBody extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';

        // car body
        const materialObject = new THREE.MeshPhongMaterial({color: "#ff0000", specular: "#000000", 
            emissive: 1, shininess: 3})
        const geometry = new THREE.BoxGeometry(6, 3, 3, 1, 1, 1);
        const box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;
        
        this.add(box)
    
    }
}

MyBody.prototype.isGroup = true;

export { MyBody };
