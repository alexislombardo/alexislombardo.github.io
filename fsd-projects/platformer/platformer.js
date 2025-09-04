$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200, "navy"); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    // TODO 1 - Enable the Grid
    toggleGrid();


    // TODO 2 - Create Platforms
    createPlatform(200, 650, 100, 40, "purple");
    createPlatform(385, 550, 100, 40, "red");
    createPlatform(600, 450, 100, 40, "purple");
    createPlatform(390, 350, 100, 40, "red");
    createPlatform(620, 250, 100, 40, "purple");
    createPlatform(900, 350, 100, 40, "red");



    // TODO 3 - Create Collectables
      createCollectable("database",230, 600, 0.4);
      createCollectable("database", 430, 500, 0.4);
      createCollectable("database", 630, 400, 0.4);
      createCollectable("database", 430, 300, 0.4);


    
    // TODO 4 - Create Cannons
    createCannon("top", 600, 1500);
    createCannon("left", 110, 2000);



    
    
    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
