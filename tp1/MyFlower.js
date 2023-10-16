import * as THREE from 'three';
import { MyPetal } from './MyPetal.js';

class MyFlower extends THREE.Object3D {

    constructor(app ) {
        super();
        this.app = app;
        this.type = 'Group';

        this.petal = new MyPetal(this.app);
        this.petal.scale.set(0.1,0.1,0.1)
        this.petal.position.set(-1.1, 3.45, 0.1)

        this.petal1 = new MyPetal(this.app);
        this.petal1.rotation.y = Math.PI/3
        this.petal1.scale.set(0.1,0.1,0.1)
        this.petal1.position.set(-1.1, 3.45, 0.1)

        this.petal2 = new MyPetal(this.app);
        this.petal2.rotation.y = 2*Math.PI/3
        this.petal2.scale.set(0.1,0.1,0.1)
        this.petal2.position.set(-1.1, 3.45, 0.1)

        this.petal3 = new MyPetal(this.app);
        this.petal3.rotation.y = Math.PI
        this.petal3.scale.set(0.1,0.1,0.1)
        this.petal3.position.set(-1.1, 3.45, 0.1)

        this.petal4 = new MyPetal(this.app);
        this.petal4.rotation.y = -Math.PI/3
        this.petal4.scale.set(0.1,0.1,0.1)
        this.petal4.position.set(-1.1, 3.45, 0.1)

        this.petal5 = new MyPetal(this.app);
        this.petal5.rotation.y = -2*Math.PI/3
        this.petal5.scale.set(0.1,0.1,0.1)
        this.petal5.position.set(-1.1, 3.45, 0.1)
    
        this.add(this.petal)
        this.add(this.petal1)
        this.add(this.petal2)
        this.add(this.petal3)
        this.add(this.petal4)
        this.add(this.petal5)

        const geometry = new THREE.CircleGeometry( 0.5, 40 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const circle = new THREE.Mesh( geometry, material );
        circle.rotation.x = -Math.PI / 2;
        circle.scale.set(0.2, 0.2, 0.2);
        circle.position.set(-1.1, 3.46, 0.1)
        this.add(circle);

        let points = [
            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
            new THREE.Vector3( -0.6,  0.4, 0.0 ), // control point
            new THREE.Vector3(  0.6, -0.6, 0.0 ),  // control point
            new THREE.Vector3(  0.2, 0.6, .0 ),  // ending point
        ]

        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])

        this.lineMaterial = new THREE.MeshBasicMaterial( { color: 0x006C00 } )
        const tubeGeometry1 = new THREE.TubeGeometry(curve, 500, 0.04, 5, false);
        this.lineObj = new THREE.Mesh(tubeGeometry1, this.lineMaterial);
        this.lineObj.rotation.y = Math.PI/2
        this.lineObj.position.set(-1.1, 3.08, 0.2);
        this.lineObj.scale.set(0.6, 0.6, 0.6)
        this.add( this.lineObj );
    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower};
