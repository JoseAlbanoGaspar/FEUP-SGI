import * as THREE from "three";

/**
 *  This class contains the contents of out application
 */
class MyPicking {
    /**
         constructs the object
         @param {MyApp} app The application object
      */
    constructor(app) {
        this.app = app;

        // box related attributes
        this.boxMesh = null;

        // plane related attributes
        this.diffusePlaneColor = "#00ffff";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 30;
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor,
            emissive: "#000000",
            shininess: this.planeShininess,
        });


        //picking: read documentation of THREE.Raycaster

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 100

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0xff0000"


        // define the objects ids that are not to be pickeable
        // NOTICE: not a ThreeJS facility
        this.notPickableObjIds = []
      
        //register events

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );
    }

    addNotPickeableObject(obj) {
        this.notPickableObjIds.push(obj)
    }

    getNotPickeableObject(){
        return this.notPickableObjIds
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
            console.log("picked ", obj)
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else
                this.changeColorOfFirstPickedObj(obj)
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }


    /**
     * Print to console information about the intersected objects
     */
    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            console.log(intersects[i]);

        }
    }


    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
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
