import * as THREE from 'three';
class MyCake extends THREE.Object3D {

    constructor(app, radius, height, begin, end, rot1, rot2, z1, x2, z2) {
        super();
        this.app = app;
        this.type = 'Group';
        
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, begin, end);
        const material = new THREE.MeshPhongMaterial({ color: 0xffa500 });
        let cakeMesh = new THREE.Mesh(geometry, material);
        

        let plane = new THREE.PlaneGeometry( radius, height );
        let cover1 = new THREE.Mesh( plane, material );
        cover1.position.z = z1 
        cover1.rotation.y = rot1 
        
        let cover2 = new THREE.Mesh(plane, material)
        cover2.position.x = x2
        cover2.position.z = z2 
        cover2.rotation.y = rot2
        
        cakeMesh.add( cover1 )
        cakeMesh.add( cover2 )

        this.add(cakeMesh);
        this.add(cover1);
        this.add(cover2);

    }
}

MyCake.prototype.isGroup = true;

export { MyCake };