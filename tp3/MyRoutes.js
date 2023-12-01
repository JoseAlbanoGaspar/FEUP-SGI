import * as THREE from 'three';

class MyRoutes {
    constructor() { }

    route1() {
        return [
            
                new THREE.Vector3(56, 0, 0),
                new THREE.Vector3(56, 0, 50),
                new THREE.Vector3(40, 0, 70),
                new THREE.Vector3(20, 0, 90),
                new THREE.Vector3(-10, 0, 100),
                new THREE.Vector3(-45, 0, 90),
                new THREE.Vector3(-55, 0, 70),
                new THREE.Vector3(-35, 0, 50),
                new THREE.Vector3(-20, 0, 25),
                new THREE.Vector3(-40, 0, 10),
                new THREE.Vector3(-80, 0, 0),
                new THREE.Vector3(-90, 0, -25),
                new THREE.Vector3(-85, 0, -45),
                new THREE.Vector3(-75, 0, -80),
                new THREE.Vector3(-35, 0, -93),
                new THREE.Vector3(40, 0, -70),
                new THREE.Vector3(60, 0, -30),
                new THREE.Vector3(56, 0, 0)            
            
        ]
    }

    route2() {
        return null
    }
}


export { MyRoutes };
