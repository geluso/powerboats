const AIStrategies = require('./ai/ai-strategies')

var CONFIG = {
  REDRAW_DELAY: 300,
  DRAW_COORDS: false,
  DRAW_HOVER_COORDS: true,
  COORD_TEXT_SIZE: "8px",
  MIN_DICE: 1,
  MAX_DICE: 3,
  BOAT_MAX_DAMAGE: 5,
  USE_START_CONFIG: true,
  START_POSITION: "32,-30,-2",
  START_DIRECTION: "south-east",
  BOAT_START_DIRECTION: "south-west",
  USE_BUOY_ARRAY: true,
  BUOYS: [
    "39,-28,-11",
    "44,-43,-1",
    "16,-20,4",
  ],
  AI_TURN_DELAY: 1000,
  PLAYER_TYPES: ["local-human", "ai", "ai", "ai", "ai"],
  COLORS: ["yellow", "purple", "white", "blue", "orange"],
  //COLORS: ["yellow", "purple"],
  //PLAYER_TYPES: ["local-human", "ai"],
  //COLORS: ["yellow"],
  //PLAYER_TYPES: ["local-human"],
  ALL_AI_STRATEGY: AIStrategies.RoutePlanningStrategy,
};

if (typeof module !== "undefined" && !!module) {
  module.exports = CONFIG;
}