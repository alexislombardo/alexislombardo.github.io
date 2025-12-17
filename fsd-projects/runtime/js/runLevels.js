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
    game.setDebugMode(false);

    // TODOs 5 through 11 go here
    // BEGIN EDITING YOUR CODE HERE
    function createObstacle(x, y, hZSize,damage, image, offsetX, offsetY, velocity, scale){  
    var obstacle = game.createGameItem("obstacle", hZSize); // creates the obstacle and the hit zone 
    var obstacleImage = draw.bitmap(image); // creates the image of the obstacle and stores it to the variable obstacleImage
    obstacleImage.x = offsetX;// x offset for the image's hitzone
    obstacleImage.y = offsetY; // y offset for the image's hitzone
    obstacle.addChild(obstacleImage);// attaches the image to the obstacle object
    obstacle.x = x; // setting the obstacle's x poistion
    obstacle.y =y;  // setting the obstacle's y poistion
    game.addGameItem(obstacle); // adds the obstacle to the game
 
    obstacle.velocityX -= velocity; // animating the obstacle across the screen 
    obstacleImage.scaleX = scale;
    obstacleImage.scaleY = scale;
      // handles when halle collides w/obstacle
    obstacle.onPlayerCollision = function(){
      game.changeIntegrity(damage); // reduces player health
    };
    }

    function createEnemy(x, y, hZSize,damage, image, offsetX, offsetY, velocity, scale, scoreChange){
      var enemy = game.createGameItem("enemy", hZSize); // creates the enemy and the hit zone 
      var enemyImage = draw.bitmap(image); // creates the image of the enemy and stores it to the variable enemyImage
      enemyImage.x = offsetX; // x offset for the image's hitzone
      enemyImage.y = offsetY; // y offset for the image's hitzone
      enemy.addChild(enemyImage); // attaches the image to the enemy object
      enemy.x = x; // setting the enemy's x poistion
      enemy.y = y; // setting the enemy's y poistion
      game.addGameItem(enemy); // adds the enemy to the game
 
      enemy.velocityX -= velocity; // animating the enemy across the screen 
      enemyImage.scaleX = scale;
      enemyImage.scaleY = scale;
      // handles when halle collides w/enemy
      enemy.onPlayerCollision = function(){
      game.changeIntegrity(damage); // reduces player health
    };

    // handles when halle shoots the enemy
     enemy.onProjectileCollision = function(){
      game.increaseScore(scoreChange); // increases the player's score
      // enemy.flyTo();
      // enemy.shrink();
      enemy.fadeOut(); // after collision the enemy fades out 
    };
    }
    

    function createReward(x, y, hZSize, image, offsetX, offsetY, velocity, scale, scoreChange){
      var reward= game.createGameItem("reward", hZSize); // creates the reward and the hit zone 
      var rewardImage = draw.bitmap(image); // creates the image of the reward and stores it to the variable rewardImage
      rewardImage.x = offsetX; // x offset for the image's hitzone
      rewardImage.y = offsetY; // y offset for the image's hitzone
      reward.addChild(rewardImage); // attaches the image to the reward object
      reward.x = x; // setting the reward's x poistion
      reward.y = y; // setting the reward's y poistion
      game.addGameItem(reward); // adds the reward to the game

      reward.velocityX -= velocity; // animating the reward across the screen 
      rewardImage.scaleX = scale;
      rewardImage.scaleY = scale;
      // handles when halle collides w/reward
      reward.onPlayerCollision = function(){
        game.increaseScore(scoreChange); // increases the player's score
        reward.fadeOut();
      };
    }
   
    function createLevelMarker(x, y,hZSize, image, offsetX, offsetY, velocity, scale ){
      var levelMarker= game.createGameItem("level", hZSize); // creates the level and the hit zone 
      var levelImage = draw.bitmap(image); // creates the image of the level and stores it to the variable rewardImage
      levelImage.x = offsetX; // x offset for the image's hitzone
      levelImage.y = offsetY; // y offset for the image's hitzone
      levelMarker.addChild(levelImage); // attaches the image to the level object
      levelMarker.x = x; // setting the level's x poistion
      levelMarker.y = y; // setting the level's y poistion
      game.addGameItem(levelMarker); // adds the level to the game

      levelMarker.velocityX -= velocity; // animating the level across the screen 
      levelImage.scaleX = scale;
      levelImage.scaleY = scale;
      // handles when halle collides w/ levelMarker
      levelMarker.onPlayerCollision = function(){
       game.changeIntegrity(300); // reduces player health
       levelMarker.fadeOut();
       startLevel();
      };
    }

    function startLevel() {
      // TODO 13 goes below here
      var level = levelData[currentLevel]; // fetches the level from the level data array and stores it inside the level variable
      var levelObjects = level.gameItems; // retrieves the array of game items and stores it in the level objects variable

      for(var i = 0; i < levelObjects.length; i++){
        var element = levelObjects[i];

        if(element.type === "obstacle"){
          createObstacle(element.x, element.y, element.hZSize,element.damage, element.image, element.offsetX, element.offsetY, element.velocity, element.scale);
        } 
        if(element.type === "enemy"){
          createEnemy(element.x, element.y, element.hZSize,element.damage, element.image, element.offsetX, element.offsetY, element.velocity, element.scale, element.scoreChange);
        } 
      
        if(element.type === "reward"){
          createReward(element.x, element.y, element.hZSize, element.image, element.offsetX, element.offsetY, element.velocity, element.scale, element.scoreChange);
        }
        if(element.type === "levelMarker"){
          createLevelMarker(element.x, element.y,element.hZSize, element.image, element.offsetX, element.offsetY, element.velocity, element.scale);
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
