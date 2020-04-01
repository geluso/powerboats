const Point = require('./point');
const Corner = require('./corner');
const Edge = require('./edge');

function Hexagon(x, y, size) {
  var SIDES = 6;

  this.x = x;
  this.y = y;

  this.size = size;

  this.strokeShape = function (ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.moveTo(this.size, 0);

    for (var i = 0; i < SIDES; i++) {
      ctx.rotate(2 * Math.PI / SIDES);
      ctx.lineTo(this.size, 0);
    }
  };

  this.fill = function (ctx, color) {
    color = color || "black";

    ctx.save();

    this.strokeShape(ctx);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  };

  this.stroke = function (ctx, color) {
    color = color || "black";

    ctx.save();

    this.strokeShape(ctx);
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
  };

  this.fillStroke = function (ctx, fillColor, strokeColor) {
    ctx.save();

    this.strokeShape(ctx);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    ctx.restore();
  };
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Hexagon;
}