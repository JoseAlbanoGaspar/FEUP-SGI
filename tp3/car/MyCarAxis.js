import * as THREE from 'three';

class MyCarAxis extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';

        const axisMaterial = new THREE.MeshPhongMaterial({ color: "#00ff00", specular: "000000", emissive: 1, shininess: 3});

        const geometryAxis = new THREE.CylinderGeometry(0.1,0.1, 4.5, 16, 16 )
        const axis = new THREE.Mesh(geometryAxis, axisMaterial)
        axis.receiveShadow = true;
        axis.castShadow = true;
        

        this.add(axis)
    

    }
}

MyCarAxis.prototype.isGroup = true;

export { MyCarAxis};
