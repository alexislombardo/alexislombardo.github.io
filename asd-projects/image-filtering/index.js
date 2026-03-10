// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
  applyFilter(reddify);
  applyFilter(decreaseBlue);
  applyFilter(increaseGreenByBlue);
  applyFilterNoBackground(reddify);

  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////


// TODO 1, 2, 3 & 5: Create the applyFilter function here
function applyFilter(filterFunction){
  for(var i = 0; i < image.length; i ++){
    for(var j = 0; j < image[i].length; j ++){
      // console.log(image[i][j]);
      var pixel = image[i][j];
      var pixelArray = rgbStringToArray(pixel);
      // This is where I’ll modify the color values later
      filterFunction(pixelArray);
      var updatedPixel = rgbArrayToString(pixelArray);
      image[i][j] = updatedPixel;
    }
  }
}

// TODO 9 Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction){
  var backgroundColor = image[0][0];
  for(var i = 0; i < image.length; i++){
    for(var j = 0; j < image[i].length; j++){
      var pixel = image[i][j];
      if(pixel !== backgroundColor){
        var pixelArray = rgbStringToArray(pixel);
        filterFunction(pixelArray);
        pixel = rgbArrayToString(pixelArray);
        image[i][j] = pixel;
      }
    }
  }
}

// TODO 6: Create the keepInBounds function
function keepInBounds(num1){
  return (num1 < 0) ? 0 : (num1 > 255) ? 255 : num1;
}



// TODO 4: Create reddify filter function
function reddify(array){
  array[RED] = 200;
}

// test for modifying array
/*var testArray = [100, 100, 100];
  reddify(testArray);
  console.log(testArray); // Should show [200, 100, 100] 
// */

// TODO 7 & 8: Create more filter functions
function decreaseBlue(array){
  array[BLUE] = keepInBounds(array[BLUE] - 50);
}

function increaseGreenByBlue(array){
  array[GREEN] = keepInBounds(array[GREEN] + array[BLUE]);
}

// CHALLENGE code goes below here
