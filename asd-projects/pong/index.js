/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83,
  };
  
  // Game Item Objects
  function createGameItem(id, x, y, speedX, speedY, width, height){
    return {
      id: id,
      x: x,
      y: y,
      speedX: speedX,
      speedY: speedY,
      width: width,
      height: height
    }
  }

  
  
  var pingBall = createGameItem("gameItem", 0, 0, 0, 0, 20, 20);
  startBall(); // sets the position and gives the ball a random speed
  var leftPaddle = createGameItem("leftPaddle", 0, 260, 0, 0, 20, 80);
  var rightPaddle = createGameItem("rightPaddle", 480, 260, 0, 0, 20, 80);
  
  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  
  // change 'eventType' to the type of event you want to handle
  $(document).on("keydown", handleKeyDown);
  $(document).on("keyup", handleKeyUp);
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
     pingBall.x += pingBall.speedX;
    pingBall.y += pingBall.speedY;

  // bounce off left/right walls
    if (pingBall.x <= 0 || pingBall.x + pingBall.width >= 500) {
      pingBall.speedX *= -1;
    }

    // bounce off top/bottom walls
    if (pingBall.y <= 0 || pingBall.y + pingBall.height >= 600) {
      pingBall.speedY *= -1;
    } 
    // handles pandle movement
    movePaddles();
    keepPaddlesInBounds();

    // draws the game items 
    drawGameItem(pingBall);
    drawGameItem(leftPaddle);
    drawGameItem(rightPaddle);

  }
  
  /* 
  Called in response to events.
  */
  function handleEvent(event) {

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  function startBall(){
    // creates starting position for pingpong ball
    pingBall.x = 240;
    pingBall.y = 290;

    // random horizontal direction
    pingBall.speedX = Math.random() < 0.5 ? -4 : 4;

    // random vertical speed
    pingBall.speedY = (Math.random() * 4) - 2;
  }
  function handleKeyDown(event){
    console.log(event.which);

    // right paddle 
    if (event.which === KEY.UP) {
      rightPaddle.speedY = -5;
    } else if (event.which === KEY.DOWN) {
      rightPaddle.speedY = 5;
    }

    // left paddle (
    if (event.which === KEY.W) {
      leftPaddle.speedY = -5;
    } else if (event.which === KEY.S) {
      leftPaddle.speedY = 5;
    }
    
  }
  function handleKeyUp(event) {
    console.log(event.which);

    // RIGHT paddle
    if (event.which === KEY.UP) {
      rightPaddle.speedY = 0;
    } else if (event.which === KEY.DOWN) {
      rightPaddle.speedY = 0;
    }

    console.log(event.which);

    // LEFT paddle
    if (event.which === KEY.W) {
      leftPaddle.speedY = 0;
    } else if (event.which === KEY.S) {
      leftPaddle.speedY = 0;
    }
  }

  function movePaddles() {
    leftPaddle.y += leftPaddle.speedY;
    rightPaddle.y += rightPaddle.speedY;
  }

  function keepPaddlesInBounds() {
    // left paddle
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > 600) {
      leftPaddle.y = 600 - leftPaddle.height;
    }

    // right paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > 600) {
      rightPaddle.y = 600 - rightPaddle.height;
    }
}


    function drawGameItem(item) {
      var element = document.getElementById(item.id);
      element.style.left = item.x + "px";
      element.style.top = item.y + "px";
}
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
