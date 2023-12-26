import * as THREE from 'three';

class MyBody extends THREE.Object3D {

    constructor(bodyColor) {
        super();
        this.type = 'Group';

        // car body
        const materialObject = new THREE.MeshPhongMaterial({color: bodyColor, specular: "#000000", 
            emissive: 1, shininess: 3})
        let geometry = new THREE.BoxGeometry(6, 3, 3, 1, 1, 1);
        let box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        this.add(box)

        // car upper body
        this.upperBody = new THREE.Group()
        geometry = new THREE.BoxGeometry(2.5, 2, 2, 1, 1, 1);
        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;
        box.position.set(-1,2,0);

        this.upperBody.add(box)

        // car front window
        geometry = new THREE.BoxGeometry(2, 2, 2);

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;
        box.position.set(0.25,1.59,0);
        box.rotation.z = Math.PI / 4

        this.upperBody.add(box)
        this.upperBody.scale.set(1.1, 1.1, 1.2)
        this.upperBody.position.set(0,-0.3,0)

        this.add(this.upperBody)

        // spoiler
        geometry = new THREE.BoxGeometry(1, 0.5, 3.5); // top plank

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-4, 2.4, 0)

        this.add(box)

        geometry = new THREE.BoxGeometry(1, 1, 0.3); // lateral plank 1

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-4, 2.9, 1.7);
        box.rotation.x = Math.PI / 8;
        
        this.add(box)

        geometry = new THREE.BoxGeometry(1, 1, 0.3); // lateral plank 2

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-4, 2.9, -1.7);
        box.rotation.x = -Math.PI / 8;
        
        this.add(box)


        this.spoillerSupport = new THREE.Group();
        geometry = new THREE.BoxGeometry(1, 2.6, 0.3); // spoiler support 1

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-3.57, 0.5,0);
        box.rotation.z = Math.PI / 10;

        this.spoillerSupport.add(box)

        geometry = new THREE.BoxGeometry(1, 0.9, 0.3); // upper spoiler support 1

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-3.95, 2.03,0);

        this.spoillerSupport.add(box)

        geometry = new THREE.BoxGeometry(1, 0.9, 0.3); // upper spoiler support 1

        box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        box.position.set(-3.15, -0.47,0);

        this.spoillerSupport.add(box);

        this.otherSupport = this.spoillerSupport.clone();

        this.spoillerSupport.position.set(0, 0, -1);
        this.otherSupport.position.set(0, 0, 1);

        this.add(this.spoillerSupport)
        this.add(this.otherSupport)


        
    
    }
}

MyBody.prototype.isGroup = true;

export { MyBody };
