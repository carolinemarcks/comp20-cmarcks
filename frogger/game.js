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
    setInterval(updateGame, 50);
  }else {
    alert('Sorry, canvas is not supported on your browser!');
  }
}

function drawBoard(){
  ctx.clearRect(0, 0, 565, 399);
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
  	drawRow(rowData.locs, rowData.item, rowData.offset,i);
  }
  
  if(ladyFrogState == 1){
    drawFrog(frogx,rowDims[frogRow],ladyFrog,true);
  } else {
    if (ladyFrogState == 0){
      drawFrog(ladyFrogx,rowDims[ladyFrogRow],ladyFrog,true);
    }
    drawFrog(frogx,rowDims[frogRow],frogsu,false);
  }
}

function drawRow(itemLoc,spriteLoc,verticalOffset,row){
  for(var i = 0; i < itemLoc.length; i++){ 
    if(itemLoc[i] > (0-spriteLoc[2]) && itemLoc[i] < 399){
      ctx.drawImage(img,spriteLoc[0],spriteLoc[1],spriteLoc[2],spriteLoc[3],
      itemLoc[i],verticalOffset,spriteLoc[2],spriteLoc[3]);
      if(row == 1){
    
      }
    }
  }
}

/*function drawFrog(frogstate,rotate){
  if(rotate){
    console.log("whert");
    var w = frogstate[2];
    var h = frogstate[3];
    x = frogx;
    y = rowDims[frogRow];
 
    // save state
    ctx.save();
    // set screen position
    ctx.translate(x, y);
    // set rotation
    ctx.rotate(Math.PI);

    // draw image to screen drawImage(imageObject, sourceX, sourceY, sourceWidth, sourceHeight,
    // destinationX, destinationY, destinationWidth, destinationHeight)
    ctx.drawImage(imageObject, 0, 0, w, h, -w/2, -h/2, w, h);
    // restore state
    ctx.restore();
  }
  else{
    ctx.drawImage(img,frogstate[0],frogstate[1],frogstate[2],frogstate[3],frogx,
      rowDims[frogRow],frogstate[2],frogstate[3]);
  }
  
}*/
function drawFrog(x,y,frogstate,rotate){

  var sourceX = frogstate[0];
  var sourceY = frogstate[1];
  var w = frogstate[2];
  var h = frogstate[3];
  if(rotate){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI*3/2);
    ctx.drawImage(img, sourceX, sourceY, w, h, -w, 0, w, h);
    ctx.restore();
  }else
  ctx.drawImage(img,sourceX, sourceY,w,h,x,y,w,h);
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
  ladyFrogx = -200;
  ladyFrogRow = 3;
  ladyFrogState = 0; //0 = alone 1 = with otherfrog
  numLives = 3;
  isGameOver = false;
  level = 1;
  numWins = 0;
  time = 0;
  speeds=[2,3,-2,-3];
  
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
  rowInfo = [{'locs':row1LogLocs,'speed':0,'item':medLog,'offset':greenblock[3]+40,'cycle':530},
	         {'locs':row2TurtleLocs,'speed':2,'item':turtle1,'offset':greenblock[3]+75,'cycle':630},
	         {'locs':row3LogLocs,'speed':1,'item':bigLog,'offset':greenblock[3]+110,'cycle':740},
	         {'locs':row4LogLocs,'speed':0,'item':smallLog,'offset':greenblock[3]+145,'cycle':490},
	         {'locs':row5TurtleLocs,'speed':3,'item':turtle1,'offset':greenblock[3]+180,'cycle':475},
	         {'locs':row7CarLocs,'speed':2,'item':truck6,'offset':greenblock[3]+265,'cycle':465},
	         {'locs':row8CarLocs,'speed':1,'item':car7,'offset':greenblock[3]+300,'cycle':450},
	         {'locs':row9CarLocs,'speed':3,'item':car8,'offset':greenblock[3]+335,'cycle':460},
	         {'locs':row10CarLocs,'speed':0, 'item':car9_1,'offset':greenblock[3]+370,'cycle':495},
	         {'locs':row11CarLocs,'speed':2, 'item':car10,'offset':greenblock[3]+405,'cycle':505}];

  carAllowance = 6;
  turtleOverlapAllowance = -30;
  turtleContainmentAllowance = 20;
  logAllowance = 6;
  
  
  flyLoc = 3;
  flyVisibile = false;
  score = 0;
  highscore = localStorage["frogger_high"]
  if (highscore == null)highscore = 0;
  rowProgress = 12;
  forwardMove = false;
  rowDims = [60,98,130,167,200,235,280,320,360,395,428,465,500];
  winLocs = [[6,21],[91,105],[176,191],[259,276],[346,359]];
}

