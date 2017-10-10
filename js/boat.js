DIRECTIONS = ["north", "north-east", "south-east", "south", "south-west", "north-west"];

class Boat {
  constructor(color, tile) {
    this.color = color;
    this.tile = tile;
    this.directionIndex = 0;
    this.direction = Directions.randomDirection();

    this.dice = [];
  }

  speed() {
    var total = this.dice.reduce(function(d1, d2) {
      return d1 + d2.value;
    }, 0);
    return total;
  }

  turnLeft() {
    this.directionIndex--;
    if (this.directionIndex === -1) {
      this.directionIndex = DIRECTIONS.length - 1;
    }
    this.direction = DIRECTIONS[this.directionIndex];
    this.tile.isDirty = true;
    draw();
  }

  turnRight() {
    this.directionIndex++;
    this.directionIndex %= DIRECTIONS.length;
    this.direction = DIRECTIONS[this.directionIndex];
    this.tile.isDirty = true;
    draw();
  }

  goStraight() {
    var speed = this.speed();
    var direction = this.direction;

    console.log(speed, direction);

    var n = 0;
    var current = this.tile;
    while (n < speed) {
      current = space.nextTileInDirection(current, direction);
      n++;
    }

    this.tile = current;
    this.tile.isDirty = true;
    draw();
  }

  speedUp() {
    this.rollInNewDice();
  }

  slowDown() {
    this.dice.pop();
  }

  rollInNewDice() {
    var dice = new Dice();
    this.dice.push(dice);
  }

  removeDice(index) {
    this.dice.remove(index);
  }

  rerollDice(index) {
    this.dice[index].reroll();
  }
}
