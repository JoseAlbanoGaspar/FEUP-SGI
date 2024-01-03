import * as THREE from 'three';

class MySkyBox extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';

        const width = 500
        const height = 500
        const depth = 500
        const textureLoader = new THREE.TextureLoader()

        //back plane
        const geometry = new THREE.PlaneGeometry( width, height )
        const materialObject = new THREE.MeshBasicMaterial({
            emissive: 1 })

        const textureMaterial = textureLoader.load('textures/panorama4.jpg')
        materialObject.map = textureMaterial
        
        const back_plane = new THREE.Mesh(geometry, materialObject)

        back_plane.position.set(0, 0, -depth/2)

        //front plane
        const geometry1 = new THREE.PlaneGeometry( width, height )
        const materialObject1 = new THREE.MeshBasicMaterial({ 
            emissive: 1})
        materialObject1.map = textureMaterial
        
        const front_plane = new THREE.Mesh(geometry1, materialObject1)
        front_plane.rotation.y = Math.PI
        front_plane.position.set(0, 0, depth/2)

        //left plane
        const geometry2 = new THREE.PlaneGeometry( depth, height )
        const materialObject2 = new THREE.MeshBasicMaterial({ 
            emissive: 1})

        materialObject2.map = textureMaterial
        
        const left_plane = new THREE.Mesh(geometry2, materialObject2)
        left_plane.rotation.y = Math.PI /2
        left_plane.position.set(-depth/2, 0, 0)

        //right plane
        const geometry3 = new THREE.PlaneGeometry( depth, height )

        const materialObject3 = new THREE.MeshBasicMaterial({
            emissive: 1})
        materialObject3.map = textureMaterial
        const right_plane = new THREE.Mesh(geometry3, materialObject3)
        right_plane.rotation.y = 3*Math.PI /2
        right_plane.position.set(depth/2, 0, 0)

        //top plane
        const geometry4 = new THREE.PlaneGeometry( width, depth )

        const materialObject4 = new THREE.MeshBasicMaterial({ 
            emissive: 1})
        
        const textureMaterialTop = textureLoader.load('textures/sky.jpg')
        materialObject4.map = textureMaterialTop
        
        const top_plane = new THREE.Mesh(geometry4, materialObject4)
        top_plane.rotation.x = Math.PI/2
        top_plane.position.set(0, height/2, 0)

        //bottom plane
        const geometry5 = new THREE.PlaneGeometry( width, depth )

        const materialObject5 = new THREE.MeshBasicMaterial({color: 0xffffff, 
            emissive: 1})
        const textureMaterialBottom = textureLoader.load('textures/grass.jpg')
        textureMaterialBottom.wrapS = THREE.RepeatWrapping;
        textureMaterialBottom.wrapT = THREE.RepeatWrapping;
        textureMaterialBottom.repeat.set(16, 16);

        materialObject5.map = textureMaterialBottom
 
        const bottom_plane = new THREE.Mesh(geometry5, materialObject5)
        bottom_plane.rotation.x = 3*Math.PI/2
        bottom_plane.position.set(0, -height/2, 0)

        this.add(back_plane)
        this.add(front_plane)
        this.add(left_plane)
        this.add(right_plane)
        this.add(top_plane)
        this.add(bottom_plane)

    

    }
}

MySkyBox.prototype.isGroup = true;

export { MySkyBox };
