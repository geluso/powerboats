class Game {
  constructor(board) {
    this.board = board;
    board.game = this;

    // HACK: start it at -1 so it slips into zero by starting with ending a turn.
    this.currentPlayerIndex = -1;
    this.boats = [];

    var colors = CONFIG.COLORS;
    var index = 0;
    var currentTile = board.start;
    var types = CONFIG.PLAYER_TYPES;
    while (index < colors.length) {
      var type = types[index];
      var boat = new Boat(this, colors[index], currentTile, type);
      this.boats.push(boat);

      currentTile = space.nextTileInDirection(currentTile, board.startDirection);

      index++;
    }
  }

  draw() {
    this.board.draw();
  }

  getCurrentPlayer() {
    var player = this.boats[this.currentPlayerIndex];
    return player;
  }

  endTurn() {
    draw();

    var that = this;
    setTimeout(function() {
      that.delayedEndTurn();
    }, CONFIG.AI_TURN_DELAY);
  }

  delayedEndTurn() {
    this.currentPlayerIndex++;
    this.currentPlayerIndex %= this.boats.length;

    if (this.getCurrentPlayer().isAI()) {
      var strategyClass = TurnTowardBuoyFast;
      var ai = new AITurn(this, strategyClass);
      ai.initiateTurnStart();
    }

    this.getCurrentPlayer().highlightRoute();
    draw();
  }
}

