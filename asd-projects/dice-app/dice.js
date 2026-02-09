$(document).ready(function () {
  // Your code goes here

$("<div>").
  css("height", 15)
  .css("width", 15)
  .css("background-color", "white")
  .css("position", "absolute")
  .css("top", 50)
  .css("left", 50)
  .appendTo("#die");

  function makeDot(top, left, elementID){
    $("<div>")
      .css("height", 15)
      .css("width", 15)
      .css("background-color", "black")
      .css("position", "absolute")
      .css("top", top)
      .css("left", left)
      .appendTo(elementID);
  }

  function rollDie(dieID){
    //TODO 9
    $(dieID).empty();


    var randomNum = Math.ceil(Math.random() * 6);
    console.log(randomNum);

    //TODO 8
    if (randomNum === 1) {
        makeDot(50, 50, dieID); // middle middle
    } else if (randomNum === 2) {
        makeDot(25, 25, dieID); // top left
        makeDot(75, 75, dieID); // bottom right
    } else if (randomNum === 3) {
        makeDot(25, 25, dieID); // top left
        makeDot(75, 75, dieID); // bottom right
        makeDot(50, 50, dieID); // middle middle
    } else if (randomNum === 4) {
        makeDot(75, 75, dieID); // bottom right
        makeDot(25, 25, dieID); // top left
        makeDot(25, 75, dieID); // bottom left
        makeDot(75, 25, dieID); // top right
    } else if (randomNum === 5) {
        makeDot(50, 50, dieID); // middle middle
        makeDot(75, 75, dieID); // bottom right
        makeDot(25, 25, dieID); // top left
        makeDot(25, 75, dieID); // bottom left
        makeDot(75, 25, dieID); // top right
    } else if(randomNum === 6){
        makeDot(25, 25, dieID); // top left
        makeDot(25, 75, dieID); // top right
        makeDot(50, 25, dieID); //middle left
        makeDot(50, 75, dieID); // middle right
        // bottom row
        makeDot(75, 25, dieID); //bottom left
        makeDot(75, 75, dieID); // bottom right  


    }

  }
  function handleClick(){
     rollDie("#die");
  }

  $("#die").on("click", handleClick);


});

