function Buoy(turnNumber, tile) {
  this.turnNumber = turnNumber;
  this.tile = tile;
  this.buoyDetector = new BuoyDetector(this);
}

