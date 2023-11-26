import * as THREE from 'three';

class MyParkingLot extends THREE.Object3D {
    constructor() {
        super();
        this.type = 'Group';

        // Create a texture loader
        const textureLoader = new THREE.TextureLoader();
        
        // Load the texture image
        const texture = textureLoader.load('textures/parkingLot.jpg');

        // Material with texture
        const planeMaterial = new THREE.MeshPhongMaterial({ map: texture });

        const geometry = new THREE.PlaneGeometry(70, 40, 70, 70);

        const rectangle = new THREE.Mesh(geometry, planeMaterial);
        rectangle.rotation.x = 3 * Math.PI / 2;

        rectangle.rotation.z = Math.PI / 2;
        this.add(rectangle);
    }
}

MyParkingLot.prototype.isGroup = true;

export { MyParkingLot };
