var frogx;
function start_game() {
  canvas = document.getElementById('game');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 565, 399); // clear the screen
    img = new Image();
    img.src="assets/frogger_sprites.png";
    initSpriteVars();
    initGameVars();
    img.onload=drawBoard;
    setInterval(updateGame, 40);
  }else {
    alert('Sorry, canvas is not supported on your browser!');
  }
}

function drawBoard(){
  ctx.fillStyle = "#191970";
  ctx.fillRect(0,0,399,280);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,280,399,290);

  //banner
  ctx.drawImage(img,frogger[0],frogger[1],frogger[2],frogger[3],0,0,frogger[2],
    frogger[3]);
	//bottom purple block
	ctx.drawImage(img,purpleblock[0],purpleblock[1],purpleblock[2],purpleblock[3],
	  0,605-purpleblock[1],purpleblock[2],purpleblock[3]);
  //middle purple block
  ctx.drawImage(img,purpleblock[0],purpleblock[1],purpleblock[2],purpleblock[3],
    0,greenblock[3]+215,purpleblock[2],purpleblock[3]);
  //top green block
  ctx.drawImage(img,greenblock[0],greenblock[1],greenblock[2],greenblock[3],0,40,
    greenblock[2],greenblock[3]);

  drawScore();

  for(var i = 0; i < rowInfo.length; i++){
	  var rowData = rowInfo[i];
  	drawRow(rowData.locs, rowData.item, rowData.offset);
  }
  drawFrog(frogsu);
}

function drawRow(itemLoc,spriteLoc,verticalOffset){
  for(var i = 0; i < itemLoc.length; i++){ 
    if(itemLoc[i] > (0-spriteLoc[2]) && itemLoc[i] < 399){
      ctx.drawImage(img,spriteLoc[0],spriteLoc[1],spriteLoc[2],spriteLoc[3],
      itemLoc[i],verticalOffset,spriteLoc[2],spriteLoc[3]);
    }
  }
}
function drawFrog(frogstate){
  ctx.drawImage(img,frogstate[0],frogstate[1],frogstate[2],frogstate[3],frogx,
    rowDims[frogRow],frogstate[2],frogstate[3]);
}

function drawScore(){
  frogLifex = 0;
  for(var i = 0; i < numLives; i++){
    ctx.drawImage(img,frogsr[0],frogsr[1],frogsr[2],frogsr[3],frogLifex,530,
      frogsr[2]/1.75,frogsr[3]/1.75);
    frogLifex += (frogsr[2]/1.75);
  }
  ctx.fillStyle = "#7CFC00";
  ctx.font = "16pt Arial";
  ctx.fillText("Level:"+level,80,545);
  ctx.font = "10pt Arial";
  ctx.fillText("Score:"+score, 5, 560);
  ctx.fillText("Highcore:"+highscore, 80, 560);
}

function initGameVars(){
  frogx = 190;//190;
  frogRow = 12;//12;
  numLives = 3;
  isGameOver = false;
  level = 1;
  time = 0;
  speedA = 2;
  speedB = -2;
  row1LogLocs = [10, 160, 350];
  row2TurtleLocs = [20, 60, 160, 200, 300, 340, 540, 580];
  row3LogLocs = [0, 300, 500];
  row4LogLocs = [0, 105, 260];
  row5TurtleLocs = [-10, 30, 70, 150, 190, 230, 310, 350, 390];
  row7CarLocs = [200,370];
  row8CarLocs = [-10,90,320];	
  row9CarLocs = [125,300,380];	
  row10CarLocs = [25,165,250];
  row11CarLocs = [0,100,290];
  rowInfo = [{'locs':row1LogLocs,'speed':speedA,'item':medLog,'offset':greenblock[3]+40,'cycle':530},
	         {'locs':row2TurtleLocs,'speed':speedB,'item':turtle1,'offset':greenblock[3]+75,'cycle':630},
	         {'locs':row3LogLocs,'speed':speedA,'item':bigLog,'offset':greenblock[3]+110,'cycle':740},
	         {'locs':row4LogLocs,'speed':speedA,'item':smallLog,'offset':greenblock[3]+145,'cycle':490},
	         {'locs':row5TurtleLocs,'speed':speedB,'item':turtle1,'offset':greenblock[3]+180,'cycle':475},
	         {'locs':row7CarLocs,'speed':speedB,'item':truck6,'offset':greenblock[3]+265,'cycle':465},
	         {'locs':row8CarLocs,'speed':speedA,'item':car7,'offset':greenblock[3]+300,'cycle':450},
	         {'locs':row9CarLocs,'speed':speedB,'item':car8,'offset':greenblock[3]+335,'cycle':460},
	         {'locs':row10CarLocs,'speed':speedA, 'item':car9_1,'offset':greenblock[3]+370,'cycle':495},
	         {'locs':row11CarLocs,'speed':speedB, 'item':car10,'offset':greenblock[3]+405,'cycle':505}];
	         
  flyLoc=3;
  flyVisibile=false;
  score=0;
  highscore=0;
  
  rowDims = [60,98,130,167,200,235,280,320,360,395,428,465,500];
  winLocs = [[7,20],[92,104],[177,190],[260,275],[347,358]];
}

