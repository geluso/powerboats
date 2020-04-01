var LOG_RESOURCES = false;
var ROBBER_LIMIT = 7;

var BRICK = {
  name: "brick",
  color: "Brown"
};

var WHEAT = {
  name: "wheat",
  color: "Gold"
};

var WOOD = {
  name: "wood",
  color: "DarkOliveGreen"
};

var SHEEP = {
  name: "sheep",
  color: "GreenYellow"
};

var ORE = {
  name: "ore",
  color: "Gray"
};

var DESERT = {
  name: "desert",
  color: "Khaki"
};

var WATER = {
  name: "water",
  color: "CornflowerBlue"
};

var LAND = {
  name: "land",
  color: "green"
};

var START_RED = {
  name: "start",
  color: "red"
};

var START_WHITE = {
  name: "start",
  color: "white"
};

var START_BLACK = {
  name: "start",
  color: "black"
};

var HOVERED = {
  name: "hovered",
  color: "yellow"
};

var ALL_RESOURCES = [BRICK, WHEAT, WOOD, SHEEP, ORE];
var Resources = {
  WATER, LAND, START_RED, START_BLACK, START_WHITE, HOVERED
};

Resources.resourceFromString = function (name) {
  for (var i = 0; i < ALL_RESOURCES.length; i++) {
    if (ALL_RESOURCES[i].name === name) {
      return ALL_RESOURCES[i];
    }
  }
};

if (typeof module !== "undefined" && !!module) {
  module.exports = Resources;
}