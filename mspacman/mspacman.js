function drawmspacman() {
            canvas = document.getElementById('mspacman');
            if (canvas.getContext) {
                ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 600, 600); // clear the screen
            	img =  new Image();
            	img.src="pacman10-hp-sprite.png"
            	ctx.drawImage(img,320,0,465,140,0,0,465,140);
            	ctx.drawImage(img,0,0,20,20,100,93,19,19);
            	ctx.drawImage(img,0,99,20,20,133,93,19,19);	
            }
            else {
                alert('Sorry, canvas is not supported on your browser!');
            }
}
