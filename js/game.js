var OFF_CENTER_INDEX = 0;
var CAN_ADJUST_SPEED = false;

class Game {
  constructor(board) {
    this.board = board;
    board.game = this;
  }

  draw() {
    this.board.draw();
  }
}

