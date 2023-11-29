class MyRace {
    constructor(app, playerCar, opponentCar, track) {
        this.app = app;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.track = track;
        this.initialized = false;

        this.init()
        this.display();
    }

    async init() {
        await this.track.load(); // Wait for image processing to finish
        this.playerCar.setTrackPixels(this.track.getTrackPixels());
        this.playerCar.setTrackSize(this.track.getSizeTrack());
        this.initialized = true; 
    }

    display() {
        this.app.scene.add(this.track);
        this.app.scene.add(this.playerCar);
        this.app.scene.add(this.opponentCar);
    }

    update() {
        if (this.initialized) {
            this.playerCar.update(Date.now())
        }
    }
}


export { MyRace };
