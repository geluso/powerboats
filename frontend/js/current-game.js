class CurrentGame {
  constructor(game, screen) {
    this.game = game;
    this.screen = screen;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = CurrentGame;
}