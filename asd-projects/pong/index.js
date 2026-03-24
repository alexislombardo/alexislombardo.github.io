/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width();
  const BOARD_HEIGHT = $("#board").height();
  const KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83,
  };
  
  // Game Item Objects
  function createGameItem(id, x, y, speedX, speedY){
    return {
      id: id,
      x: x,
      y: y,
      speedX: speedX,
      speedY: speedY,
      width: $(id).width(),
      height: $(id).height()
    }
  }

  var leftScore = 0; // holds the starting value of the left player's score
  var rightScore = 0; // holds the starting value of the right player's score
  var pingBall = createGameItem("#pingPong", 0, 0, 0, 0); // creates the ball using the factory function
  startBall(); // sets the position and gives the ball a random speed
  var leftPaddle = createGameItem("#leftPaddle", 0, 260, 0, 0);
  var rightPaddle = createGameItem("#rightPaddle", BOARD_WIDTH - $("#rightPaddle").width(),  260, 0, 0);
  $("#playAgain").hide();
  var gameMode = "two";
  $("#onePlayer").click(function() {
    gameMode = "one";
    $("#onePlayer").addClass("activeMode");
    $("#twoPlayer").removeClass("activeMode");
  });

  $("#twoPlayer").click(function() {
    gameMode = "two";
    $("#twoPlayer").addClass("activeMode");
    $("#onePlayer").removeClass("activeMode");
  });
  // confetti variables
  var duration = 30 * 1000;
  var end = Date.now() + duration;

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  
  // change 'eventType' to the type of event you want to handle
  $(document).on("keydown keyup", handleEvent);
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    // makes the ball move when window is loaded
    pingBall.x += pingBall.speedX;
    pingBall.y += pingBall.speedY;


    // LEFT paddle collision
    if (doCollide(pingBall, leftPaddle)) {
      pingBall.speedX *= -1;
      pingBall.x = leftPaddle.x + leftPaddle.width; // prevent sticking
    }

    // RIGHT paddle collision
    if (doCollide(pingBall, rightPaddle)) {
      pingBall.speedX *= -1;
      pingBall.x = rightPaddle.x - pingBall.width; // prevent sticking
    }
    
    // bounce off top/bottom walls (keeps ball within frame but allows for scoring)
    if (pingBall.y <= 0 || pingBall.y + pingBall.height >= BOARD_HEIGHT) {
      pingBall.speedY *= -1;
    } 

    // checks and updates score
    handleScore();

    // handles pandle movement
   

    movePaddles(leftPaddle);

    // AI vs right player logic
    if (gameMode === "one") {
      moveAIPaddle();
    } else {
      movePaddles(rightPaddle);
    }

    keepPaddlesInBounds(leftPaddle);
    keepPaddlesInBounds(rightPaddle);

    // draws the game items 
    drawGameItem(pingBall);
    drawGameItem(leftPaddle);
    drawGameItem(rightPaddle);

  }
  
  /* 
  Called in response to events.
  */
  function handleEvent(event) {
    var isKeyDown = event.type === "keydown";

    // RIGHT paddle (only in 2-player mode)
    if (gameMode === "two") {
      if (event.which === KEY.UP) {
        rightPaddle.speedY = isKeyDown ? -5 : 0;
      } 
      else if (event.which === KEY.DOWN) {
        rightPaddle.speedY = isKeyDown ? 5 : 0;
      }
}
    // LEFT paddle
    if (event.which === KEY.W) {
      leftPaddle.speedY = isKeyDown ? -5 : 0;
    } 
    else if (event.which === KEY.S) {
      leftPaddle.speedY = isKeyDown ? 5 : 0;
    }
}

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  function startBall(){
    pingBall.x = 240;
    pingBall.y = 290;

    // random horizontal direction
    pingBall.speedX = Math.random() < 0.5 ? -6 : 6;

    // random vertical speed
    pingBall.speedY = (Math.random() * 6) - 3;
  }
  function movePaddles(paddle) {
    // controls paddle movement
    paddle.y += paddle.speedY;
  }
  
  function moveAIPaddle() {
    var paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    var ballCenter = pingBall.y + pingBall.height / 2;

    // only react when ball is coming toward AI
    if (pingBall.speedX > 0) {
      if (paddleCenter < ballCenter - 10) {
        rightPaddle.y += 7;
      } else if (paddleCenter > ballCenter + 10) {
        rightPaddle.y -= 7;
      }
    }

}

  function keepPaddlesInBounds(paddle) {
    // left paddle
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y > BOARD_HEIGHT  - paddle.height ) {
      paddle.y = BOARD_HEIGHT - paddle.height;
    }
}

// detects for paddle and ball collision
function doCollide(a, b){
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// updates score by detecting wether or not the ball hit the left or right side of the board
function addPoint(id) {
  if (id === "left") {
    leftScore++;
    $("#leftScore").text(leftScore);
  } else {
    rightScore++;
    $("#rightScore").text(rightScore);
  }
}

function handleScore() {
  // checks whether right paddle hit the ball onto the left side of the board
  if (pingBall.x <= 0) {
    addPoint("right");
    startBall();
    checkScore();
  }
  // checks whether left paddle hit the ball onto the right side of the board
  if (pingBall.x + pingBall.width >= BOARD_WIDTH) {
    addPoint("left");
    startBall();
    checkScore();
  }
}

function checkScore(){
  // checks the left player's score
  if(leftScore >= 7){
   $("h1").text("Left Player Wins!").appendTo('body');
   frame();
   // restarts the game after condition is met
   $("#playAgain").show();
    endGame();
  } else if(rightScore >= 7){
      // checks the right player's score
      $("h1").text("Right Player Wins!").appendTo('body');
      frame();
      // restarts the game after condition is met
      $("#playAgain").show();
      endGame();
    }
}
function frame(){
  // launch a few confetti from the left edge
  confetti({
    particleCount: 7,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  });
  // and launch a few from the right edge
  confetti({
    particleCount: 7,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  });

  // keep going until we are out of time
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }

}
function drawGameItem(item) {
  $(item.id).css("top", item.y);
  $(item.id).css("left", item.x);
}
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
 

/*

Attributions for confetti code and canvas library

https://confetti.js.org/#
https://github.com/catdad/canvas-confetti?tab=readme-ov-file


*/