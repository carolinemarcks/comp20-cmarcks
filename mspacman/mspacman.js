function init(){
	canvas = document.getElementById('mspacman');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    	ctx = canvas.getContext('2d');
    	ctx.clearRect(0, 0, 1000, 500); // clear the screen
        img= new Image();
        img.src="pacman10-hp-sprite.png";
        img.onload=drawmspacman;
            	
    }else {
        alert('Sorry, canvas is not supported on your browser!');
    }


}
function drawmspacman() {
	h=window.innerHeight;
	w=window.innerWidth;

	x=(w-465)/2;
	y=(h-140)/2

                            
    ctx.drawImage(img,320,0,465,140,x,y,465,140);
    ctx.drawImage(img,0,0,20,20,x+100,y+93,19,19);
    ctx.drawImage(img,0,99,20,20,x+133,y+93,19,19);	
                             
}