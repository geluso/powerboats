DIRECTIONS = ["north", "north-east", "south-east", "south", "south-west", "north-west"];

class Boat {
  constructor(color, tile) {
    this.color = color;
    this.tile = tile;
    this.directionIndex = 0;
    this.direction = Directions.randomDirection();
  }

  turnLeft() {
    this.directionIndex--;
    this.direction = DIRECTIONS[this.directionIndex];
  }

  turnRight() {
    this.directionIndex++;
    this.direction = DIRECTIONS[this.directionIndex];
  }
}
