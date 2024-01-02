import * as THREE from 'three';

class MyParkingLot extends THREE.Object3D {
    constructor(x, z) {
        super();
        this.type = 'Group';

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures/parkingLot.jpg');
        const planeMaterial = new THREE.MeshPhongMaterial({ map: texture });

        const geometry = new THREE.PlaneGeometry(70, 40, 70, 70);
        this.rectangle = new THREE.Mesh(geometry, planeMaterial);
        this.rectangle.rotation.x = 3 * Math.PI / 2;
        this.rectangle.rotation.z = Math.PI / 2;
        this.rectangle.position.set(x, 0, z)

        this.add(this.rectangle);
    }

}

MyParkingLot.prototype.isGroup = true;

export { MyParkingLot };
