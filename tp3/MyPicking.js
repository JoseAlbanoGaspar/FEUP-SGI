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
        this.clicked = false

        // define the objects ids that are not to be pickeable
        this.notPickableObjIds = []
        this.pickableObjIds = []
      
    }

    async pick(){
        return new Promise((resolve) => {
            const handler = (event) => {
                this.onPointerClick(event);
                if(!this.clicked) return;
                //teve que se tirar porque senão a cor não mudava
                //document.removeEventListener("pointerdown", handler);
                this.clicked = false;
                resolve();
            };
            document.addEventListener("pointerdown", handler);
        }).then(() => {

        }
        )
    }

    addNotPickeableObject(obj) {
        this.notPickableObjIds.push(obj)
    }

    addPickableObjects(obj){
        this.pickableObjIds.push(obj)
    }

    getNotPickeableObject(){
        return this.notPickableObjIds
    }

    getOriginalColor() {
        return this.originalColor
    }

    getIntersectedObject() {
        return this.intersectedObjName
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
                this.lastPickedObj.material.color = this.lastPickedObj.currentHex;
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
        this.restoreColorOfFirstPickedObj()
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
                        this.changeColorOfFirstPickedObj(obj)
                        this.intersectedObjName = obj
                        this.clicked = true
                        break;

                    case "car":
                        this.originalColor = obj.material.color
                        //this.changeColorOfFirstPickedObj(obj)
                        this.clicked = true
                        break;
                
                    case "obstacle":
                        if(this.firstClick) {
                            this.firstClick = false
                            this.changePositionObj(position)
                            this.clicked = true
                        }
        
                        else {
                            this.intersectedObj = obj
                            this.firstClick = true
                            this.changeColorOfFirstPickedObj(obj)
                        }
                        break;
                    default:
                        break;
                }
                
            }
                
        }
    }

    changePositionObj(position) {
        this.intersectedObj.position.set(position.x, 2, position.z)
        this.app.contents.obstacles.push(this.intersectedObj)
        this.intersectedObj = null
    }

    onPointerClick(event) {

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //this.app.scene.children
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
