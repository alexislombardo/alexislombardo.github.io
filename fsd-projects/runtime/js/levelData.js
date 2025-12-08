var makeLevelData = function (window) {
  window.opspark = window.opspark || {};

  window.opspark.makeDataInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game

    // TODO 12: change the below data
    var levelData = [
      {
        name: "Robot Romp",
        number: 1,
        speed: -3,
        gameItems: [
          { type: "obstacle", x: 400, y: groundY - 110, damage:5 },
          { type: "obstacle", x: 600, y: groundY - 105, damage:10 },
          { type: "obstacle", x: 900, y: groundY - 110, damage:15 },
          { type: "enemy", x: 400, y: groundY - 110, damage:5 },
          { type: "enemy", x: 600, y: groundY - 105, damage:10 },
          { type: "enemy", x: 900, y: groundY - 110, damage:15 },
        ],
      },
      {
        name: "Robot Rampage",
        number: 2,
        speed: -3,
        gameItems: [
          { type: "obstacle", x: 700, y: groundY - 105, damage:10},
          { type: "obstacle", x: 800, y: groundY - 105, damage:15},
          { type: "obstacle", x: 950, y: groundY - 105, damage:25},
        ],
      },
    ];
    window.opspark.levelData = levelData;
  };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = makeLevelData;
}
