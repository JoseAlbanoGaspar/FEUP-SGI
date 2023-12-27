import * as THREE from 'three';
import { MyAnimation } from './MyAnimation.js';

class MyRace {
    constructor(app, playerCar, opponentCar, track) {
        this.app = app;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.track = track;
        this.route = this.track.getRoutes()[0]; // choosing the route
        this.wheelsMixers = []; // keeps mixer for each wheel
        this.initialized = false; // true after init() function and used on update()

        // lap counter
        this.LAP_NUM = 3;
        this.playerLaps = 0;
        this.prevPlayerPos = this.playerCar.getPosition();
        this.opponentLaps = 0;
        this.prevOpponentPos = this.opponentCar.getPosition();

        // chronometers
        this.timer = new THREE.Clock()
        this.playerTime = 0;  // these variables are in seconds
        this.opponentTime = 0;

        //game pause and its event listener
        this.isPaused = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);


        this.init();
        
        this.debugKeyFrames(); // only for debug purposes
    }

    async init() {
        await this.track.load(); // Wait for image processing to finish
        this.playerCar.setTrackPixels(this.track.getTrackPixels());
        this.playerCar.setTrackSize(this.track.getSizeTrack());

        this.display();
        this.starOpponentCarAnimation();


        this.initialized = true; 
    }

    handleKeyDown(event) {
        const keyCode = event.code;
        
        switch (keyCode) {
            case 'Escape': // Pause
            if (this.isPaused)
                this.resumeGame()
            else this.pauseGame()
            break;
            
            default:
            break;
        }
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

        const wheels = this.opponentCar.getFrontWheels();

        for (const wheel of wheels) {
            const steeringMixer = new THREE.AnimationMixer(wheel);
            const steeringAction = steeringMixer.clipAction(this.animationBuilder.getWheelSteeringClip());
            
            steeringAction.play();
            this.wheelsMixers.push(steeringMixer);
        }
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

    updateLap() {
        const currentPlayerPos = this.playerCar.getPosition()
        const currentOpponentPos = this.opponentCar.getPosition()

        if (this.prevPlayerPos.z < 0 && currentPlayerPos.z >= 0) {
            this.playerLaps++;
        }
        else if (this.prevOpponentPos.z < 0 && currentOpponentPos.z >= 0) {
            this.opponentLaps++;
        }

        this.prevPlayerPos = currentPlayerPos.clone()
        this.prevOpponentPos = currentOpponentPos.clone()
        
    }

    pauseGame() {
        this.isPaused = true;
        this.timer.stop();
    }

    resumeGame() {
        this.isPaused = false;
        this.timer.start();
    }

    updateTimers() {
        this.playerTime += this.timer.getDelta()
        this.opponentTime += this.timer.getDelta()
    }

    gameOver() {
        if (this.LAP_NUM == this.playerLaps && this.LAP_NUM != this.opponentLaps) {
            return 0 // player won
        }
        else if (this.LAP_NUM != this.playerLaps && this.LAP_NUM == this.opponentLaps) {
            return 1 // opponent won
        }
        else if (this.LAP_NUM == this.playerLaps && this.LAP_NUM == this.opponentLaps) {
            if (this.playerTime <= this.opponentTime) 
                return 0; // player won
            else return 1; // opponent won
        }
        else return -1 // no winner yet
    }

    update() {
        if (!this.initialized || this.isPaused) return 
        
        this.updateTimers()
         
        this.playerCar.update(Date.now())

        const delta = this.app.clock.getDelta()
        this.mixer.update(delta)

        for (const wheelMixer of this.wheelsMixers) 
            wheelMixer.update(delta)

        this.updateLap()
        
        if (-1 != this.gameOver()) console.log("Player ", this.gameOver(), " won!")
    }
}

export { MyRace };
