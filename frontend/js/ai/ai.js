function AI(game, color) {
  this.game = game;
  this.board = game.board;
  this.color = color;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = AI;
}