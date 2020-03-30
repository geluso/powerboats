Directions = {};
Directions.directionToAngle = {
  "north": 0,
  "north-east": 60,
  "south-east": 120,
  "south": 180,
  "south-west": 240,
  "north-west": 300,
};
Directions.possibleDirections = [
  "north", "north-east", "south-east",
  "south", "south-west", "north-west",
];

Directions.randomDirection = function () {
  var range = Directions.possibleDirections.length;
  var index = Math.floor(Math.random() * range);
  return Directions.possibleDirections[index];
}

Directions.clockwiseNext = {
  "north-west": "north",
  "north": "north-east",
  "north-east": "south-east",
  "south-east": "south",
  "south": "south-west",
  "south-west": "north-west"
};

Directions.counterClockwiseNext = {
  "north": "north-west",
  "north-west": "south-west",
  "south-west": "south",
  "south": "south-east",
  "south-east": "north-east",
  "north-east": "north"
};

if (!!module) {
  module.exports = Directions;
}