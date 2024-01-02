import * as THREE from 'three';

class MyRoutes {
    constructor() { }

    /**
     * 
     * @returns easy level route
     */
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

    /**
     * 
     * @returns medium level route
     */
    route2() {
        return [
                        
            new THREE.Vector3(56, 2, 0),
            new THREE.Vector3(53, 2, 50),
            new THREE.Vector3(32, 2, 70),
            new THREE.Vector3(10, 2, 80),
            new THREE.Vector3(-30, 2, 85),
            new THREE.Vector3(-40, 2, 80),
            new THREE.Vector3(-50, 2, 70),
            new THREE.Vector3(-35, 2, 50),
            new THREE.Vector3(-20, 2, 25),
            new THREE.Vector3(-40, 2, 10),
            new THREE.Vector3(-80, 2, 0),
            new THREE.Vector3(-90, 2, -25),
            new THREE.Vector3(-70, 2, -45),
            new THREE.Vector3(-65, 2, -80),
            new THREE.Vector3(-35, 2, -93),
            new THREE.Vector3(40, 2, -55),
            new THREE.Vector3(50, 2, -30),
            new THREE.Vector3(56, 2, 0)     
        ]
    }
    /**
     * 
     * @returns hard level route
     */
    route3() {
        return [                    
            new THREE.Vector3(56, 2, 0),
            new THREE.Vector3(56, 2, 50),
            new THREE.Vector3(40, 2, 70),
            new THREE.Vector3(20, 2, 90),
            new THREE.Vector3(-10, 2, 100),
            new THREE.Vector3(-50, 2, 70),    
            new THREE.Vector3(-15, 2, 30),
            new THREE.Vector3(-40, 2, 5),
            new THREE.Vector3(-80, 2, 0),
            new THREE.Vector3(-90, 2, -25),
            new THREE.Vector3(-70, 2, -50),
            new THREE.Vector3(-75, 2, -80),
            new THREE.Vector3(-35, 2, -93),
            new THREE.Vector3(40, 2, -70),
            new THREE.Vector3(60, 2, -30),
            new THREE.Vector3(56, 2, 0)     
        ]
    }
}


export { MyRoutes };
