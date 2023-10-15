import * as THREE from 'three';
class MyBeatle extends THREE.Object3D {

    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        

        this.initBeatle()

    }

    drawBezier(points) {
        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
    
        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( 16 );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x7fb5b5, linewidth: 50.0} )

        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.add(this.lineObj)
    }

    initBeatle() {
        // roda 1
        let points = [
            new THREE.Vector3( 0.0, 0.0, 0.0  ), // starting point
            new THREE.Vector3( 0.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  6.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  6.0, 0.0, 0.0 ),  // ending point
        ]
        
        this.drawBezier(points)

        //roda 2
        points = [
            new THREE.Vector3( 10.0, 0.0, 0.0  ), // starting point
            new THREE.Vector3( 10.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  16.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  16.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)

        // capô
        
        points = [
            new THREE.Vector3( 12.0, 4.0, 0.0  ), // starting point
            new THREE.Vector3( 12.0,  4.0, 0.0 ), // control point
            new THREE.Vector3(  16.0, 4.0, 0.0 ),  // control point
            new THREE.Vector3(  16.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier([points[0], points[1], points[2], points[3]])

        // frente
        let x = 2.5
        points = [
            new THREE.Vector3( 8.0, 8.0, 0.0  ), // starting point
            new THREE.Vector3( 8.0 + x,  8.0, 0.0 ), // control point
            new THREE.Vector3(  12.0, 4.0 + x, 0.0 ),  // control point
            new THREE.Vector3(  12.0, 4.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)
        
        //trás
        x = 4.5
        points = [
            new THREE.Vector3( 8.0, 8.0, 0.0  ), // starting point
            new THREE.Vector3( 8.0 - x,  8.0, 0.0 ), // control point
            new THREE.Vector3(  0.0, x, 0.0 ),  // control point
            new THREE.Vector3(  0.0, 0.0, 0.0 ),  // ending point
        ]

        this.drawBezier(points)
    }
}

MyBeatle.prototype.isGroup = true;

export { MyBeatle };