var runLevels = function (window) {
  window.opspark = window.opspark || {};

  var draw = window.opspark.draw;
  var createjs = window.createjs;
  let currentLevel = 0;

  window.opspark.runLevelInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game
    var levelData = window.opspark.levelData;

    // set this to true or false depending on if you want to see hitzones
    game.setDebugMode(true);

    // TODOs 5 through 11 go here
    // BEGIN EDITING YOUR CODE HERE
    function createObstacle(x, y, damage){
      var hitZoneSize = 25;
      var damageFromObstacle = damage;
      var obstacleHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
      obstacleHitZone.x = x;
      obstacleHitZone.y = y;
      game.addGameItem(obstacleHitZone);
      var obstacleImage = draw.bitmap("img/demobats.png");
      obstacleHitZone.addChild(obstacleImage);
      obstacleImage.x = -10;
      obstacleImage.y = -10;

    }



    function createEnemy(x, y){
      var enemy = game.createGameItem("enemy", 25); // creates the enemy and the hit zone 
      var enemyImage = draw.bitmap(50, 50, "red"); // creates the image of the enemy and stores it to the variable enemyImage
      enemyImage.x = -25; // x offset for the image's hitzone
      enemyImage.y = -25; // y offset for the image's hitzone
      enemy.addChild(enemyImage); // attaches the image to the enemy object
      enemy.x = x; // setting the enemy's x poistion
      enemy.y = y; // setting the enemy's y poistion
      game.addGameItem(enemy); // adds the enemy to the game

      enemy.velocityX -= 3; // animating the enemy across the screen 

      // handles when halle collides w/enemy
      enemy.onPlayerCollision = function(){
      game.changeIntegrity(-10); // reduces player health
    };

    // handles when halle shoots the enemy
     enemy.onProjectileCollision = function(){
      game.increaseScore(100); // increases the player's score
      // enemy.flyTo();
      // enemy.shrink();
      enemy.fadeOut(); // after collision the enemy fades out 
    };
    }
    createEnemy(700, groundY - 50);
    createEnemy(800, groundY -50);

    function createReward(x, y){
      var reward= game.createGameItem("reward", 25); // creates the reward and the hit zone 
      var rewardImage = draw.rect(50, 50, "purple"); // creates the image of the reward and stores it to the variable rewardImage
      rewardImage.x = -25; // x offset for the image's hitzone
      rewardImage.y = -25; // y offset for the image's hitzone
      reward.addChild(rewardImage); // attaches the image to the reward object
      reward.x = x; // setting the reward's x poistion
      reward.y = y; // setting the reward's y poistion
      game.addGameItem(reward); // adds the reward to the game

      reward.velocityX -= 1.25; // animating the reward across the screen 

      // handles when halle collides w/reward
      reward.onPlayerCollision = function(){
        game.increaseScore(100); // increases the player's score
        reward.fadeOut();
    
      };
    }


     createReward(700, groundY - 100);

    function createLevelMarker(x, y){
      var levelMarker= game.createGameItem("level", 25); // creates the level and the hit zone 
      var levelImage = draw.rect(50, 50, "yellow"); // creates the image of the level and stores it to the variable rewardImage
      levelImage.x = -25; // x offset for the image's hitzone
      levelImage.y = -25; // y offset for the image's hitzone
      levelMarker.addChild(levelImage); // attaches the image to the level object
      levelMarker.x = x; // setting the level's x poistion
      levelMarker.y = y; // setting the level's y poistion
      game.addGameItem(levelMarker); // adds the level to the game

      levelMarker.velocityX -= 1.25; // animating the level across the screen 

      // handles when halle collides w/ levelMarker
      levelMarker.onPlayerCollision = function(){
       game.changeIntegrity(300); // reduces player health
       levelMarker.fadeOut();
       startLevel();
      };
    }

    createLevelMarker(850, groundY - 90);

    function startLevel() {
      // TODO 13 goes below here
      var level = levelData[currentLevel]; // fetches the level from the level data array and stores it inside the level variable
      var levelObjects = level.gameItems; // retrieves the array of game items and stores it in the level objects variable

      for(var i = 0; i < levelObjects.length; i++){
        var element = levelObjects[i];

        if(element.type === "obstacle"){
          createObstacle(element.x, element.y, element.damage);
        }
     
      }


      //////////////////////////////////////////////
      // DO NOT EDIT CODE BELOW HERE
      //////////////////////////////////////////////
      if (++currentLevel === levelData.length) {
        startLevel = () => {
          console.log("Congratulations!");
        };
      }
    }
    startLevel();
  };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = runLevels;
}
