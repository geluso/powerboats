const Game = require('./game');
const Screen = require('./screen');

class CurrentGame {
  constructor() {
    // set up the screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.screen = new Screen(width, height);
    this.game = null;
  }

  setCurrentPlayer(color) {
    this.game.setCurrentPlayer(color);
  }

  update(json) {
    if (this.game === null) {
      this.game = Game.fromJSON(json.game);
      this.screen.gameDrawer.measure(this.game.tilespace);
    } else {
      this.game.updateFromJSON(json.game);
    }

    const player = this.game.getCurrentPlayer();
    player.tile.isDirty = true;
    player.highlightRoute();

    this.draw();
  }

  draw() {
    this.screen.draw(this.game);
  }

  handleMouseMove(e) {
    this.screen.handleMousemove(e, this.game);
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = CurrentGame;
}