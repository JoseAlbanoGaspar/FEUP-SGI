import * as THREE from 'three';

class MyRoutes {
    constructor() { }

    route1() {
        return [
                        
                new THREE.Vector3(56, 2, 0),
                new THREE.Vector3(56, 2, 50),
                new THREE.Vector3(40, 2, 70),
                new THREE.Vector3(20, 2, 90),
                new THREE.Vector3(-10, 2, 100),
                new THREE.Vector3(-45, 2, 90),
                new THREE.Vector3(-55, 2, 70),
                new THREE.Vector3(-35, 2, 50),
                new THREE.Vector3(-20, 2, 25),
                new THREE.Vector3(-40, 2, 10),
                new THREE.Vector3(-80, 2, 0),
                new THREE.Vector3(-90, 2, -25),
                new THREE.Vector3(-85, 2, -45),
                new THREE.Vector3(-75, 2, -80),
                new THREE.Vector3(-35, 2, -93),
                new THREE.Vector3(40, 2, -70),
                new THREE.Vector3(60, 2, -30),
                new THREE.Vector3(56, 2, 0)            
            
        ]
    }

    route2() {
        return null
    }
}


export { MyRoutes };
