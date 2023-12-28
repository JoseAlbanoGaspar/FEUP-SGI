import * as THREE from 'three'

class MyStartLine extends THREE.Object3D {

    constructor() {
        super();

        const textureLoader = new THREE.TextureLoader();

        const cylinderMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('textures/ironPost.jpg'),
            color: "#ffffff" // Default color in case texture fails to load
        });

        const rectangleMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load('textures/raceBanner.jpg'),
            color: "#ffffff" // Default color in case texture fails to load
        });

        const HEIGHT = 30;
        const DIST = 30;

        // Create first cylinder
        const cylinderGeometry1 = new THREE.CylinderGeometry(1, 1, HEIGHT, 32);
        const cylinder1 = new THREE.Mesh(cylinderGeometry1, cylinderMaterial);
        cylinder1.receiveShadow = true;
        cylinder1.castShadow = true;
        cylinder1.position.set(2, 4, 2);
        this.add(cylinder1);

        // Create second cylinder
        const cylinder2 = cylinder1.clone();
        cylinder2.material = cylinderMaterial;
        cylinder2.position.set(2 + DIST, 4, 2);
        this.add(cylinder2);

        // Create rectangle
        const rectangleGeometry = new THREE.BoxGeometry(DIST, 0.5, DIST / 7);
        const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        rectangle.receiveShadow = true;
        rectangle.castShadow = true;
        rectangle.position.set(2 + DIST / 2, 2.8 * HEIGHT / 5, 2);
        rectangle.rotation.x = Math.PI / 2;
        this.add(rectangle);

        this.position.set(this.position.x + 33, this.position.y, this.position.z);
    }

}

MyStartLine.prototype.isGroup = true;

export { MyStartLine };