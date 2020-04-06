const Point = require('../geo/point');

class BuoyTrackerDrawer {
  static draw(tracker, ctx, tilespace, boatColor) {
    if (!tracker.north) {
      tracker.initDirections(tilespace);
    }

    Point.draw(ctx, tracker.north, tracker.getDirectionStatus("north", boatColor));
    Point.draw(ctx, tracker.northWest, tracker.getDirectionStatus("north-west", boatColor));
    Point.draw(ctx, tracker.northEast, tracker.getDirectionStatus("north-east", boatColor));

    Point.draw(ctx, tracker.south, tracker.getDirectionStatus("south", boatColor));
    Point.draw(ctx, tracker.southWest, tracker.getDirectionStatus("south-west", boatColor));
    Point.draw(ctx, tracker.southEast, tracker.getDirectionStatus("south-east", boatColor));
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = BuoyTrackerDrawer;
}