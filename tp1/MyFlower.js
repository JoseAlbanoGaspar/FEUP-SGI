import * as THREE from 'three';

class MyFlower extends THREE.Object3D {

    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower};