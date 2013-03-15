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
  numWins = 0;
  time = 0;
  speedA = 2;
  speedB = -2;
  row1LogLocs = [10, 160, 350];
  row2TurtleLocs = [20, 55, 160, 195, 300, 335, 540, 575];
  row3LogLocs = [0, 300, 500];
  row4LogLocs = [0, 105, 260];
  row5TurtleLocs = [-10, 25, 60, 150, 185, 220, 310, 345, 380];
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

  carAllowance = 6;
  innerTurtleAllowance = -10;
  outerWaterAllowance = 6;
  
  flyLoc = 3;
  flyVisibile = false;
  score = 0;
  highscore = localStorage["frogger_high"]
  if (highscore == null)highscore = 0;
  rowProgress = 12;
  forwardMove = false;
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
  checkGameOver();
  updateScore();
  drawBoard();
  
}

document.addEventListener("keydown", function(event) {
  event.preventDefault();
  switch(event.keyCode){
    case 37: 
      if (frogx > 8) frogx -= 30;
      if (frogx < 8) frogx = 8;
      break;
    case 38:
      forwardMove = true;
      if (frogRow > 0) frogRow--;
      break;
    case 39:
      if (frogx < 370) frogx += 30;
      if(frogx > 370) frogx = 370;
      break;
    case 40:
      if (frogRow < 12) frogRow++;
      break;
  }
});

function checkGameOver(){
  var collision = false;
  switch(frogRow){
    case 1: case 3: case 4:
      collision = collisionOnLogRow();
      break;
      
    case 2: case 5:
      collision = collisionOnTurtleRow();
      break;
      
    case 7: case 8: case 9: case 10: case 11:
      collision = collisionInCarRow();
      break;
      
    case 0:
      var win;
      for (var i = 0; i < winLocs.length; i++){
        win = win || (frogx > winLocs[i][0] && frogx < winLocs[i][1]);
      }
      if (win) manageWin();
      else collision = true
      break;
  }
  
  if (collision || frogx < 0 || frogx > 380){
    manageDeath();
  }  
}

function overlap(dims1, x1, dims2, x2, allowance){//return true if 1 and 2 overlap significantly
  if (x1 < x2) {
    if (x1 + dims1[2] > x2 + allowance && x2 + dims2[2] > x1 ) return true;
  }
  else {
    if (x2 + dims2[2] > x1 + allowance && x1 + dims1[2] > x2) return true;
  }
  return false;
}

function contain(dims1, x1, dims2, x2,allowance){//return true if 1 is mostly contained by 2
  if (x1 + allowance > x2){
    if (x1 + dims1[2] < x2 + dims2[2] + allowance) return true;
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
function manageWin(){
  numWins++;
  if (numWins%5 == 0) score += 1000;
  else score += 50;
  resetFrogger();
}
function manageDeath(){
  numLives--;
  if(numLives == 0){
    isGameOver = true;
    if (score > highscore){
      highscore = score;
      localStorage["frogger_high"] = score;
    }
  }
  resetFrogger();
  
}
function resetFrogger(){
  frogx = 190;//190;
  frogRow = 12;//12;
  rowProgress = 12;
}
function collisionOnTurtleRow(){
  var rowData = rowInfo[frogRow-1];
  var logLocs = rowData.locs;
  var contained = false;
  var overlapped = false;
  var prevOverlapped = false;
  for(var i = 0; i < logLocs.length; i++){
    contained = contained || contain (frogsu, frogx, rowData.item, logLocs[i],outerWaterAllowance);
    overlapped = overlap(frogsu, frogx, rowData.item, logLocs[i],innerTurtleAllowance);
    if (overlapped&&prevOverlapped)contained = true;
    prevOverlapped = overlapped;
  }
  return !contained;
}

function collisionOnLogRow(){
  var rowData = rowInfo[frogRow-1];
  var logLocs = rowData.locs;
  var contained = false;
  for(var i = 0; i < logLocs.length; i++){
    contained = contained || contain (frogsu, frogx, rowData.item, logLocs[i], outerWaterAllowance);
  }
  return !contained;
}

function collisionInCarRow(){
  var collision;
  var rowData = rowInfo[frogRow-2];
  var carLocs = rowData.locs;
  for(var i = 0; i < carLocs.length; i++){
    collision = collision || overlap (frogsu, frogx, rowData.item, carLocs[i],carAllowance);
  }
  return collision;
}
function updateScore(){
  if (forwardMove == true){
    forwardMove = false;
    console.log(rowProgress,frogRow);
    if (rowProgress > frogRow){
      rowProgress--;
      score += 10;
    }
  }
}