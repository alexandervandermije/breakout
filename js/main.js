var breakoutApp = angular.module('breakoutApp', []);
breakoutApp.controller('MainController', function MainController($scope) {

	var canvas = document.getElementById("breakoutCanvas");
	var ctx = canvas.getContext("2d");
	
	// Ball Variables
	var ballX = canvas.width/2;
	var ballY = canvas.height-30;
	var ballSpeedX = 1.5;
	var ballSpeedY = -1.5;
	var ballDX = ballSpeedX;
	var ballDY = ballSpeedY;
	var ballRadius = 8;

	// paddle variables
	var paddleHeight = 5;
	var paddleWidth = 60;
	var paddleX = (canvas.width-paddleWidth)/2;

	// Player control variables
	var rightPressed = false;
	var leftPressed = false;

	// score Variables
	$scope.score = 0;
	$scope.lives = 3;

	// Breakable bricks variables
	var brickRowCount = 5;
	var brickColumnCount = 9;
	var brickWidth = 31;
	var brickHeight = 8;
	var brickPadding = 1;
	var brickOffsetTop = 12;
	var brickOffsetLeft = 6.5;

	$scope.gameStarted = false;
	$scope.gameWon = false;

	var bricks = []; // Set up Bricks Array
	
	for(c=0; c<brickColumnCount; c++) {
	    bricks[c] = [];
	    for(r=0; r<brickRowCount; r++) {
	        bricks[c][r] = { x: 0, y: 0, status:1};
	    }
	}

	$scope.startGame = function()
	{
		if($scope.gameStarted == false)
		{
			$scope.gameStarted = true;
			draw();
		}
		
		
	}
	function drawBall()// drawing the ball and updating position
	{
		ctx.beginPath();
			ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "#ffdd00";
			ctx.fill();
		ctx.closePath();
		ballX += ballDX;
		ballY += ballDY;
	}
	function drawPaddle()// drawing the paddle
	{
	    ctx.beginPath();
		    ctx.rect(paddleX, canvas.height-paddleHeight-2, paddleWidth, paddleHeight);
		    ctx.fillStyle = "#ffdd00";
		    ctx.save();
		    ctx.shadowColor = '#b5a800';
		    ctx.shadowBlur = 1;
		    ctx.shadowOffsetX = 1;
		    ctx.shadowOffsetY = 1;
		    ctx.fill();
		    ctx.restore();
	    ctx.closePath();
	}
	function drawBricks() {
	    for(c=0; c<brickColumnCount; c++) {
	        for(r=0; r<brickRowCount; r++) {
	        	if(bricks[c][r].status == 1)
	        	{
	        		var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
		            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
		            bricks[c][r].x = brickX;
		            bricks[c][r].y = brickY;
		            ctx.beginPath();
		            ctx.rect(brickX, brickY, brickWidth, brickHeight);
		            ctx.save();
		            ctx.shadowColor = '#000000';
		            ctx.shadowBlur = 10;

		            if(r == 0)
		            {
		            	ctx.fillStyle = '#ff0000'
		            }
		            else if(r == 1)
		            {
		            	ctx.fillStyle = '#fff000';
		            }
		            else if(r == 2)
		            {
		            	ctx.fillStyle = '#00ff00';
		            }
		            else if(r == 3)
		         	{
		            	ctx.fillStyle = "#0095DD";
		            }
		            else if(r == 4)
		            {
		            	ctx.fillStyle = '#aa49ff';
		            }
		            
		            ctx.fill();
		            ctx.restore();
		            ctx.closePath();
	        	}
	           
	        }
	    }
	}
	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);// clear the previous drawing 
		
		if(ballX + ballDX > canvas.width-ballRadius || ballX + ballDX < ballRadius) {// check if the ball is touching left or right walls
		    ballDX = -ballDX;
		}
		if(ballY + ballDY < ballRadius) {// check top wall collision
		    ballDY = -ballDY;
		} 
		else if(ballY + ballDY > canvas.height-ballRadius) // check bottom wall Collision
		{
			if(ballX > paddleX && ballX < paddleX + paddleWidth) // if the ball is between the paddle, bounce the ball back
			{
        		ballDY = -ballDY;
    		}
    		else // otherwise a life is lost!
    		{
    			$scope.lives--;
    			$scope.$apply();
    			
    			if($scope.lives < 1)// lives are out
    			{
    				document.location.reload();
    			}
		    	else
		    	{
		    		ballX = canvas.width/2;
					ballY = canvas.height-30;
		    		ballDY = -ballDY;
		    		 
		    	}
    		}
		    
		}

		if(rightPressed && paddleX < canvas.width-paddleWidth) {//move the paddle when the left or right keys are pressed
		    paddleX += 7;
		}
		else if(leftPressed && paddleX > 0) {
		    paddleX -= 7;
		}

		
		if($scope.gameStarted == true)
		{
			$scope.drawThings = requestAnimationFrame(draw);
			drawBall();
			drawPaddle();
			drawBricks();
			collisionDetection();
		}
		else
		{
			$scope.$apply();
		}
		
	}
	document.addEventListener("keydown", keyDownHandler, false);// check if the left or right keys are pressed
	document.addEventListener("keyup", keyUpHandler, false);
	
	function keyDownHandler(key) {
	    if(key.keyCode == 39) {
	        rightPressed = true;
	    }
	    else if(key.keyCode == 37) {
	        leftPressed = true;
	    }
	}

	function keyUpHandler(key) {
	    if(key.keyCode == 39) {
	        rightPressed = false;
	    }
	    else if(key.keyCode == 37) {
	        leftPressed = false;
	    }
	}
	
	

	
	function collisionDetection() { // check if the ball is hitting any bricks
	    for(c=0; c<brickColumnCount; c++) {
	        for(r=0; r<brickRowCount; r++) {
	            var b = bricks[c][r];

	            if(b.status == 1) {
	                if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
	                    ballDY = -ballDY;
	                    b.status = 0;
	                    $scope.score++;
	                    $scope.$apply();

	                    if($scope.score == brickRowCount*brickColumnCount) {
	                      	
	                      	$scope.gameStarted = false;
	                    	$scope.gameWon = true;
	                    }
	                }
	            }
	        }
	    }
	}

	
});
