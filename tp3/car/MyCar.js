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
    constructor(app, x, z) {
        super();
        this.app = app;
        this.type = 'Group';

        // assign initial position
        this.position.set(x, 1.5, z)

        // movement parameters
        this.MAX_VELOCITY = 1;
        this.velocity = 0;
        this.MAX_STEERING = THREE.MathUtils.degToRad(20);
        this.steering = 0;

        // movement flags
        this.front = false;
        this.back = false;
        this.left = false;
        this.right = false;

        // deltas
        this.deltaInc = 0.01;
        this.deltaSteer = 0.1;

        //direction
        this.direction = 0;

        //pivot for back axis rotation
        this.car = new THREE.Group()
        this.pivot = new THREE.Group()
        const wheelAxisOffset = 2
        this.pivot.position.set(wheelAxisOffset, 0, 0)
        this.car.add(this.pivot)

        //initCar
        this.initBody()
        this.initWheels()
        this.initAxis()
        this.initCarLights()

        this.add(this.car)
      
        // add event listeners
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    initCarLights() {
      const light = new MyCarLights(this.app);
      const light2 = new MyCarLights(this.app);

      //light.drawHelper()
      //light2.drawHelper()

      this.lights = [light, light2]

      // transformations
      light2.position.set(3, 0, -0.75)
      light.position.set(3, 0, 0.75)

      this.car.add(light)
      this.car.add(light2)
      this.pivot.add(light)
      this.pivot.add(light2)
    }

    initBody() {
      const body = new MyBody();
      this.car.add(body)
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

      this.car.add(axis1)
      this.car.add(axis2)
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
      this.car.add(wheel)
      this.car.add(wheel2)
      this.car.add(wheel3)
      this.car.add(wheel4)

      this.pivot.add(wheel)
      this.pivot.add(wheel2)
      this.pivot.add(wheel3)
      this.pivot.add(wheel4)
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
            this.back = false;
            break;
          case 'KeyA': // Stop rotating car left
            this.left = false;
            break;
          case 'KeyD': // Stop rotating car right
            this.right = false;
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

    /**
     * 
     */
    update() {
        // back and forward
        if (this.front && this.velocity <= this.MAX_VELOCITY - this.deltaInc ) { // car moving forward
            this.velocity += this.deltaInc;
            if (this.velocity > this.MAX_VELOCITY) this.velocity = this.MAX_VELOCITY
        }
        if (!this.front && this.velocity > 0) { // player released w
            this.velocity -= this.deltaInc;
            if (this.velocity < 0) this.velocity = 0; // make the car stop
        }

        if (this.back && this.velocity >= - (this.MAX_VELOCITY - this.deltaInc)) { // car moving backwards
            this.velocity -= this.deltaInc;
            if (this.velocity < - this.MAX_VELOCITY) this.velocity = - this.MAX_VELOCITY

        }
        if (!this.back && this.velocity < 0) {
            this.velocity += this.deltaInc;
            if (this.velocity > 0) this.velocity = 0; // make the car stop
        }
        // left and right

        if (this.velocity != 0) {
            this.direction += this.steering / 7  * this.velocity
        }

        if (this.left && !this.right ) {
            this.steering -= this.deltaSteer
            if (this.steering < - this.MAX_STEERING) this.steering = - this.MAX_STEERING
        }

        if (this.velocity != 0 && !this.left && !this.right) {
            if (this.steering > this.deltaSteer*2) this.steering -= this.deltaSteer * 0.2
            else if (this.steering < - this.deltaSteer*2) this.steering += this.deltaSteer * 0.2
            else this.steering = 0
        }

        if (!this.left && this.right) {
            this.steering += this.deltaSteer
            if (this.steering > this.MAX_STEERING) this.steering = this.MAX_STEERING

        }

        this.position.set(this.position.x + this.velocity * Math.cos(this.direction), this.position.y , this.position.z + this.velocity * Math.sin(this.direction));
        
        
        this.rotation.y = -this.direction

        this.updateWheelDirection()


    }

}

MyCar.prototype.isGroup = true;

export { MyCar};
