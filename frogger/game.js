
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
	ctx.fillStyle="#191970";
	ctx.fillRect(0,0,399,280);
	ctx.fillStyle="#000000";
	ctx.fillRect(0,280,399,290);
	//banner
	ctx.drawImage(img,frogger[0],frogger[1],frogger[2],frogger[3],0,0,frogger[2],frogger[3]);
	//bottom purple block
	ctx.drawImage(img,purpleblock[0],purpleblock[1],purpleblock[2],purpleblock[3],0,605-purpleblock[1],purpleblock[2],purpleblock[3]);
	//middle purple block
	ctx.drawImage(img,purpleblock[0],purpleblock[1],purpleblock[2],purpleblock[3],0,greenblock[3]+215,purpleblock[2],purpleblock[3]);
	//top green block
	ctx.drawImage(img,greenblock[0],greenblock[1],greenblock[2],greenblock[3],0,40,greenblock[2],greenblock[3]);
	
	drawScore();
	
	drawRow(row1LogLocs,medLog,greenblock[3]+40);
	drawRow(row2TurtleLocs,turtle1,greenblock[3]+75);
	drawRow(row3LogLocs,bigLog,greenblock[3]+110);
	drawRow(row4LogLocs,smallLog,greenblock[3]+145);
	drawRow(row5TurtleLocs,turtle1,greenblock[3]+180);
	drawRow(row6CarLocs,truck6,greenblock[3]+265);
	drawRow(row7CarLocs,car7,greenblock[3]+300);
	drawRow(row8CarLocs,car8,greenblock[3]+335);
	drawRow(row9CarLocs,car9_1,greenblock[3]+370);
	drawRow(row10CarLocs,car10,greenblock[3]+405);
	
	drawFrog(frogsu);
}

function drawRow(boardLoc,spriteLoc,verticalOffset){
	for(i=0;i<boardLoc.length;i++){
		if(boardLoc[i]>(0-spriteLoc[2])&&boardLoc[i]<399){
			ctx.drawImage(img,spriteLoc[0],spriteLoc[1],spriteLoc[2],spriteLoc[3],boardLoc[i],verticalOffset,spriteLoc[2],spriteLoc[3]);
		}
	}
}
function drawFrog(frogstate){
	ctx.drawImage(img,frogstate[0],frogstate[1],frogstate[2],frogstate[3],frogx,frogy,frogstate[2],frogstate[3]);
}
function drawScore(){
	frogLifex=0;
	for(i=0; i<numLives; i++){
		ctx.drawImage(img,frogsr[0],frogsr[1],frogsr[2],frogsr[3],frogLifex,530,frogsr[2]/1.75,frogsr[3]/1.75);
		frogLifex+=(frogsr[2]/1.75);
	}
	ctx.fillStyle = "#7CFC00";
	ctx.font="16pt Arial";
	ctx.fillText("Level:"+level,80,545);
	ctx.font="10pt Arial";
	ctx.fillText("Score:"+score, 5, 560);
	ctx.fillText("Highcore:"+highscore, 80, 560);
}

function initVars(){
	frogx=180;
	frogy=500;
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
	highscore=0;
	
	//all image locs stored by x,y,width,height
	bigLog=[4,164,184,24];
	medLog=[4,196,120,24];
	smallLog=[4,230,90,20];
	turtle1=[12,406,35,25];
	truck6=[100,300,54,22];
	car7=[44,262,43,29];
	car8=[7,264,33,25];
	car9_1=[6,298,34,20];
	car10=[80,262,29,29];
	frogger=[9,8,332,40];
	frogsr=[8,332,27,26];
	frogsu=[10,366,27,25]

	
	purpleblock=[0,115,399,40];
	greenblock=[0,54,399,56];
}

/*
canvas is 565 px tall
40 for purpleblock
*/


