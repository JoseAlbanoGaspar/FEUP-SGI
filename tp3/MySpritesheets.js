import * as THREE from 'three';

class MySpriteSheets extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app

        this.tileHoriz = 14;
        this.tileVert = 8;

        this.characters = new Map()
        this.wordsInScene = new Map()

        this.numbersInScene = new Map()

        this.storeNumbers()
        this.storeLetters()

    }

    /**
     * Stores in the map the index of the numbers in the spritesheets used
     */
    storeNumbers() {
        this.characters.set("0", [14.9])
        this.characters.set("1", [15.9])
        this.characters.set("2", [16.8])
        this.characters.set("3", [17.8])
        this.characters.set("4", [18.7])
        this.characters.set("5", [19.6])
        this.characters.set("6", [20.6])
        this.characters.set("7", [21.5])
        this.characters.set("8", [22.4])
        this.characters.set("9", [23.5])
    }

    /**
     * Stores in the map the index of the numbers in the spritesheets used
     */
    storeLetters() {
        this.characters.set(" ", [0])
        this.characters.set("a", [30.8])
        this.characters.set("b", [31.8])
        this.characters.set("c", [32.7])
        this.characters.set("d", [33.5])
        this.characters.set("e", [34.5])
        this.characters.set("f", [35.5])
        this.characters.set("g", [36.4])
        this.characters.set("h", [37.4])
        this.characters.set("i", [38.3])
        this.characters.set("j", [39.2])
        this.characters.set("k", [40.1])
        this.characters.set("l", [41.1])
        this.characters.set("m", [42])
        this.characters.set("n", [43])
        this.characters.set("o", [43.9])
        this.characters.set("p", [44.8])
        this.characters.set("q", [45.8])
        this.characters.set("r", [46.7])
        this.characters.set("s", [47.6])
        this.characters.set("t", [48.5])
        this.characters.set("u", [79.4])
        this.characters.set("v", [80.3])
        this.characters.set("w", [81.2])
        this.characters.set("x", [82.2])
        this.characters.set("y", [83.1]) 
        this.characters.set("z", [84.1])
        this.characters.set("é", [91.5])
        this.characters.set("ê", [97.1])
    }

    /**
     * From the given index returns the character that corresponds in the spritesheets
     */
    drawCharacter(currentTile) {

        const textureLoader = new THREE.TextureLoader()
        this.spritesheetsTex = textureLoader.load('textures/spritesheets.png')
        this.spritesheetsTex.repeat.set(1/this.tileHoriz, 1/this.tileVert)
        this.spritesheetsTex.magFilter = THREE.NearestFilter
        
        const offsetX = (currentTile % this.tileHoriz) / this.tileHoriz
        const offsetY = (this.tileVert - Math.floor(currentTile/this.tileHoriz) - 1) / this.tileVert

        this.spritesheetsTex.offset.set(offsetX, offsetY)
        const material = new THREE.SpriteMaterial({ map: this.spritesheetsTex })
        
        const characterSprite = new THREE.Sprite(material)
        characterSprite.scale.set(10, 10, 10)

        return characterSprite
    }

    /**
     * Creates a word that will be displayed from the indicated coordinates
     * Stores this word in another map, where the key in the word given and the value the sprites that compose the word
     */
    createWord(word, x, y, z, isHoriz) {
        const spgroup = new THREE.Group()
        let w = word.split('')
        for (let i = 0; i < w.length; i++){
            let num = this.characters.get(w[i])
            let temp = this.drawCharacter(num)
            temp.position.set(x, y, z)
            spgroup.add(temp)
            //this.app.scene.add(temp)
            if(isHoriz) z = z-8
            else x = x+8
        }

        this.wordsInScene.set(word, spgroup)
        return spgroup
    }

    /**
     * Creates a number that will be displayed from the indicated coordinates
     * Stores this number in another map, where the key in the key given and the value the sprites that compose the number
     */
    createNumbers(number, x, y, z, key) {
        const spgroup = new THREE.Group()
        let stringNumber = number.toString().split('')
        
        for (let i = 0; i < stringNumber.length; i++){
            let num = this.characters.get(stringNumber[i])
            let temp = this.drawCharacter(num)
            temp.position.set(x, y, z)
            spgroup.add(temp)
            spgroup.name = number.toString()
            z = z-8
        }

        this.numbersInScene.set(key, spgroup)
        return spgroup
    }

    /**
     * Removes a word from the scene
     */
    removeSprite(word) {
        let sp = this.wordsInScene.get(word)
        this.app.scene.remove(sp)
    }

    /**
     * Removes a number from the scene
     */
    removeNumber(key) {
        let sp = this.numbersInScene.get(key)
        this.app.scene.remove(sp)
    }

}

export { MySpriteSheets }