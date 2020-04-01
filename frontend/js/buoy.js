function Buoy(turnNumber, tile) {
  this.turnNumber = turnNumber;
  this.tile = tile;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Buoy;
}