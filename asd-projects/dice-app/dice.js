$(document).ready(function () {
  // Your code goes here

$("<div>")
    .css({
        height : 15,
        width: 15,
        backgroundColor: "white",
        position: "absolute",
        borderRadius: "50%",
        top: 50,
        left: 50,
    })
  .appendTo("#die");

  // create sec
$("<div>")
    .css({
        height : 15,
        width: 15,
        backgroundColor: "white",
        position: "absolute",
        borderRadius: "50%",
        top: 50,
        left: 50,
    })


  .appendTo("#die2");

  function makeDot(top, left, elementID){
    $("<div>")
        .css({
            height : 15,
            width: 15,
            backgroundColor: "white",
            position: "absolute",
            borderRadius: "50%",
            top: top,
            left: left,
        })
      
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
        makeDot(75, 25, dieID); //bottom left
        makeDot(75, 75, dieID); // bottom right  


    }

  }
  function handleClick(){
     rollDie("#die");

  }
  function handleClick2(){
     rollDie("#die2");

  }

  $("#die").on("click", handleClick);
  $("#die2").on("click", handleClick2);


});

