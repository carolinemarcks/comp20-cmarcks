
function start_game(){	
	
	canvas = document.getElementById('game');
    if (canvas.getContext) {
    	ctx = canvas.getContext('2d');
    	ctx.clearRect(0, 0, 565, 399); // clear the screen
        img= new Image();
        img.src="assets/frogger_sprites.png";
        initVars();
        img.onload=drawBoard;
            	
    }else {
        alert('Sorry, canvas is not supported on your browser!');
    }
	
}

function drawBoard(){
	
	ctx.drawImage(img,purpleblock[0],purpleblock[1],purpleblock[2],purpleblock[3],0,565-purpleblock[1],purpleblock[2],purpleblock[3]);
	ctx.drawImage(img,greenblock[0],greenblock[1],greenblock[2],greenblock[3],0,0,greenblock[2],greenblock[3]);
	
}

function initVars(){
	frogx=0;
	frogy=0;
	numLives=3;
	isGameOver=false;
	level=1;
	time=0;
	row1LogLocs=[0, 20, 40, 60];
	row1speed=1;
	row2LogLocs=[0, 20, 40, 60];
	row2speed=1;
	row3LogLocs=[0, 20, 40, 60];
	row3speed=1;
	row4LogLocs=[0, 20, 40, 60];
	row4speed=1;
	row5LogLocs=[0, 20, 40, 60];
	row5speed=1;
	row6CarLocs=[0,10,20];
	row6speed=1;
	row7CarLocs=[0,10,20];	
	row7speed=1;
	row8CarLocs=[0,10,20];	
	row8speed=1;
	row9CarLocs=[0,10,20];
	row9speed=1;
	row10CarLocs=[0,10,20];
	row10speed=1;
	flyLoc=3;
	flyVisibile=false;
	score=0;
	
	//all image locs stored by x,y,width,height
	bigLog=[4,164,184,24];
	medLog=[4,196,120,24];
	smallLog=[4,230,90,20];
	
	purpleblock=[0,115,399,40];
	greenblock=[0,54,399,56];
	

}

/*
canvas is 565 px tall
40 for purpleblock
*/


