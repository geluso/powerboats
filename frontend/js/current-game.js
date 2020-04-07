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

  updateGame(json) {
    if (this.game === null) {
      this.game = Game.fromJSON(json.game);
      this.screen.gameDrawer.measure(this.game.tilespace);
    } else {
      this.game.updateFromJSON(json.game);
    }
    this.draw();
  }

  updatePlayer(json) {
    this.game.updatePlayer(json.player);
    this.draw();
  }

  draw() {
    const player = this.game.getCurrentPlayer();
    player.highlightRoute();

    this.screen.draw(this.game);
  }

  handleMouseMove(e) {
    if (this.game === null) return;

    this.screen.handleMousemove(e, this.game);
    this.draw();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = CurrentGame;
}