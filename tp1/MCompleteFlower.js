import * as THREE from 'three';
import { MyFlower } from './MyFlower.js';

class MyCompleteFlower extends THREE.Object3D {

    constructor(app ) {
        super();
        this.app = app;
        this.type = 'Group';

        this.flower = new MyFlower(this.app);
            this.flower.scale.set(0.1,0.1,0.1)
            this.flower.position.set(-1.1, 3.45, 0.1)

            this.flower1 = new MyFlower(this.app);
            this.flower1.rotation.y = Math.PI/3
            this.flower1.scale.set(0.1,0.1,0.1)
            this.flower1.position.set(-1.1, 3.45, 0.1)

            this.flower2 = new MyFlower(this.app);
            this.flower2.rotation.y = 2*Math.PI/3
            this.flower2.scale.set(0.1,0.1,0.1)
            this.flower2.position.set(-1.1, 3.45, 0.1)

            this.flower3 = new MyFlower(this.app);
            this.flower3.rotation.y = Math.PI
            this.flower3.scale.set(0.1,0.1,0.1)
            this.flower3.position.set(-1.1, 3.45, 0.1)

            this.flower4 = new MyFlower(this.app);
            this.flower4.rotation.y = -Math.PI/3
            this.flower4.scale.set(0.1,0.1,0.1)
            this.flower4.position.set(-1.1, 3.45, 0.1)

            this.flower5 = new MyFlower(this.app);
            this.flower5.rotation.y = -2*Math.PI/3
            this.flower5.scale.set(0.1,0.1,0.1)
            this.flower5.position.set(-1.1, 3.45, 0.1)
        
            this.add(this.flower)
            this.add(this.flower1)
            this.add(this.flower2)
            this.add(this.flower3)
            this.add(this.flower4)
            this.add(this.flower5)

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
    
        this.lineMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        const tubeGeometry1 = new THREE.TubeGeometry(curve, 500, 0.04, 5, false);
        this.lineObj = new THREE.Mesh(tubeGeometry1, this.lineMaterial);
        this.lineObj.rotation.y = Math.PI/2
        this.lineObj.position.set(-1.1, 3.08, 0.2);
        this.lineObj.scale.set(0.6, 0.6, 0.6)
        this.add( this.lineObj );
    }
}

MyCompleteFlower.prototype.isGroup = true;

export { MyCompleteFlower};
