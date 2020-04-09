const Boat = require('../frontend/js/boat');

const boat = new Boat();
console.log(boat.dice);

boat.rollDice(3);
console.log(boat.dice);

console.log(boat.toJSON());