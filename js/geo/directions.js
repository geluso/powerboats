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

Directions.randomDirection = function() {
  var range = Directions.possibleDirections.length;
  var index = Math.floor(Math.random() * range);
  return Directions.possibleDirections[index];
}
