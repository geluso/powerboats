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

var Resources = {
  WATER, LAND, START_RED, START_BLACK, START_WHITE, HOVERED
};

if (typeof module !== "undefined" && !!module) {
  module.exports = Resources;
}