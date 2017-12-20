/* http://www.corgdesign.com
   License: none (public domain)
*/

// shim layer with setTimeout fallback, see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

(function(){

	var puzzleCanvas = document.getElementById('myCanvas'),
		c = puzzleCanvas.getContext('2d'),
		squares = [],
		numberOfSquares = 15,
		sqWidth = puzzleCanvas.width/4,
		sqHeight = puzzleCanvas.height/4,
		originalWidth = 75,
		originalHeight = 75,
		img = new Image(),
		mouseDown = false,
		mouseX, mouseY,
		spaceX = 225, // Initial x and y coordinates of the space
		spaceY = 225;
	
	img.src = 'puzzle.jpg';

	function createSquares() {
		
		img.addEventListener("load", function() {	
			// Add the image squares x & y to the array squares[ ]
			for( i = 0; i < numberOfSquares; i++ ) {
				
				// First row, tiles 0-3
				if(i < 4) {
					squares.push({
						imgX: i * sqWidth,
						imgY: 0
					});
				
				// 2nd row, tiles 4-7	
				} else if(i > 3 && i < 8) {
					squares.push({
						imgX: (i-4) * sqWidth,
						imgY: sqHeight
					});
				
				// 3rd row, tiles 8-11		
				} else if(i > 7 && i < 12) {
					squares.push({
						imgX: (i-8) * sqWidth,
						imgY: 2 * sqHeight
					});
				// last row, tiles 12-15
				} else {
					squares.push({
						imgX: (i-12) * sqWidth,
						imgY: 3 * sqHeight
					});
				}
				
				// Define the x & y to draw
				squares[i].drawX = squares[i].imgX;
				squares[i].drawY = squares[i].imgY;
				
				// Draw the tiles - drawImage(x of original, y of original, w of original, h of original, x to draw, y to draw, w to draw, h to draw 
				c.drawImage(
					img,
					squares[i].imgX, squares[i].imgY, originalWidth -2, originalHeight - 2, squares[i].imgX, squares[i].imgY, sqWidth - 2, sqHeight - 2
				);
			}
		}, false);
	}
	
	puzzleCanvas.addEventListener('mousedown', function(e){
		mouseDown = true;
		mouseX = e.pageX - puzzleCanvas.offsetLeft;  // subtract the canvas offset for left and top
		mouseY = e.pageY - puzzleCanvas.offsetTop;
	});	
	
	function moveSquare(){
	
		for(i = 0; i < numberOfSquares; i++){  // Loop through each square to check for the mousedown position
	
			if(mouseDown) {
		
				if ( squares[i].drawX < mouseX && (squares[i].drawX + sqWidth) > mouseX && squares[i].drawY < mouseY && (squares[i].drawY + sqHeight) > mouseY ) {
					
					// Check if there is the space is next to tile
					if ( squares[i].drawX == spaceX && ( squares[i].drawY == spaceY - sqHeight || squares[i].drawY == spaceY + sqHeight ) || squares[i].drawY == spaceY && ( squares[i].drawX == spaceX - sqWidth || squares[i].drawX == spaceX + sqWidth ) ) {
						
						c.clearRect(squares[i].drawX, squares[i].drawY, sqWidth, sqHeight);  // Clear the tile, ie create new space
						
						newSpaceX = squares[i].drawX;	// Store the position of this new space
						newSpaceY = squares[i].drawY;
						
						squares[i].drawX = spaceX;		// Store the position for where the tile will now be drawn
						squares[i].drawY = spaceY;
					
						spaceX = newSpaceX;				// Reset the x & y for the space
						spaceY = newSpaceY;
					
					}
				}
				
				// Draw the tile in its new position
				c.drawImage(
					img,
					squares[i].imgX, squares[i].imgY, originalWidth -2, originalHeight - 2, squares[i].drawX, squares[i].drawY, sqWidth - 2, sqHeight - 2
				);	
				
			}
		}
		
		requestAnimFrame(moveSquare);
	}

	createSquares();
	
	moveSquare();

})();
