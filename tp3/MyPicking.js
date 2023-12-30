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
        this.raycaster.far = 100

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0xff0000"

        this.firstClick = false

        // define the objects ids that are not to be pickeable
        this.notPickableObjIds = []
      
        //register events

        document.addEventListener(
            //"pointermove",
            "pointerdown",
            this.onPointerMove.bind(this)
        );
    }

    addNotPickeableObject(obj) {
        this.notPickableObjIds.push(obj)
    }

    getNotPickeableObject(){
        return this.notPickableObjIds
    }

    getOriginalColor() {
        return this.originalColor
    }

    /*
    * Update the color of selected object
    *
    */
    updatePickingColor(value) {
        this.pickingColor = value.replace('#', '0x');
    }

    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            const position = intersects[0].point
            console.log(position)
            console.log("picked ", obj)
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else {
                
                switch (this.type) {
                    case "car":
                        this.originalColor = obj.material.color
                        this.changeColorOfFirstPickedObj(obj)
                        break;
                
                    case "obstacle":
                        if(this.first) {
                            this.first = false
                            this.changePositionObj(position)
                        }
        
                        else {
                            this.intersectedObj = obj
                            this.first = true
                            this.changeColorOfFirstPickedObj(obj)
                        }
                    default:
                        break;
                }
            
            }
                
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }

    changePositionObj(position) {
        this.intersectedObj.position.set(position.x, 2, position.z)
        this.intersectedObj = null
    }

    onPointerMove(event) {

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        
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
