import * as THREE from 'three';

class MyCarLights extends THREE.Object3D {

    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app
        this.targetObject = new THREE.Object3D();

        const lightMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "000000", emissive: 1, shininess: 3});

        const geometryLight = new THREE.CylinderGeometry(0.3,0.3, 0.5, 16, 16)
        const light = new THREE.Mesh(geometryLight, lightMaterial)
        light.receiveShadow = true;
        light.castShadow = true;
        
        this.spotLight = new THREE.SpotLight("ffffff", 10, 15, 1, 0.7, 2);
        this.spotLight.position.set(0, 0, 0);

        this.setTarget(5, 10, 0 )
        this.add(light)
        this.add(this.spotLight)
        this.add(this.targetObject)

        this.rotation.z = 3 * Math.PI / 2
    
    }

    setTarget(x, y, z) {
        console.log("target")
        console.log(x, y, z)
        this.targetObject.position.set(x, y, z); 

        this.spotLight.target = this.targetObject

    }

    drawHelper() {
        this.app.scene.add(new THREE.SpotLightHelper(this.spotLight))
    }
}

MyCarLights.prototype.isGroup = true;

export { MyCarLights};
