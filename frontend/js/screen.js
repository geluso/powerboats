const BoardDrawer = require('./drawers/board-drawer')

var MOUSE_X = 0;
var MOUSE_Y = 0;

var LAST_THING;

function Screen(width, height, game) {
  this.dirty = true;
  this.game = game;

  var canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext("2d");
  this.ctx = ctx;

  ctx.width = width;
  ctx.height = height;

  var boardDrawer = new BoardDrawer(ctx, game);
  this.boardDrawer = boardDrawer;

  this.handleMousemove = this.handleMousemove.bind(this);
  this.handleClick = this.handleClick.bind(this);

  $(document).mousemove(this.handleMousemove);
  $(document).click(this.handleClick);
}

Screen.prototype.handleMousemove = function (e) {
  MOUSE_X = e.clientX;
  MOUSE_Y = e.clientY;

  var thing = this.game.board.getTile(MOUSE_X, MOUSE_Y);

  this.dirty = false;
  if (thing !== LAST_THING) {
    if (LAST_THING !== undefined) {
      LAST_THING.hovering = false;
      LAST_THING.isDirty = true;
    }
    this.dirty = true;

    thing.hovering = true;
    thing.isDirty = true;

    this.game.board.hovering = thing;
    this.boardDrawer.draw();

    LAST_THING = thing;
  }
};

Screen.prototype.handleClick = function (e) {
  if (e.target.tagName === "BUTTON") {
    return;
  }

  MOUSE_X = e.clientX;
  MOUSE_Y = e.clientY;

  var thing = this.game.board.getThing(MOUSE_X, MOUSE_Y);
  if (thing === undefined) {
    return;
  }

  this.dirty = false;
  if (thing && LAST_THING && thing !== LAST_THING) {
    this.dirty = true;
    this.boardDrawer.draw();
  }
};

Screen.prototype.draw = function () {
  this.boardDrawer.draw();
};

Screen.prototype.destoryHandlers = function () {
  document.removeEventListener("mousemove", this.handleMousemove);
  document.removeEventListener("click", this.handleClick);
};

if (typeof module !== "undefined" && !!module) {
  module.exports = Screen;
}