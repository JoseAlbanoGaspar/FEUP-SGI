import * as THREE from 'three'

class MyInitialScreen extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app;
    }

    startGame(){
        setTimeout(100000)
        return "game"
    }
}

export { MyInitialScreen };