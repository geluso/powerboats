var OFF_CENTER_INDEX = 0;
var CAN_ADJUST_SPEED = false;

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
    if (this.getCurrentPlayer()) {
      this.getCurrentPlayer().unhighlightRoute();
    }
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
      var strategyClass = CONFIG.ALL_AI_STRATEGY;
      var ai = new AITurn(this, strategyClass);
      ai.initiateTurnStart();
    } else {
      this.resetRestrictions();
      this.pollForMove();
    }

    this.getCurrentPlayer().highlightRoute();
    draw();
  }

  explore() {
    var length = this.boats.length
    for (var i = 0; i < length; i++) {
      this.boats[i].planner.explore();
    }
  }

  replaceCurrentBoat(newBoat) {
    var oldBoat = this.getCurrentPlayer();
    oldBoat.tile.isDirty = true;
    oldBoat.tile.hovering = false;

    this.boats[this.currentPlayerIndex] = newBoat;
    draw();
  }

  resetRestrictions() {
    OFF_CENTER_INDEX = 0;
    CAN_ADJUST_SPEED = true;
  }

  pollForMove() {
    var url = "http://localhost:8080/command";
    fetch(url).then(function(response) {
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
    })
    .then((json) => this.handleJson(json) )
    .catch(function(error) { console.log(error); });
  }


  handleJson(command) {
      this.applyCommand(command);

      // make sure a local player hasn't submitted a turn.
      var isTurnFinished = command.isCommitted;
      if (!this.getCurrentPlayer().isAI() && !isTurnFinished) {
          setTimeout(() => {
              this.pollForMove();
          }, 1000);
      } else {
        var url = "http://localhost:8080/command/reset";
        fetch(url);
      }
  }

  applyCommand(command) {
    var player = this.getCurrentPlayer();

    if (command.isLeft) {
        CONTROLS.setLeft()
    } else if (command.isRight) {
        CONTROLS.setRight()
    } else if (command.isStraight) {
        CONTROLS.setCenter()
    }

    if (command.isSpeedFaster) {
        CONTROLS.speedUp();
    } else if (command.isSpeedSlower) {
        CONTROLS.slowDown();
    }

    if (command.isCommitted) {
        // finalize turn after making turn and speed manipulations
        CONTROLS.goStraight();
    }

    draw();
  }
}

