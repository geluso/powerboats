const GameDrawer = require('./drawers/game-drawer')

var MOUSE_X = 0;
var MOUSE_Y = 0;

var LAST_THING;

class Screen {
  constructor(width, height, game) {
    this.dirty = true;
    this.game = game;

    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    this.ctx = ctx;

    ctx.width = width;
    ctx.height = height;

    var gameDrawer = new GameDrawer(ctx, game);
    this.gameDrawer = gameDrawer;

    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleClick = this.handleClick.bind(this);

    $(document).mousemove(this.handleMousemove);
    $(document).click(this.handleClick);
  }

  handleMousemove(e) {
    MOUSE_X = e.clientX;
    MOUSE_Y = e.clientY;

    var thing = this.game.tilespace.getTile(MOUSE_X, MOUSE_Y);

    this.dirty = false;
    if (thing !== LAST_THING) {
      if (LAST_THING !== undefined) {
        LAST_THING.hovering = false;
        LAST_THING.isDirty = true;
      }
      this.dirty = true;

      thing.hovering = true;
      thing.isDirty = true;

      this.gameDrawer.draw();

      LAST_THING = thing;
    }
  };

  handleClick(e) {
    if (e.target.tagName === "BUTTON") {
      return;
    }

    MOUSE_X = e.clientX;
    MOUSE_Y = e.clientY;

    var thing = this.game.board.getTile(MOUSE_X, MOUSE_Y);
    if (thing === undefined) {
      return;
    }

    this.dirty = false;
    if (thing && LAST_THING && thing !== LAST_THING) {
      this.dirty = true;
      this.gameDrawer.draw();
    }
  };

  draw() {
    this.gameDrawer.draw();
  }

  destoryHandlers() {
    document.removeEventListener("mousemove", this.handleMousemove);
    document.removeEventListener("click", this.handleClick);
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Screen;
}