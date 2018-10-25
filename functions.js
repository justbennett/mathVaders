//------------Functions---------------
function setAudio(){
   sine.amp(volume);
   noise.amp(volume);
   if(scene==Screen.startScreen || pause){
     sine.stop();
   }

   if(scene==Screen.playScreen && !pause){
     note+=100;
     if(note>1000) note = 10;
   
      sine.freq(note+score*10);
      var i = sin(millis()*0.01);
      sine.pan(i);
   }
   if(scene==Screen.levelUpScreen){
     note+=10;
     sine.freq(note);
     if(note>1000){
       sine.stop();
     }
   }
   if(scene==Screen.gameOverScreen){
      note-=10;
      sine.freq(note);
      if(note<10){
        sine.stop();
        
      }
   }
}

function reset(){
//remove all invaders
	for (var i = invaders.length; i >= 0; i--){
		invaders.pop();
	}

//add an invader per level
	for (var i = 0; i <= level; i++){
		makeInvader();
	}

	level=0;
	score=0;
	life=5;
	showMiss=-1;
	sine.stop();
	noise.stop();
	scene = Screen.startScreen;
	pause = false;
	cumulativeScore=0;
}

function levelUp(){

	noise.stop();
	sine.stop();
	if (playFlag) sine.start();
	sine.amp(volume);
	level++;
	life = 5;
	scene = Screen.playScreen;

	if(level > 2) {
		makeInvader();
	}
}


function drawScreen(){
    background(5,95,50);
    noStroke();
	fill(10,40,70);
	rect(0,0,width, bottomBarY);

	rect(10,bottomBarY + buttonSpacing*1.75, 100, 10);               //volume indicator
	rect( width*7/8-100, bottomBarY + buttonSpacing*1.75, 100, 20); //Life container

	fill(255);
	rect(10,bottomBarY + buttonSpacing*1.75, volume*100, 10);               //volume indicator

	textSize(fontSize);
	textAlign(LEFT);
	text("VOL", 10, bottomBarY + buttonSpacing);
	if (!playFlag) text('X', 10 + textWidth("VOL"), bottomBarY + buttonSpacing);
	
	text("Score: " + floor(cumulativeScore*100), 120, bottomBarY + buttonSpacing);
	text("Game Type: " + gameType, 120, bottomBarY + buttonSpacing*2);
			                                  
	text("Level Up", 10, 30);                        //LevelUP bars
	var scoreBar = map(score, (level-1)*20, level*20, 0, width-20);
	rect(10, 5, scoreBar, 5);

	textAlign(LEFT);
	text("Level: " + level.toString(), width*7/8, bottomBarY + buttonSpacing);            //Level indicator
	text("Life", width*7/8+10, bottomBarY + buttonSpacing*2);            //life bar
	rect(width*7/8-life*20, bottomBarY + buttonSpacing*1.75, life*20, 20);

                      
	textAlign(CENTER);//Answer entry
	for(var i = 0; i < answerBuffer.length; i++){
	text(answerBuffer[i], width/2 +i*10, height - 20);     
	}
	textAlign(LEFT);
}

function sizeEveryThing(){
	resizeCanvas(windowWidth, windowHeight);
 
	fontSize = height*0.05;
	textSize(fontSize);
	padding = 10;
	buttonSpacing = textSize() + padding;
	buttonBoxX = width * 0.1 + textWidth("Select Game Type:") + buttonSpacing + padding;
	bottomBarY = height - (buttonSpacing * 3);

	buttons[0].resize( buttonBoxX, buttonSpacing * 3);
	buttons[1].resize( buttonBoxX + buttonSpacing * 1, buttonSpacing * 3);
	buttons[2].resize( buttonBoxX + buttonSpacing* 2, buttonSpacing * 3);
	buttons[3].resize( buttonBoxX + buttonSpacing * 1, buttonSpacing * 4 + padding);
	
	buttons[4].resize( width/2, height * 0.5);
	buttons[5].resize(width * 0.33, bottomBarY + buttonSpacing);

}

function getAnswer(){  //This seems convoluted. Find a better solution
  var multiplier=1;
  var answerHolder=0;
    for (var i = answerBuffer.length-1; i >=0; i--){
      answerHolder+=(answerBuffer[i]*multiplier);
      multiplier*=10;
      print(answerHolder);
    }
    print(answer);
    var digits = answerBuffer.length;
    for (var i = 0; i < digits; i++){
      answerBuffer.pop();;
    }
    answer=answerHolder;
}

function makeInvader() {

	var invaderWidth = textSize()*3;
	invaders.push(new Problem(random(invaderWidth, width-invaderWidth), floor(random(0,6+level)), floor(random(0,6+level)), gameType));

}

function showInvaders(){
	for (var i = 0; i < invaders.length; i++){
		invaders[i].display();
		if(!pause) invaders[i].drop();

		if(invaders[i].crashed){
	  		invaders.splice(i,1); //remove the invader
	  		makeInvader();
        	showMiss = invaders[i].Product;
        	score--;
        	life--;

	      		if (playFlag){
	      			noise.start();
	      			noise.amp(volume);
	      			for (var j = 450; j > 300; j--){
	      				noise.freq(j);
	      				//setTimeout(function(){},1);
	      			}
	      			noise.stop();
	      		}

	    } else if (invaders[i].check(answer)) { //if not crashed, but answered
	    	invaders.splice(i,1); //remove the invader
			makeInvader();
      		score++;
      		cumulativeScore+=(height-invaders[i].y)/1000;
	      	if(playFlag){
	   			noise.start();
	   			noise.amp(volume);
      			for (var j = 600; j < 650; j++){
      					noise.freq(j);
	      				//setTimeout(function(){},1);
	      			}
	      		noise.stop();
	      	}
     
      	}//if
	}//For
}


