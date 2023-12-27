import * as THREE from 'three';
import { MyWheel } from './MyWheel.js';
import { MyCarAxis } from './MyCarAxis.js';
import { MyBody } from './MyBody.js';
import { MyCarLights } from './MyCarLights.js';


class MyCar extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app 
     */
    constructor(app, x, z, direction, bodyColor, isPlayer = false,  trackPixels = [], trackSize = -1) {
        super();
        this.app = app;
        this.type = 'Group';
        this.isPlayer = isPlayer;
        this.bodyColor = bodyColor;

        // assign initial position
        this.position.set(x, 2, z)

        // movement parameters
        this.MAX_VELOCITY = 1;
        this.MAX_STEERING = Math.PI / 8;
        this.STEERING_ACCELERATION = Math.PI / 2 ;
        this.STEERING_FRICTION = this.STEERING_ACCELERATION * 1.6;
        this.ACCELERATION = 0.25
        this.FRICTION = this.ACCELERATION * 0.8;
        this.BREAKING = this.ACCELERATION * 2;

        this.velocity = 0;
        this.steering = 0;

        // movement flags
        this.front = false;
        this.back = false;
        this.left = false;
        this.right = false;

        // deltas
        this.deltaInc = 0;
        this.deltaSteer = 0;

        //direction
        this.direction = direction;
        this.rotation.y = direction;

        // time elapsed
        this.prevElapsedTime = Date.now()

        //pivot for back axis rotation
        this.car = new THREE.Group()
        this.pivot = new THREE.Group()
        const wheelAxisOffset = 2
        this.pivot.position.set(wheelAxisOffset, 0, 0)
        this.car.add(this.pivot)

        this.center = new Float32Array(0, 9, 0)
        //this sphere is used to determine the colisions
        //translate to the center of the car
        this.sphere = new THREE.SphereGeometry(1, 32, 32)

        //initCar
        this.initBody()
        this.initWheels()
        this.initAxis()
        this.initCarLights()
        this.add(this.car)
        console.log("car ", this.car.position)

        // used on car update to see if it is still on track
        this.whitePixels = trackPixels
        this.trackSize = trackSize
             
        // add event listeners
        if (this.isPlayer) {
          this.handleKeyDown = this.handleKeyDown.bind(this);
          this.handleKeyUp = this.handleKeyUp.bind(this);
          window.addEventListener('keydown', this.handleKeyDown);
          window.addEventListener('keyup', this.handleKeyUp);
        }
    }

    getPosition(){
      return this.position
    }

    setTrackPixels(trackPixels) {
      this.whitePixels = trackPixels; 
    }

    setTrackSize(trackSize) {
      this.trackSize = trackSize; 
    }

    getFrontWheels() {
      return this.frontWheels;
    }

    initCarLights() {
      const light = new MyCarLights(this.app);
      const light2 = new MyCarLights(this.app);

      this.lights = [light, light2]

      // transformations
      light2.position.set(3, 0, -0.75)
      light.position.set(3, 0, 0.75)

      this.pivot.add(light)
      this.pivot.add(light2)
    }

    initBody() {
      const body = new MyBody(this.bodyColor);
      this.pivot.add(body)
    }

    initAxis() {
      const axis1 = new MyCarAxis()
      const axis2 = new MyCarAxis()

      //transformations
      axis1.rotation.x = Math.PI / 2
      axis1.position.set(2, -0.75, 0)
      axis2.rotation.x = Math.PI / 2
      axis2.position.set(-2, -0.75, 0)

      this.pivot.add(axis1)
      this.pivot.add(axis2)
    }

    initWheels() {
      // wheels
      const wheel = new MyWheel()
      const wheel2 = new MyWheel()
      const wheel3 = new MyWheel()
      const wheel4 = new MyWheel()

      this.frontWheels = [wheel, wheel2]
      this.backWheels = [wheel3, wheel4]

      // transformations
      wheel.position.set(2, -0.75, -2.25)
      wheel2.position.set(2, -0.75, 2.25)
      wheel3.position.set(-2, -0.75, -2.25)
      wheel4.position.set(-2, -0.75, 2.25)

      // add to group
      this.pivot.add(wheel)
      this.pivot.add(wheel2)
      this.pivot.add(wheel3)
      this.pivot.add(wheel4)
    }

    mapCoordinatesToPixelIndex(x, z) {
      // Calculate the corresponding pixel position from the given x, y coordinates
      const half = this.trackSize / 2; // must return integer
      const pixelX = Math.floor((x + half) );
      const pixelZ = Math.floor((z + half) );
  
      // Calculate the index in the imageData array corresponding to the pixel position
      const index = (pixelZ * this.trackSize) + pixelX; // 250 is the image width

      // Check if the calculated index exists in the list of white pixels
      if (this.whitePixels.includes(index)) {
          //console.log("inside", index, this.position.x, this.position.z)
          return true;
      } else {
          // If the pixel is not found, you might want to handle this case accordingly
          //console.log('outside track');
          return false; // Or any other indication that the pixel wasn't found
      }
  }

    handleKeyDown(event) {
        const keyCode = event.code;
      
        switch (keyCode) {
          case 'KeyW': // Move car forward
            if (!this.front) this.front = true
            break;
          case 'KeyS': // Move car backward
            if (!this.back) this.back = true
            break;
          case 'KeyA': // Rotate car left
            this.left = true
            break;
          case 'KeyD': // Rotate car right
            this.right = true
            break;
          default:
            break;
        }
      }


    handleKeyUp(event) {
        const keyCode = event.code;
      
        switch (keyCode) {
          case 'KeyW': // Stop moving car forward
            if (this.front) this.front = false;
            break;
          case 'KeyS': // Stop moving car backward
            if (this.back) this.back = false;
            break;
          case 'KeyA': // Stop rotating car left
            if (this.left) this.left = false;
            break;
          case 'KeyD': // Stop rotating car right
            if (this.right) this.right = false;
            break;
          default:
            break;
        }
    }

    updateWheelDirection() {
      for (const wheel of this.frontWheels) {
        wheel.rotation.y = -this.steering
      }    
    }

    updateWheelRotationVelocity() {
      for (const wheel of this.frontWheels) {
        wheel.rotation.z -= this.velocity
      }
      for (const wheel of this.backWheels) {
        wheel.rotation.z -= this.velocity
      }
    }

    updateVelocity() {
      // back and forward
      if (this.front && this.velocity <= this.MAX_VELOCITY - this.deltaInc ) { // car moving forward
        this.velocity += this.deltaInc;
        if (this.velocity > this.MAX_VELOCITY) this.velocity = this.MAX_VELOCITY
      }
      else if (!this.front && this.velocity > 0) { // player released w
          this.velocity -= this.deltaFric;
          if (this.velocity < 0) this.velocity = 0; // make the car stop
      }

      if (this.back && this.velocity >= - (this.MAX_VELOCITY - this.deltaInc)) { // car moving backwards
          this.velocity -= this.deltaInc;
          if (this.velocity < - this.MAX_VELOCITY) this.velocity = - this.MAX_VELOCITY

      }
      else if (!this.back && this.velocity < 0) {
        this.velocity += this.deltaFric;
        if (this.velocity > 0) this.velocity = 0; // make the car stop
      }

      if (this.back && this.velocity > 0 ) { // breaking
        this.velocity -= this.deltaBreak
      }
      else if (this.front && this.velocity < 0) {
        this.velocity += this.deltaInc
      }
    }

    updateSteering() {
      // left and right
      if (this.left && !this.right ) {
          this.steering -= this.deltaSteer
          if (this.steering < - this.MAX_STEERING) this.steering = - this.MAX_STEERING
      }
      else if (!this.left && this.right) {
        this.steering += this.deltaSteer
        if (this.steering > this.MAX_STEERING) this.steering = this.MAX_STEERING
      }

      if (this.velocity != 0 && !this.left && !this.right) {
          if (this.steering > this.deltaSteer*2) this.steering -= this.deltaSteerFric 
          else if (this.steering < - this.deltaSteer*2) this.steering += this.deltaSteerFric
          else this.steering = 0
      }
    }

    updateCarDirection() {
      if (this.velocity != 0) {
        this.direction += this.steering / 7  * this.velocity
      }

      this.rotation.y = -this.direction
    }

    updateCarPosition() {
      this.position.set(this.position.x + this.velocity * Math.cos(this.direction), this.position.y , this.position.z + this.velocity * Math.sin(this.direction));

    }

    updateDeltas(t) {
      let elapsedTime = (t - this.prevElapsedTime ) / 1000 // time in seconds
      this.deltaInc = this.ACCELERATION * elapsedTime
      this.deltaFric = this.FRICTION * elapsedTime
      this.deltaSteer = this.STEERING_ACCELERATION * elapsedTime
      this.deltaSteerFric = this.STEERING_FRICTION * elapsedTime
      this.deltaBreak = this.BREAKING * elapsedTime;
      this.prevElapsedTime = t
    }

    updateIfOutTrack() {
      if (!this.mapCoordinatesToPixelIndex(this.position.x, this.position.z, this.trackSize)) {
        this.velocity *= 0.95
      }
      
    }

    /**
     * 
     */
    update(t) {
        this.updateDeltas(t)
        this.updateIfOutTrack()
        this.updateVelocity()
        this.updateSteering()
        this.updateCarDirection()
        this.updateWheelRotationVelocity()
        this.updateCarPosition()
        this.updateWheelDirection()

    }

}

MyCar.prototype.isGroup = true;

export { MyCar};
