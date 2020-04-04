const WATER = {
  name: "water",
  color: "CornflowerBlue"
};

const LAND = {
  name: "land",
  color: "green"
};

const START_RED = {
  name: "start",
  color: "red"
};

const START_WHITE = {
  name: "start",
  color: "white"
};

const START_BLACK = {
  name: "start",
  color: "black"
};

const HOVERED = {
  name: "hovered",
  color: "yellow"
};

const Resources = {
  WATER, LAND, START_RED, START_BLACK, START_WHITE, HOVERED
};

const ALL_RESOURCES = [
  WATER, LAND, START_RED, START_BLACK, START_WHITE, HOVERED
];

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