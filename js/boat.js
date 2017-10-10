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
    this.direction = DIRECTIONS[this.directionIndex];
  }

  turnRight() {
    this.directionIndex++;
    this.direction = DIRECTIONS[this.directionIndex];
  }

  goStraight() {

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
