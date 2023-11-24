import * as THREE from 'three';

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
        this.position.set(x, 0, z)

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

        

        // car geometry
        // car body
        const materialObject = new THREE.MeshPhongMaterial({color: "#ff0000", specular: "#000000", 
            emissive: 1, shininess: 3})
        const geometry = new THREE.BoxGeometry(6, 3, 3, 1, 1, 1);
        const box = new THREE.Mesh(geometry, materialObject);
        box.receiveShadow = true;
        box.castShadow = true;

        //wheels
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "000000", emissive: 1, shininess: 3});

        const geometryWhell = new THREE.CylinderGeometry(1.25, 1.25, 0.5, 16, 16 )
        const wheel = new THREE.Mesh(geometryWhell, cylinderMaterial)
        wheel.receiveShadow = true;
        wheel.castShadow = true;
        const wheel2 = wheel.clone()
        const wheel3 = wheel.clone()
        const wheel4 = wheel.clone()

        //axis
        const axisMaterial = new THREE.MeshPhongMaterial({ color: "#00ff00", specular: "000000", emissive: 1, shininess: 3});

        const geometryAxis = new THREE.CylinderGeometry(0.1,0.1, 4.5, 16, 16 )
        const axis = new THREE.Mesh(geometryAxis, axisMaterial)
        axis.receiveShadow = true;
        axis.castShadow = true;
        const axis2 = axis.clone()
        
        // transformations
        wheel.position.set(0, -2.25, 0)
        wheel2.position.set(0, 2.25, 0)

        this.frontWheels = new THREE.Group()
        this.frontWheels.add(wheel)
        this.frontWheels.add(wheel2)
        this.frontWheels.add(axis)

        this.frontWheels.rotation.x = Math.PI / 2
        this.frontWheels.position.set(2, -0.75, 0)

        wheel3.position.set(0, -2.25, 0)
        wheel4.position.set(0, 2.25, 0)

        this.backWheels = new THREE.Group()
        this.backWheels.add(wheel3)
        this.backWheels.add(wheel4)
        this.backWheels.add(axis2)

        this.backWheels.rotation.x = Math.PI / 2
        this.backWheels.position.set(-2, -0.75, 0)


        this.add(box)
        this.add(this.frontWheels)
        this.add(this.backWheels)
        this.add(this.backWheels)


        
        
        // add event listeners
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
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
            this.direction += this.steering / 10  * this.velocity
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

        this.frontWheels.rotation.z = this.steering
        


    }

}

MyCar.prototype.isGroup = true;

export { MyCar};
