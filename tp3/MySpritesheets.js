import * as THREE from 'three';

class MySpriteSheets extends THREE.Object3D {

    constructor(app) {
        const textureLoader = new THREE.TextureLoader()
        const spritesheetsTex = textureLoader.load('textures/spritesheets.png')

        const cellWidth = 1/15
        const cellHeight = 1/8

        //material using a spritesheets
        const material = new THREE.SpriteMaterial({ map: spritesheetsTex })
        
        //sprite using the material
        const characterSprite = new THREE.Sprite(material)

        this.app.scene.add(characterSprite)
        
    }
}

export { MySpriteSheets }