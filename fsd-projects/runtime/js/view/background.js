var background = function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    var draw = window.opspark.draw;
    var createjs = window.createjs;
    
    /*
     * Create a background view for our game application
     */
    window.opspark.makeBackground = function(app,ground) {
        /* Error Checking - DO NOT DELETE */
        if(!app) {
            throw new Error("Invalid app argument");
        }
        if(!ground || typeof(ground.y) == 'undefined') {
            throw new Error("Invalid ground argument");
        }
        
        // useful variables
        var canvasWidth = app.canvas.width;
        var canvasHeight = app.canvas.height;
        var groundY = ground.y;
        
        // container which will be returned
        var background;
        
        //////////////////////////////////////////////////////////////////
        // ANIMATION VARIABLES HERE //////////////////////////////////////
        //////////////////////////////////////////////////////////////////
        // TODO (several):
        var tree;
        var buildings = [];


      
      
        // called at the start of game and whenever the page is resized
        // add objects for display in background. draws each image added to the background once
        function render() {
            background.removeAllChildren();

            // TODO 1:
            // this currently fills the background with an obnoxious yellow;
            // you should modify both the height and color to suit your game
            var backgroundFill = draw.rect(canvasWidth,groundY,'blue'); // draws a rectangle and stores it in the var background fill
            background.addChild(backgroundFill); // adds the backgroundFill to the background object
            
            // TODO 2: - Add a moon and starfield
             for(var i = 0; i < 30; i ++){
                var circle = draw.circle(2, "white", "LightGray", 2); // create a circle with a specified radius, border and fill color, and alpha and stores it in the variable circle
                circle.x = canvasWidth * Math.random(); // sets a random x position within the canvas width
                circle.y = groundY * Math.random(); // sets a random y position within groundY
                background.addChild(circle); // adds circle to the background container
            }

            var moon = draw.bitmap("img/moon.png"); // creates a bitmap object using the moon image and stores it in the variable moon
            moon.x = canvas.width - 400; // sets the moon's X position
            moon.y = groundY - 400; // sets the moon's Y position
            moon.scaleX = 10.0; // scales the moon's width
            moon.scaleY = 10.0; // scales the moon's height
            background.addChild(moon); // adds the moon to the background container
            
           
            // TODO 4: Part 1 - Add buildings!     Q: This is before TODO 4 for a reason! Why?
            for (var i = 0; i < 5; ++i) {
                var buildingHeight = 450 * Math.random();
                var building = draw.rect(75, buildingHeight, "gray", "Black", 1);
                building.x = 200 * i;
                building.y = groundY - buildingHeight;
                background.addChild(building);
                buildings.push(building);
            }
            
            // TODO 3: Part 1 - Add a tree
            tree = draw.bitmap("img/tree.png"); // creates a bitmap object using the tree image and stores it in the variable tree
            tree.x = 600; // sets the x value of the tree
            tree.y = groundY - 220; // sets the y value of the tree
            background.addChild(tree); // adds the tree to th background container
            
        } // end of render function - DO NOT DELETE
        
        
        // Perform background animation
        // called on each timer "tick" - 60 times per second
        function update() {
            // useful variables
            var canvasWidth = app.canvas.width;
            var canvasHeight = app.canvas.height;
            var groundY = ground.y;
            
            // TODO 3: Part 2 - Move the tree!
            tree.x = tree.x - 1.75;

            if (tree.x < -200) {
                tree.x = canvasWidth;
            }
            
            // TODO 4: Part 2 - Parallax
            for (var i = 0; i < buildings.length; i++) {
                 var building = buildings[i];

                if(building <-200){
                    buildings += 1.75;
                }
}

        } // end of update function - DO NOT DELETE
        
        
        
        /* Make a createjs Container for the background and let it know about the render and upate functions*/
        background = new createjs.Container();
        background.resize = render;
        background.update = update;
        
        /* make the background able to respond to resizing and timer updates*/
        app.addResizeable(background);
        app.addUpdateable(background);
        
        /* render and return the background */
        render();
        return background;
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = background;
}
