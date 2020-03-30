class BoatClone extends Boat {
  constructor(source) {
    super(source.game, source.color, source.tile, source.type);
    this.source = source;
    this.actions = [];
  }

  getFirstClone() {
    if (this.source.constructor === Boat) {
      return this;
    }

    return this.source.getFirstClone();
  }

  speedUp() {
    this.actions.push("faster");
    super.speedUp();
  }

  slowDown() {
    this.actions.push("slower");
    super.slowDown();
  }

  turnLeft() {
    this.actions.push("left");
    super.turnLeft();
  }

  turnRight() {
    this.actions.push("right");
    super.turnRight();
  }

  goStraight() {
    this.actions.push("go");
    super.goStraight();
  }
}
