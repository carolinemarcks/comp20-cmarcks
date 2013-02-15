
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
	drawRow(row1LogLocs,medLog,greenblock[3]);
	drawRow(row2TurtleLocs,turtle1,greenblock[3]+30);
	drawRow(row3LogLocs,bigLog,greenblock[3]+60);
	drawRow(row4LogLocs,smallLog,greenblock[3]+90);
	drawRow(row5TurtleLocs,turtle1,greenblock[3]+120);
}

function drawRow(boardLoc,spriteLoc,verticalOffset){
	for(i=0;i<boardLoc.length;i++){
		if(boardLoc[i]>(0-spriteLoc[2])&&boardLoc[i]<399){
			ctx.drawImage(img,spriteLoc[0],spriteLoc[1],spriteLoc[2],spriteLoc[3],boardLoc[i],verticalOffset,spriteLoc[2],spriteLoc[3]);
		}
	}
}

function initVars(){
	frogx=0;
	numLives=3;
	isGameOver=false;
	level=1;
	time=0;
	row1LogLocs=[10, 160, 350];
	row1speed=1;
	row2TurtleLocs=[20, 60, 160, 200, 300, 340, 540, 580];
	row2speed=1;
	row3LogLocs=[0, 300, 700];
	row3speed=1;
	row4LogLocs=[0, 20, 40, 60];
	row4speed=1;
	row5TurtleLocs=[-10, 30, 70];
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
	turtle1=[12,406,35,25];
	
	purpleblock=[0,115,399,40];
	greenblock=[0,54,399,56];
}

/*
canvas is 565 px tall
40 for purpleblock
*/


