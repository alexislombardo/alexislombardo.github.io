var init = function (window) {
    'use strict';
    var 
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz,
        
        app = window.opspark.makeApp(),
        canvas = app.canvas, 
        view = app.view,
        fps = draw.fps('#000');
        
    
    window.opspark.makeGame = function() {
        
        window.opspark.game = {};
        var game = window.opspark.game;
        
        ///////////////////
        // PROGRAM SETUP //
        ///////////////////
        
        // TODO 1 : Declare and initialize our variables
        var circle; // this varaible holds a single circle when iterating
        var circles = []; // an empty array to store all circles


        // TODO 2 : Create a function that draws a circle 
        function drawCircle(){          //code to draw a circle           
            circle = draw.randomCircleInArea(canvas, true, true, "#999", 2);   // uses an existing draw function to draw a circle of random size, color, and location within the canvas.It stores the output of that function.
            physikz.addRandomVelocity(circle, canvas, 5, 5); // uses the physikz library to add a random velocity and direction to the circle
            view.addChild(circle); // adds the circle as a child of view so that the circle appears on the screen
            circles.push(circle); // saves the circle to an array of circles by pushing it to the end of the array
        }


        // TODO 3 : Call the drawCircle() function
        /*
        drawCircle[0]; 
        drawCircle[1];
        drawCircle[2];
        drawCircle[3]
        drawCircle[4]; 
        */
        
        
        // TODO 7 : Use a loop to create multiple circles
       
        for(var i = 0; i < 100; i++){  // the for loop will use the drawCircle function to create 100 circles simultaneously
            drawCircle();
        }

        ///////////////////
        // PROGRAM LOGIC //
        ///////////////////
        
        /* 
        This Function is called 60 times/second, producing 60 frames/second.
        In each frame, for every circle, it should redraw that circle
        and check to see if it has drifted off the screen.         
        */
        function update() {
            // TODO 4 : Update the position of each circle using physikz.updatePosition()
           /*
           physikz.updatePosition(circles[0]); // these move the circles off of the screen
           physikz.updatePosition(circles[1]);
            physikz.updatePosition(circles[2]);
            physikz.updatePosition(circles[3]);
           physikz.updatePosition(circles[4]);
            */


            
            // TODO 5 : Call game.checkCirclePosition() on your circles
            /*
            game.checkCirclePosition(circles[0]);
            game.checkCirclePosition(circles[1]);
            game.checkCirclePosition(circles[2]);
            game.checkCirclePosition(circles[3]);
            game.checkCirclePosition(circles[4]);
            */

            // TODO 8 / TODO 9 : Iterate over the array
            for (var i = 0; i < circles.length; i++){ // responsible for calculating and updating the circle's new position based on its current velocity,  simulating movement over time
                game.checkCirclePosition(circles[i]); //checks if the circle's position is valid or requires a specific action like bouncing off a wall etc.
                physikz.updatePosition(circles[i]);
            }
           
            
        }
    
        /* 
        This Function should check the position of a circle that is passed to the 
        Function. If that circle drifts off the screen, this Function should move
        it to the opposite side of the screen.
        */
        game.checkCirclePosition = function(circle) {

            // if the circle has gone past the RIGHT side of the screen then place it on the LEFT
            if ( circle.x > canvas.width ) {
                circle = 0;
            }
            
            // TODO 6 : YOUR CODE STARTS HERE ////////////////////// this block of code implemnts a wrap around boundary detection for the circles which creates a seeminly endless loop of movement
            // checks the circles current position against the boudaries of the canvas
             // Instead of stopping or bouncing off the canvas, the circle transfers to the opposite side of the screen when it crosses a boundary
            // Left boundary  
            if (circle.x < 0) {            
                circle.x = canvas.width;  // if the circles x coordinate is less than 0 the coordinate is then reset to canvas.width which causes it to instantly reappear on the far right edge
        } // Top Boundary
            if (circle.y < 0){
            circle.y = canvas.height; // if the circle has moved off the top edge of the canvas its y coordinate is reset to canvas.height which causes it to instantly reappear on the far bottom edge
        } // Bottom Boundary
            if (circle.y > canvas.height) { // if the circle has moved off the bottpm edg the y coordinate is reset to 0 causing it to instantly reappear on th top edge
            circle.y = 0; // 
      }
        
            // YOUR TODO 6 CODE ENDS HERE //////////////////////////
        }
        
        /////////////////////////////////////////////////////////////
        // --- NO CODE BELOW HERE  --- DO NOT REMOVE THIS CODE --- //
        /////////////////////////////////////////////////////////////
        
        view.addChild(fps);
        app.addUpdateable(fps);
        
        game.circle = circle;
        game.circles = circles;
        game.drawCircle = drawCircle;
        game.update = update;
        
        app.addUpdateable(window.opspark.game);
    }
};

// DO NOT REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = init;
}
