import * as THREE from 'three';

class MyWheel extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';


        //wheels
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "000000", emissive: 1, shininess: 3});

        const geometryWhell = new THREE.CylinderGeometry(1.25, 1.25, 0.5, 16, 16 )
        const wheel = new THREE.Mesh(geometryWhell, cylinderMaterial)
        wheel.receiveShadow = true;
        wheel.castShadow = true;

        
        
        wheel.rotation.x = Math.PI / 2

        this.add(wheel)
    

    }
}

MyWheel.prototype.isGroup = true;

export { MyWheel};
