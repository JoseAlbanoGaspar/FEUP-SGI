import * as THREE from 'three';

class MySpriteSheets extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app

        this.tileHoriz = 14;
        this.tileVert = 8;

        this.characters = new Map()

        this.storeWordsMenus()
        this.storeWordsGame()
        this.storeWordsMenus()
        this.storeWordsFinal()
        this.storeNumbers()

    }

    storeWordsMenus() {
        let start = [47.5, 48.5, 30.8, 46.7, 48.5]
        this.characters.set("start", start)

        let state = [47.5, 48.5, 30.8, 48.5, 34.4]
        this.characters.set("state", state)

        let easy = [34.5, 30.8, 47.6, 83.1]
        this.characters.set("easy", easy)

        let medium = [42, 34.4, 33.5, 38.3, 79.4, 42]
        this.characters.set("medium", medium)

        let hard = [37.4, 30.8, 46.7, 33.5]
        this.characters.set("hard", hard)

    }

    storeWordsGame() {
        let pause = [44.8, 30.8, 79.4, 47.5, 34.4]
        this.characters.set("pause", pause)

        let play = [44.8, 41.1, 30.8, 83.1]
        this.characters.set("play", play)

        let time = [48.5, 38.3, 42, 34.4]
        this.characters.set("time", time)

        let p_round = [44.8, 0, 46.7, 43.9, 79.4, 43, 33.5]
        this.characters.set("p_round", p_round)

        let o_round = [43.9, 0, 46.7, 43.9, 79.4, 43, 33.5]
        this.characters.set("o_round", o_round)

        let max_velocity = [42, 30.8, 82.2, 0, 80.3, 34.6, 41.1, 43.9, 32.7, 38.3, 48.5, 83.1]
        this.characters.set("max_velocity", max_velocity)

        let min_velocity = [42, 38.3, 43, 0, 80.3, 34.6, 41.1, 43.9, 32.7, 38.3, 48.5, 83.1]
        this.characters.set("min_velocity", min_velocity)

    }

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

    storeWordsFinal() {
        let pink = [44.8, 38.3, 43, 40.1]
        this.characters.set("#ff00ff", pink)

        let red = [46.7, 34.5, 33.5]
        this.characters.set("#ff0000", red)

        let orange = [43.9, 46.7, 30.8, 43, 36.4, 34.5]
        this.characters.set("#ffa500", orange)

        let blue = [31.8, 41.1, 79.4, 34.5]
        this.characters.set("#0000ff", blue)

        let green = [36.4, 46.7, 34.5, 34.5, 43]
        this.characters.set("#006400", green)

        let purple = [44.8, 79.4, 46.7, 44.8, 41.1, 34.5]
        this.characters.set("#7600bc", purple)

        let winner = [81.2, 38.3, 43, 43, 34.6, 46.7]
        this.characters.set("winner", winner)

        let loser = [41.1, 43.9, 47.6, 34.5, 46.7]
        this.characters.set("loser", loser)

        let p_time = [44.8, 0, 48.5, 38.3, 42, 34.4]
        this.characters.set("p_time", p_time)

        let o_time = [43.9, 0, 48.5, 38.3, 42, 34.4]
        this.characters.set("o_time", o_time)

        let level = [41.1, 34.5, 80.2, 34.5, 41.1]
        this.characters.set("level", level)
    }

    drawCharacter(currentTile) {

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

        return characterSprite
    }

    createWord(word, x, y, z, isHoriz) {
        let w = this.characters.get(word)
        
        for(let i = 0; i < w.length; i++) {
            let temp = this.drawCharacter(w[i])
            temp.position.set(x, y, z)
            this.app.scene.add(temp)
            if(isHoriz) z = z-8
            else x = x+8
        }
    }

    createNumbers(number, x, y, z) {
        //For only one digit number
        let stringNumber = number.toString()
        let num = this.characters.get(stringNumber)
        let temp = this.drawCharacter(num[0])
        temp.position.set(x, y, z)
    
        this.app.scene.add(temp)

        //Falta fazer para qualquer numero
    }

}

export { MySpriteSheets }