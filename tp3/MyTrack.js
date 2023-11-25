import * as THREE from 'three';

class MyTrack extends THREE.Object3D {

    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;

        //Curve related attributes
        this.segments = 100;
        this.width = 15;
        this.textureRepeat = 1;
        this.showWireframe = true;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;

        this.path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(-50, 0, 50),
        
        new THREE.Vector3(-10, 0 , 88),
        new THREE.Vector3(0, 0, 90),
        new THREE.Vector3(40, 0, 85),
        new THREE.Vector3(50, 0 , 70),
        new THREE.Vector3(35, 0 , 50),
        new THREE.Vector3(20, 0 , 20),
        new THREE.Vector3(40, 0 , 5),
        new THREE.Vector3(70, 0 , 0),
        new THREE.Vector3(90, 0, -30),
        new THREE.Vector3(70, 0, -50),
        new THREE.Vector3(70, 0, -80),
        new THREE.Vector3(30, 0, -85),
        new THREE.Vector3(-50, 0, -50),
        new THREE.Vector3(-50, 0, 0),
       ]);

        this.buildCurve();
    }

    /**
     * Creates the necessary elements for the curve
    */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    /**
    * Create materials for the curve elements: the mesh, the line and the wireframe
    */
    createCurveMaterialsTextures() {
        /*const texture = new THREE.TextureLoader().load("./images/uvmapping.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(3, 3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;*/

        this.wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.3,
        wireframe: true,
        transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Creates the mesh, the line and the wireframe used to visualize the curve
     */
    createCurveObjects() {
        let geometry = new THREE.TubeGeometry(
        this.path,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create the final object to add to the scene
        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.curve.add(this.mesh);
        //this.curve.add(this.wireframe);
        //this.curve.add(this.line);

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1,0.2,1);
        this.curve.position.set(0, -1.3, 0);
        this.app.scene.add(this.curve);
    }
}

MyTrack.prototype.isGroup = true;

export { MyTrack };
