function AI(game, color) {
  this.game = game;
  this.board = game.board;
  this.color = color;
}

if (!!module) {
  module.exports = AI;
}