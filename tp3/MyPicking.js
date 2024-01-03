import * as THREE from "three";

/**
 *  This class contains the contents of out application
 */
class MyPicking {
    /**
         constructs the object
         @param {MyApp} app The application object
      */
    constructor(app, type) {
        this.app = app;
        this.type = type

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 200

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0xff0000"

        this.firstClick = false
        this.clicked = false
        this.pickedObs = false

        // define the objects ids that are and are not to be pickeable
        this.notPickableObjIds = []
        this.pickableObjIds = []
      
    }

    async pick(){
        return new Promise((resolve) => {
            const handler = (event) => {
                this.onPointerClick(event);
                if(!this.clicked) return;
                
                if(this.pickedObs) {
                    this.pickedObs = false
                    return
                }

                this.clicked = false;
                resolve();
            };
            document.addEventListener("pointerdown", handler);
        }).then(() => {})
    }

    addPickableObjects(obj){
        this.pickableObjIds.push(obj)
    }

    getPickeableObject(){
        return this.pickableObjIds
    }

    addNotPickableObject(obj) {
        this.notPickableObjIds.push(obj)
    }

    getOriginalColor() {
        return this.originalColor
    }

    getIntersectedObject() {
        return this.intersectedObjName
    }

    /*
    * Change the size of the intersected object
    *
    */
    changeObjSize(obj) {
        this.lastPickedObj = obj
        this.lastPickedObj.scale.set(1.5, 1.5, 1.5)
    }

    /*
    * Restore the original size of the intersected object
    *
    */
    restoreSize() {
        if(this.lastPickedObj)
            this.lastPickedObj.scale.set(1, 1, 1)
        this.lastPickedObj = null    
    }
    
    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        this.restoreSize()
        if (intersects.length > 0) {
            
            const obj = intersects[0].object
            const position = intersects[0].point
            
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else {
                
                switch (this.type) {

                    case "button":
                        this.changeObjSize(obj)
                        this.intersectedObjName = obj
                        this.clicked = true
                        break;

                    case "car":
                        this.originalColor = obj.material.color
                        this.clicked = true
                        break;
                
                    case "obstacle":
                        if(this.firstClick) {
                            this.firstClick = false
                            this.changePositionObj(position)
                            this.clicked = true
                            this.pickedObs = true
                        }
        
                        else {
                            this.intersectedObj = obj
                            this.firstClick = true
                            this.changeObjSize(obj)
                            this.addPickableObjects(this.app.contents.track)
                        }
                        break;
                    default:
                        break;
                }
                
            }
                
        }
    }

    /**
     * Changes the position of the object based on the new position deteted
     */
    changePositionObj(position) {
        this.intersectedObj.position.set(position.x, 2, position.z)
        this.app.contents.obstacles.push(this.intersectedObj)
        this.intersectedObj = null
    }

    /**
     * Handle click event
     */
    onPointerClick(event) {

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        var intersects = this.raycaster.intersectObjects(this.pickableObjIds);
        
        this.pickingHelper(intersects)

    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
    }
}

export { MyPicking };