function initSpriteVars(){
  //all image locs stored by x,y,width,height
  bigLog = [4,164,184,24];
  medLog = [4,196,120,24];
  smallLog = [4,230,90,20];
  turtle1 = [12,406,35,25];
  truck6 = [100,300,54,22];
  car7 = [44,262,32,29];
  car8 = [7,264,33,25];
  car9_1 = [6,298,34,25];
  car10 = [80,262,29,29];
  frogger = [9,8,332,40];
  frogsr = [8,332,27,26];//small right
  frogsu = [10,366,27,25];//small up
  ladyFrog = [237,408,20,24];

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
      if (speeds[rowData.speed] > 0 && 399 < locs[j]) locs[j] -= (cycle);
      if (speeds[rowData.speed] < 0 && 0 - width > locs[j]) locs[j] += (cycle);
      locs[j]+=speeds[rowData.speed];
    }
  }
  updateFrogLoc();
  checkCollisions();
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

function checkCollisions(){
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
  if (ladyFrogRow==frogRow && overlap(ladyFrog,ladyFrogx, frogsu, frogx, 0)) ladyFrogState = 1;
  
  if (collision || frogx < 0 || frogx > 380){
    manageDeath();
  }  
}

function overlap(dims1, x1, dims2, x2, allowance){//return true if 1 and 2 overlap significantly
 // console.log("overlap",x1,x2);
  if (x1 < x2) {
    if (x1 + dims1[2] > x2 + allowance && x2 + dims2[2] > x1 ) return true;
   // console.log("A",x1+dims1[2],x2+allowance,x2+dims2[2], x1)
  }
  else {
    if (x2 + dims2[2] > x1 + allowance && x1 + dims1[2] > x2) return true;
   // console.log("B",x2+dims2[2],x1+allowance,x1+dims1[2], x2)
  }
  return false;
}

function contain(dims1, x1, dims2, x2,allowance){//return true if 1 is mostly contained by 2
  console.log("contain",x1,x2);
  if (x1 + allowance > x2){
    console.log(x2+dims2[2]+allowance,x1+dims1[2], "x2:",x2,"width:",dims2[2],"x1",x1,"width",dims1[2]);
    if (x1 + dims1[2] < x2 + dims2[2] + allowance) return true;
    
  }
  return false;
}

function updateGame(){
  if (!isGameOver) updateBoard();
}
function updateFrogLoc(){
  if (frogRow > 0 && frogRow < 6){
    var speed = speeds[rowInfo[frogRow-1].speed];
    frogx += speed;
  }
  var lspeed = speeds[rowInfo[ladyFrogRow-1].speed];
  ladyFrogx += lspeed;

}


function manageWin(){
  numWins++;
  if (numWins%5 == 0){
    score += 1000;
    level++;
    speeds[0]++;
    speeds[1]++;
    speeds[2]--;
    speeds[3]--;
  }
  else score += 50;
  
  if (ladyFrogState == 1) score +=200;
  
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
  var itemLoc = row2TurtleLocs;
  for(var i = 0; i < row2TurtleLocs.length; i++){
        /*ctx.moveTo(itemLoc[i], 10);
        ctx.strokeStyle = "red";
        ctx.lineTo(itemLoc[i], 190);
        ctx.stroke();
        ctx.moveTo(itemLoc[i]+turtle1[2], 10);
        ctx.strokeStyle = "green";
        ctx.lineTo(itemLoc[i]+turtle1[2], 190);
        ctx.stroke();*/
  }    
  ctx.strokeStyle = "blue";
  ctx.moveTo(frogx, 10);
  ctx.lineTo(frogx,190);
  ctx.stroke()
  ctx.moveTo(frogx+frogsu[2], 10);
  ctx.lineTo(frogx+frogsu[2],190);
  exit();
  resetFrogger(); 
}
function resetFrogger(){
  frogx = 190;//190;
  frogRow = 12;//12;
  rowProgress = 12;
  if (ladyFrogState == 1) ladyFrogState = 2;
}
function collisionOnTurtleRow(){
  var rowData = rowInfo[frogRow-1];
  var logLocs = rowData.locs;
  var contained = false;
  var overlapped = false;
  var prevOverlapped = false;
  var frog;
  if(ladyFrogState == 1) frog = ladyFrog;
  else frog = frogsu;
  for(var i = 0; i < logLocs.length; i++){
    contained = contained || contain (frog, frogx, rowData.item, logLocs[i],turtleContainmentAllowance);
    overlapped = overlap(frog, frogx, rowData.item, logLocs[i],turtleOverlapAllowance);
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
    contained = contained || contain (frogsu, frogx, rowData.item, logLocs[i], logAllowance);
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
    if (rowProgress > frogRow){
      rowProgress--;
      score += 10;
    }
  }
}