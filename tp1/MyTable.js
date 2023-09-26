import * as THREE from 'three';

class MyTable extends THREE.Object3D {

    constructor(app, width, heightTop, depth, heightLegs, radiusLegs ) {
        super();
        this.app = app;
        this.type = 'Group';
        
        
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('textures/wood.jpg');

        let tableMaterial = new THREE.MeshPhongMaterial({ 
            map: texture,
            color: "#d8b281", 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let tableLegMaterial = new THREE.MeshPhongMaterial({ 
            //map: texture,
            color: "#d8b281", 
            specular: "#aaaaaa",
            emissive: "#000000",
            shininess: 90
        })
        

        // Create Table top with basic material
        let tableTop = new THREE.BoxGeometry( width,  heightTop,  depth );
        this.tableTopMesh = new THREE.Mesh( tableTop, tableMaterial );
        
        this.tableTopMesh.rotation.x = - Math.PI / 2;
        this.tableTopMesh.position.y = heightLegs;

        // Create table legs
        // Define the cylinder's parameters
        const radiusTop = radiusLegs; // Radius of the top circle
        const radiusBottom = radiusLegs; // Radius of the bottom circle
        const height = heightLegs; // Height of the cylinder
        const radialSegments = 32; // Number of segments around the cylinder
        const heightSegments = 1; // Number of segments along the height
        const openEnded = false; // Whether the cylinder has open ends

        // Create the cylinder geometry
        let geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);

        // Create the cylinder mesh
        let legMesh = new THREE.Mesh(geometry, tableLegMaterial);
        legMesh.position.y = 1
        legMesh.position.x = 1.6
        legMesh.position.z = -1
        this.tableTopMesh.add(legMesh)

        let legMesh2 = new THREE.Mesh(geometry, tableLegMaterial);
        legMesh2.position.y = 1
        legMesh2.position.x = -1.6
        legMesh2.position.z = 1
        this.tableTopMesh.add(legMesh2)

        let legMesh3 = new THREE.Mesh(geometry, tableLegMaterial);
        legMesh3.position.y = 1
        legMesh3.position.x = -1.6
        legMesh3.position.z = -1
        this.tableTopMesh.add(legMesh3)

        let legMesh4 = new THREE.Mesh(geometry, tableLegMaterial);
        legMesh4.position.y = 1
        legMesh4.position.x = 1.6
        legMesh4.position.z = 1
        this.tableTopMesh.add(legMesh4)

        this.add(this.tableTopMesh)
        this.add(legMesh)
        this.add(legMesh2)
        this.add(legMesh3)
        this.add(legMesh4)
    }
}

MyTable.prototype.isGroup = true;

export { MyTable};