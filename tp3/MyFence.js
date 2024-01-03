import * as THREE from 'three';

class MyFence extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';

        const geometry = new THREE.BoxGeometry(200, 2.5, 2.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: new THREE.TextureLoader().load('textures/fence.jpg')});
        const cube = new THREE.Mesh(geometry, material);

        const cube2 = cube.clone()
        cube2.position.set(0, 5, 0)

        const geometry1 = new THREE.BoxGeometry(2.5, 20, 2.5);
        const post = new THREE.Mesh(geometry1, material);

        const post1 = post.clone()
        post1.position.set(50, 0, 0)

        const post2 = post.clone()
        post2.position.set(-50, 0, 0)

        const post3 = post.clone()
        post3.position.set(100, 0, 0)

        const post4 = post.clone()
        post4.position.set(-100, 0, 0)

        this.add(cube)
        this.add(cube2)
        this.add(post)
        this.add(post1)
        this.add(post2)
        this.add(post3)
        this.add(post4)
    

    }
}

MyFence.prototype.isGroup = true;

export { MyFence };
