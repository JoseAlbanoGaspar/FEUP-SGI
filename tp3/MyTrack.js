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

        //updated with trackMap
        this.imgSize = 0;

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

        this.whitePixels = [];
        this.buildCurve();
    }

    async loadAndProcessImage() {
        const texture = await this.loadImage('textures/trackMap.png');
        await this.mapCoordinates(texture);
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(url, (texture) => {
                resolve(texture);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }


    /**
     * Creates the necessary elements for the curve
    */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    mapCoordinates(texture) {
        return new Promise((resolve, reject) => {
            // Assuming texture is already loaded and passed as an argument
    
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const image = texture.image;
    
            canvas.width = image.width;
            canvas.height = image.height;
            
            context.drawImage(image, 0, 0, image.width, image.height);
            this.imgSize = image.width
            const imageData = context.getImageData(0, 0, image.width, image.height).data;

            // Assuming this.whitePixels is defined in the class where this function resides
            this.whitePixels = [];
    
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
    
                if (r > 200 && g > 200 && b > 200) { // non red == white
                    this.whitePixels.push(i / 4);
                }
            }
    
            resolve(); // Resolve the promise when processing is complete
        });
    }
    

    getTrackPixels() {
        return this.whitePixels;
    }

    getSizeTrack() {
        return this.imgSize;
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
