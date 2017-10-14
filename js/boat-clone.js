class BoatClone extends Boat {
  constructor(game, color, tile, type) {
    super(game, color, tile, type);
    this.actions = [];
  }

  speedUp() {
    console.log("clone speed up");
    super.speedUp();
  }
}
