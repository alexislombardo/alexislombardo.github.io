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
        name: "Welcome to Hawkins",
        number: 1,
        speed: -3,
        gameItems: [
          { type: "obstacle", x: 400, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60, velocity: 1.25, scale: 1.0},
          { type: "obstacle", x: 840, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60 , velocity: 1.25, scale: 1.0},
          { type: "obstacle", x: 1200, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60, velocity: 1.25, scale: 1.0},
        
          { type: "enemy", x: 500, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          { type: "enemy", x: 700, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          { type: "enemy", x: 1000, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          
         
          { type: "reward", x: 1500, y: groundY - 110, hZSize: 20, image:"img/eggos2.png", offsetX: -30, offsetY: -20, velocity: 1.25, scale:0.25, scoreChange: 150},
          
          { type: "levelMarker", x: 2000, y: groundY - 110, hZSize: 40, image:"img/logoST.png", offsetX: -50, offsetY: -40, velocity: 1.25, scale:0.075},
          
        ],
      },
      {
        name: "End",
        number: 2,
        speed: -3,
        gameItems: [
          { type: "obstacle", x: 400, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60, velocity: 1.25, scale: 1.0},
          { type: "obstacle", x: 840, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60 , velocity: 1.25, scale: 1.0},
          { type: "obstacle", x: 1200, y: groundY - 120, hZSize: 35,damage:-5, image:"img/demobats.png", offsetX: -60, offsetY: -60, velocity: 1.25, scale: 1.0},
        
          { type: "enemy", x: 500, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          { type: "enemy", x: 700, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          { type: "enemy", x: 1000, y: groundY - 70, hZSize: 35,damage:-25, image:"img/demogorgonNew.png", offsetX: -200, offsetY: -150, velocity: 1.25, scale: 1.0, scoreChange: 50},
          
         
          { type: "reward", x: 1500, y: groundY - 110, hZSize: 20, image:"img/eggos2.png", offsetX: -30, offsetY: -20, velocity: 1.25, scale:0.25, scoreChange: 150},
          
          { type: "levelMarker", x: 2000, y: groundY - 110, hZSize: 40, image:"img/logoST.png", offsetX: -50, offsetY: -40, velocity: 1.25, scale:0.075},
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
