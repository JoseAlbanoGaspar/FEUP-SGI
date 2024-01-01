import * as THREE from 'three';

class MySpriteSheets extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app

        this.tileHoriz = 14;
        this.tileVert = 8;

        this.characters = new Map()

        /////////////////// CREATE WORDS ///////////////////////////

        let start = [47.5, 48.5, 30.8, 46.7, 48.5]
        this.characters.set("start", start)
        let pause = [44.8, 30.8, 80.3, 47.5, 34.4]
        this.characters.set("pause", pause)

        let time = [48.5, 38.3, 42, 34.4]
        this.characters.set("time", time)

        let round = [46.7, 44, 80.3, 43, 33.5]
        this.characters.set("round", round)

        let state = [47.5, 48.5, 30.8, 48.5, 34.4]
        this.characters.set("state", state)

        let easy = [34.5, 30.8, 47.6, 83.1]
        this.characters.set("easy", easy)

        let medium = [42, 34.4, 33.5, 38.3, 80.3, 42]
        this.characters.set("medium", medium)

        let hard = [37.4, 30.8, 46.7, 33.5]
        this.characters.set("hard", hard)

        //return characterSprite
        
    }

    getCharacters(){
        return this.characters
    }

    drawCharacter(currentTile) {
        console.log("Sprite class", currentTile)

        const textureLoader = new THREE.TextureLoader()
        this.spritesheetsTex = textureLoader.load('textures/spritesheets.png')
        this.spritesheetsTex.repeat.set(1/this.tileHoriz, 1/this.tileVert)
        this.spritesheetsTex.magFilter = THREE.NearestFilter
        
        const offsetX = (currentTile % this.tileHoriz) / this.tileHoriz
        const offsetY = (this.tileVert - Math.floor(currentTile/this.tileHoriz) - 1) / this.tileVert

        this.spritesheetsTex.offset.set(offsetX, offsetY)
        //material using a spritesheets
        const material = new THREE.SpriteMaterial({ map: this.spritesheetsTex })
        
        //sprite using the material
        const characterSprite = new THREE.Sprite(material)
        
        characterSprite.scale.set(10, 10, 10)

        console.log(characterSprite)

        return characterSprite
    }

}

export { MySpriteSheets }