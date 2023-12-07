import * as THREE from 'three';
import { MyAnimation } from './MyAnimation.js';

class MyRace {
    constructor(app, playerCar, opponentCar, track) {
        this.app = app;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.track = track;
        this.route = this.track.getRoutes()[0]; // choosing the route
        this.clock = new THREE.Clock();

        this.initialized = false;

        this.init();
        this.display();
        this.starOpponentCarAnimation();
        
        this.debugKeyFrames();
    }

    async init() {
        await this.track.load(); // Wait for image processing to finish
        this.playerCar.setTrackPixels(this.track.getTrackPixels());
        this.playerCar.setTrackSize(this.track.getSizeTrack());
        this.initialized = true; 
    }

    starOpponentCarAnimation() {
        this.animationBuilder = new MyAnimation(this.route);
        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.opponentCar)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(this.animationBuilder.getPositionClip());
        const rotationAction = this.mixer.clipAction(this.animationBuilder.getRotationClip());

        // Play both animations
        positionAction.play()
        rotationAction.play()
    }

    display() {
        this.app.scene.add(this.track);
        this.app.scene.add(this.playerCar);
        this.app.scene.add(this.opponentCar);
    }

    /**
     * Build control points and a visual path for debug
     */
    debugKeyFrames() {

        let spline = new THREE.CatmullRomCurve3([...this.route])
        // Setup visual control points

        for (let i = 0; i < this.route.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.position.set(... this.route[i])

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        this.app.scene.add(tubeMesh)

    }

    update() {
        if (this.initialized) {
            this.playerCar.update(Date.now())
        }
        const delta = this.clock.getDelta()
        this.mixer.update(delta)

    }
}


export { MyRace };
