/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width();
  const BOARD_HEIGHT = $("#board").height();
  const PLAYER_WIDTH = $(".player").width();
  const PLAYER_HEIGHT = $(".player").height();
  const KEY = {
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    W: 87,
    S: 83,
    D: 68,
    SPACE: 32
  };

 
  // Game Item Objects
  var player1 = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    id: '#player1'
  }

   var player2 = {
    x: BOARD_WIDTH - PLAYER_WIDTH,
    y: BOARD_HEIGHT - PLAYER_HEIGHT,
    speedX: 0,
    speedY: 0,
    id: '#player2'
  }

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)

  /* 
  This section is where you set up event listeners for user input.
  For example, if you wanted to handle a click event on the document, you would replace 'eventType' with 'click', and if you wanted to execute a function named 'handleClick', you would replace 'handleEvent' with 'handleClick'.

  Note: You can have multiple event listeners for different types of events.
  */
  $(document).on('keydown', handleKeyDown);                          
  $(document).on('keyup', handleKeyUp);
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionameItem(player1);
    repositionameItem(player2);
    wallCollision(player1);
    wallCollision(player2);
    redrawGameItem(player1);
    redrawGameItem(player2);


    if(doCollide(player1, player2)){
      console.log("Tag!");
    }

  }
  
  /* 
  This section is where you set up the event handlers for user input.
  For example, if you wanted to make an event handler for a click event, you should rename this function to 'handleClick', then write the code that should execute when the click event occurs.
  
  Note: You can have multiple event handlers for different types of events.
  */
  function handleKeyDown(event) {
     console.log(event.which);
     if(event.which === KEY.LEFT){
      player2.speedX = -5;
      player2.speedY = 0;
     } else if(event.which === KEY.RIGHT){
      player2.speedX = 5;
       player2.speedY = 0;
     } else if(event.which === KEY.UP){
      player2.speedY = -5;
      player2.speedX = 0;
     } else if(event.which === KEY.DOWN){
      player2.speedY = 5;
      player2.speedX = 0;
     }

      if(event.which === KEY.A){
      player1.speedX = -5;
      player1.speedY = 0;
     } else if(event.which === KEY.D){
      player1.speedX = 5;
       player1.speedY = 0;
     } else if(event.which === KEY.W){
      player1.speedY = -5;
      player1.speedX = 0;
     } else if(event.which === KEY.S){
      player1.speedY = 5;
      player1.speedX = 0;
     }

    if(event.which === KEY.SPACE){
      handleColor(player1);
      handleColor(player2);
    }

  }

  function handleKeyUp(event) {
     console.log(event.which);
     if(event.which === KEY.LEFT){
      player2.speedX = 0;
     } else if(event.which === KEY.RIGHT){
      player2.speedX = 0;
     } else if(event.which === KEY.UP){
      player2.speedY = 0;
     } else if(event.which === KEY.DOWN){
      player2.speedY = 0;
     }

     console.log(event.which);
     if(event.which === KEY.A){
      player1.speedX = 0;
     } else if(event.which === KEY.D){
      player1.speedX = 0;
     } else if(event.which === KEY.W){
      player1.speedY = 0;
     } else if(event.which === KEY.S){
      player1.speedY = 0;
     }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  function repositionameItem(player){
    player.x += player.speedX
    player.y += player.speedY
  }

  function redrawGameItem(player){
    $(player.id).css("left", player.x);
    $(player.id).css("top", player.y);

  }

  function wallCollision(player){
    if(player.x < 0 ){
      player.x = 0; // left
    } else if(player.x > BOARD_WIDTH - PLAYER_WIDTH){
      player.x = BOARD_WIDTH - PLAYER_WIDTH;   //right
    } else if(player.y < 0 ){
      player.y = 0;  // top
    } else if(player.y > BOARD_HEIGHT - PLAYER_HEIGHT){
      player.y = BOARD_HEIGHT - PLAYER_HEIGHT; // bottom
    }
  }
 
  function handleColor(player){
    var randomColor = "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
    });

    $(player.id).css("backgroundColor", randomColor);
  }
  /*
  leftA < rightB
  rightA >leftB
  topA < bottomB
  bottomA > topB
  */

  function doCollide(a, b){
    return (
      a.x < b.x + PLAYER_WIDTH &&
      a.x + PLAYER_WIDTH > b.x &&
      a.y < b.y + PLAYER_HEIGHT && 
      a.y + PLAYER_HEIGHT > b.y
    )
    
  }
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
