import * as THREE from 'three';
import { MyAnimation } from './MyAnimation.js';
import { MySpriteSheets } from './MySpritesheets.js';
import { MyStartLine } from './MyStartLine.js';

class MyRace {
    constructor(app, playerCar, opponentCar, track, mode) {
        this.app = app;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.track = track;
        this.route = this.track.getRoutes()[mode]; // choosing the route
        this.wheelsMixers = []; // keeps mixer for each wheel
        this.initialized = false; // true after init() function and used on update()

        // lap counter
        this.LAP_NUM = 3;
        this.playerLaps = 0;
        this.prevPlayerPos = this.playerCar.getPosition();
        this.opponentLaps = 0;
        this.prevOpponentPos = this.opponentCar.getPosition();
        this.cheatCheck = [false, false, false, false]; // the car must pass through all quadrants before the lap is valid

        // chronometers
        this.timer = new THREE.Clock()
        this.playerTime = 0;  // these variables are in seconds
        this.opponentTime = 0;
        this.timerGlobal = 0

        //game pause and its event listener
        this.isPaused = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);

        // static element
        this.startLine = new MyStartLine();

        //Display Time
        this.countTime = null
        this.sprite = new MySpriteSheets(this.app)
        this.app.scene.add(this.sprite.createWord("play", -122, 48, -60, true))

        this.init();
        
        //this.debugKeyFrames(); // only for debug purposes
    }

    /**
     * Loads the track - processes where is in/out of track via a top view photo and then transmits this information into the cars 
     */
    async init() {
        await this.track.load(); // Wait for image processing to finish
        this.playerCar.setTrackPixels(this.track.getTrackPixels());
        this.playerCar.setTrackSize(this.track.getSizeTrack());

        this.display();
        this.starOpponentCarAnimation();


        this.initialized = true; 
    }

    /**
     * handles pause
     */
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

      /**
       * Start the movement of the automatic car
       */
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

    getPlayerLap() {
        return this.playerLaps
    }

    getOpponentLap() {
        return this.opponentLaps
    }

    getPlayerTime() {
        return this.playerTime
    }

    getOpponentTime() {
        return this.opponentTime
    }

    /**
     * Displays the contents for the race
     */
    display() {
        this.app.scene.add(this.track);
        this.app.scene.add(this.playerCar);
        this.app.scene.add(this.opponentCar);
        this.app.scene.add(this.startLine);
    }

    /**
     * Build control points and a visual path for debug - not used on final version
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
    
    /**
     * Verifies if the user is trying to cheat. For a lap to be considered well done
     * the player must have been in all 4 quadrants at least one time.
     * This, added to other measures like the reduced velocity of the car when it is 
     * outside the track makes cheating impossible
     */
    antiCheatUpdate(currentPlayerPos) {
        if (currentPlayerPos.x >= 0 && currentPlayerPos.z >= 0) {
            this.cheatCheck[0] = true
        }
        else if (currentPlayerPos.x < 0 && currentPlayerPos.z >= 0) {
            this.cheatCheck[1] = true
        }
        else if (currentPlayerPos.x < 0 && currentPlayerPos.z < 0) {
            this.cheatCheck[2] = true
        }
        else
            this.cheatCheck[3] = true
    }

    /**
     * Updates the laps
     */
    updateLap() {
        const currentPlayerPos = this.playerCar.getPosition()
        const currentOpponentPos = this.opponentCar.getPosition()
        this.antiCheatUpdate(currentPlayerPos)
        
        if (this.prevPlayerPos.z < 0 && currentPlayerPos.z >= 0 &&
            currentPlayerPos.x >= 35 && currentPlayerPos.x <= 65 &&
            this.cheatCheck.every((element) => element === true)) {
                this.playerLaps++;
                this.cheatCheck.fill(false);
        }
        else if (this.prevOpponentPos.z < 0 && currentOpponentPos.z >= 0) {
            this.opponentLaps++;            
        }

        this.prevPlayerPos = currentPlayerPos.clone()
        this.prevOpponentPos = currentOpponentPos.clone()
        
    }

    /**
     * Function to pause the game
     */
    pauseGame() {
        this.isPaused = true;
        this.app.scene.add(this.sprite.createWord("pause", -122, 48, -60, true))
        this.timer.stop();
    }

    /**
     * Function to resume the game
     */
    resumeGame() {
        this.isPaused = false;
        this.sprite.removeSprite("pause")
        this.timer.start();
    }

    /**
     * Update the timer of the cars (seconds since the beggining of the race)
     */
    updateTimers() {
        const elapsed = this.timer.getDelta()
        if (this.playerLaps != this.LAP_NUM)
            this.playerTime += elapsed
        
        if (this.opponentLaps != this.LAP_NUM)
            this.opponentTime += elapsed

        this.timerGlobal += elapsed    

        const s = this.timerGlobal.toString().split('.')[0]
        if(s !== this.countTime) {
            if(this.countTime === null) {
              this.countTime = s
              this.app.scene.add(this.sprite.createNumbers(s, -122, 88, -60, "time"+s.toString()))
            }
            else {
              this.sprite.removeNumber("time"+this.countTime.toString())
              this.app.scene.add(this.sprite.createNumbers(s, -122, 88, -60, "time"+s.toString()))
              this.countTime = s
            }
            
        }

    }
    /**
     * verifies which car won
     */
    checkWinner() {
        if (this.playerTime <= this.opponentTime) 
            return 0; // player won
        else return 1; // opponent won
    }

    /**
     * delete cars from scene after the race ended
     */
    deleteCars() {
        this.app.scene.remove(this.playerCar);
        this.app.scene.remove(this.opponentCar);
    }

    /**
     * checks if both players completed the race
     */
    gameOver() {
        return this.playerLaps == this.LAP_NUM && this.opponentLaps == this.LAP_NUM
    }

    /**
     * restart rac
     */
    restart() {
        this.sprite.removeNumber("time"+this.countTime.toString())
        this.timer = 0
        this.playerTime = 0
        this.opponentTime = 0
        this.playerLaps = 0
        this.opponentLaps = 0
        this.countTime = null
    }

    update() {
        if (!this.initialized || this.isPaused) return 
        
        this.updateTimers()
         
        const delta = this.app.clock.getDelta()
        if (this.opponentLaps != this.LAP_NUM) this.mixer.update(delta)
        this.playerCar.update(delta)


        for (const wheelMixer of this.wheelsMixers) 
            wheelMixer.update(delta)

        this.updateLap()
        
        if (this.gameOver()) {
            const winner = this.checkWinner()
            this.deleteCars()
            console.log("game ended: ", winner)
        }
    }
}

export { MyRace };
