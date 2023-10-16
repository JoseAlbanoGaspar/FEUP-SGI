import * as THREE from 'three';

class MyPetal extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     */
    constructor(app ) {
        super();
        this.app = app;
        this.type = 'Group';

        // Define the vertices of the triangle
        const geometry1 = new THREE.BufferGeometry();
        const vertices = new Float32Array([
        0.0, 1.0, 0.0, // Vertex 1
        -1.0, -1.0, 0.0, // Vertex 2
        1.0, -1.0, 0.0, // Vertex 3
        ]);

        // Add the vertices to the geometry
        geometry1.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material1 = new THREE.MeshBasicMaterial({ color: 0xff00ff,  side: THREE.DoubleSide, }); // Green color

        const triangle = new THREE.Mesh(geometry1, material1);
        triangle.rotation.x = -Math.PI / 2
        triangle.position.set(0, 0, 1)
        this.app.scene.add(triangle);

        const geometry2 = new THREE.CircleGeometry( 1, 32, 0, Math.PI ); 
        const semicircle = new THREE.Mesh( geometry2, material1 ); 
        semicircle.rotation.x = Math.PI / 2;
        semicircle.position.set(0, 0, 2)
        this.app.scene.add( semicircle );

        this.add(triangle)
        this.add(semicircle)
    }
}

MyPetal.prototype.isGroup = true;

export { MyPetal};
