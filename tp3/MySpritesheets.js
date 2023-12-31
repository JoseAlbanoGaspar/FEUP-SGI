import * as THREE from 'three';

class MySpriteSheets extends THREE.Object3D {

    constructor(app, currentTile) {
        super()
        this.app = app

        const tileHoriz = 14;
        const tileVert = 8;

        const textureLoader = new THREE.TextureLoader()
        const spritesheetsTex = textureLoader.load('textures/spritesheets.png')
        spritesheetsTex.repeat.set(1/tileHoriz, 1/tileVert)
        spritesheetsTex.magFilter = THREE.NearestFilter

        const offsetX = (currentTile % tileHoriz) / tileHoriz
        const offsetY = (tileVert - Math.floor(currentTile/tileHoriz) - 1) / tileVert

        spritesheetsTex.offset.x = offsetX
        spritesheetsTex.offset.y = offsetY

        //material using a spritesheets
        const material = new THREE.SpriteMaterial({ map: spritesheetsTex })
        
        //sprite using the material
        const characterSprite = new THREE.Sprite(material)
        characterSprite.scale.set(10, 10, 10)
        return characterSprite
        
    }

}

export { MySpriteSheets }