function AI(game, color) {
  this.game = game;
  this.board = game.board;
  this.color = color;

  GameLog("enters game.", color);
}