function initSpriteVars(){
  //all image locs stored by x,y,width,height
  bigLog=[4,164,184,24];
  medLog=[4,196,120,24];
  smallLog=[4,230,90,20];
  turtle1=[12,406,35,25];
  truck6=[100,300,54,22];
  car7=[44,262,32,29];
  car8=[7,264,33,25];
  car9_1=[6,298,34,25];
  car10=[80,262,29,29];
  frogger=[9,8,332,40];
  frogsr=[8,332,27,26];//small right
  frogsu=[10,366,27,25];//small up

  purpleblock=[0,115,399,40];
  greenblock=[0,54,399,56];
}

function updateBoard(){
  for (var i = 0; i < rowInfo.length; i++){
    var rowData = rowInfo[i];
    var locs = rowData.locs;
    for( var j = 0; j < locs.length; j++){
      var cycle = rowData.cycle;
      var width = rowData.item[2];
      if (rowData.speed > 0 && 399 < locs[j]) locs[j] -= (cycle);
      if (rowData.speed < 0 && 0 - width > locs[j]) locs[j] += (cycle);
      locs[j]+=rowData.speed;
    }
  }
  updateFrogLoc();
  drawBoard();
  checkGameOver();
}

document.addEventListener("keydown", function(event) {
  event.preventDefault();
  switch(event.keyCode){
    case 37: 
      if (frogx > 8) frogx -= 20;
      if (frogx < 8) frogx = 8;
      break;
    case 38:
      if (frogRow > 0) frogRow--;
      break;
    case 39:
      if (frogx < 370) frogx += 20;
      if(frogx > 370) frogx = 370;
      break;
    case 40:
      if (frogRow < 12) frogRow++;
      break;
  }
});

function checkGameOver(){
  var collision = false;
  if (frogRow > 0 && frogRow < 6){
    console.log("detect water");
  } else if (frogRow > 6 && frogRow < 12){
    var rowData = rowInfo[frogRow-2];
    var carLocs = rowData.locs;
    for(var i = 0; i < carLocs.length; i++){
      collision = collision || overlap (frogsu, frogx, rowData.item, carLocs[i]);
    }
    //console.log("detect car");
  } else if (frogRow == 0){
    isGameOver = true
    var win;
    for (var i = 0; i < winLocs.length; i++){
      win = win || (frogx > winLocs[i][0] && frogx < winLocs[i][1]);
    }
    if (win) manageWin();
    else collision = true
  }
  
  if (collision) {
    isGameOver=true;
    manageDeath();
  }
  
}

function overlap(dims1, x1, dims2, x2){
  if (x1 < x2) {
    if (x1 + dims1[2] > x2 + 6 && x2 + dims2[2] > x1 ) return true;
  }
  else {
    if (x2 + dims2[2] > x1 + 6 && x1 + dims1[2] > x2) return true;
  }
  return false;
}
function updateGame(){
  if (!isGameOver) updateBoard();
}
function updateFrogLoc(){
  if (frogRow > 0 && frogRow < 6){
    var speed = rowInfo[frogRow-1].speed;
    frogx += speed;
  }
}