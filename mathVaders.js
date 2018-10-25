var title = "MathVaders";
var description = "Kill the incoming alien invaders by solving their math problems.";

//document.getElementById("sketchTitle").innerHTML = title;
//document.getElementById("sketchDescription").innerHTML = description;
/*
Features to add:

Quit Button
Sound Button
High scores
Sign in
Level Save
Better fonts and icons
Landscape decoration
Keyboard for tap devices

*/
function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

dynamicallyLoadScript("functions.js");
dynamicallyLoadScript("objects.js");

var sine;
var noise;

var Screen = {"startScreen" : 1,
					"playScreen" : 2,
					"levelUpScreen" : 3,
					"gameOverScreen" : 4
				}
Object.freeze(Screen);

var gameType = '+';
var invaders = [];

var answerBuffer = [];
var answer;
var showMiss=-1;
var signs = ['+','-','x'];

var score = 0;
var cumulativeScore;
var level = 0;
var life = 5;
var screen = Screen.startScreen;

var note= 300;                  //Holds the freqency for sound
var playFlag = true;          //Set to false to mute
var pause = false;            //Set to true to pause
var volume=0.1;                 //Sets the amp() of sounds

var bottomBarY;
var buttons = [];
var buttonSpacing;
var fontSize;
var padding;
var buttonBoxX;

function setup(){
	createCanvas(windowWidth, windowHeight);
	//canv.parent("title");
	sine = new p5.Oscillator();
	sine.setType('sine');
	noise = new p5.Oscillator();
	noise.setType('sawtooth');
	buttonColor = color(78, 137, 232);
	reset();

	var plus = new Button('+', 0,0);
	var minus = new Button('-', 0,0);
	var times = new Button('x', 0,0);
	var mixed = new Button('Mixed', 0,0);
	var begin= new Button('BEGIN', 0,0);
	var pauseButton = new Button('Pause', width * 0.33, bottomBarY + buttonSpacing);
	var quit = new Button('Quit', width * 0.33, bottomBarY + buttonSpacing *2);
	buttons = [plus, minus, times, mixed, begin, pauseButton, quit];

	sizeEveryThing();
}

function draw(){

	setAudio();
	drawScreen();
    for (var i = 0; i < buttons.length ; i++){ //Display all buttons marked display
	    if (buttons[i].isDisplayed) buttons[i].display();
	}

	if (scene==Screen.startScreen){
		textSize(fontSize);
	    textAlign(LEFT);
	    noStroke();
	    fill(255);
	    text("Select Game Type:", width * 0.1, buttonSpacing * 3);    //:\n+  -  x\nMixed", width/2, 40);
	    text("Type an answer then ENTER\nto destroy invaders", width * 0.1, buttonSpacing*6);
	    text("[q] to quit\n[s] to toggle sound\n UP and DOWN for Volume\nSPACE to pause",  width * 0.1, buttonSpacing*10);
	    noFill();
	    

	    for (var i = 0; i < 5 ; i++){
		    buttons[i].isDisplayed = true;
		}

	}else if(scene == Screen.playScreen){
		for (var i = 0; i < 5 ; i++){
		    buttons[i].isDisplayed = false;
		}
		buttons[5].isDisplayed = true;
		buttons[6].isDisplayed = true;
		
	    if(!document.hasFocus())pause=true;
	    showInvaders();
	    textAlign(CENTER);
	    noStroke();
	    if(pause) text("PAUSED\n\n Press 'Pause' or SPACEBAR to continue", width/2, height/2);
	    textAlign(LEFT);
	    if(score >=20*level) scene = Screen.levelUpScreen;
	    if(life<1) scene = Screen.gameOverScreen;
	    buttons[5].display();

  	}else if(scene == Screen.levelUpScreen){
  		fill(255);
		textSize(fontSize);
		noStroke();
		textAlign(CENTER);
		text("Great Job!\nENTER to Play Next Level\nScore: " + floor(cumulativeScore*100), width/2, height/2);
		textAlign(LEFT);
   	}else if(scene == Screen.gameOverScreen){
		textSize(fontSize);
		noStroke();
		textAlign(CENTER);
		text("You Lost!\nENTER to Play Again\nScore: " + floor(cumulativeScore*100), width/2, height/2);
		textAlign(LEFT);
    } 
}

//----------------Input functions----------------------
function keyPressed(){
	if (keyCode == UP_ARROW) volume+=0.05;
	if (keyCode == DOWN_ARROW) volume-=0.05;
	volume = constrain(volume, 0, 1);
	sine.amp(volume);
	noise.amp(volume);
  
  if (keyCode >= 48 && keyCode <= 57 && !pause){ 
    answerBuffer.push(keyCode -48);
    print(answerBuffer);
  }

    if (keyCode >= 96 && keyCode <= 105 && !pause){ //The keypad isn't working for some reason
    answerBuffer.push(keyCode -96);
    print(answerBuffer);
  }

  if (key == '\n' || key == '\r' ){
    if (scene==Screen.levelUpScreen || scene==Screen.startScreen) levelUp();
    if (scene==Screen.gameOverScreen)reset();
    if (scene==Screen.playScreen && !pause) getAnswer(); 
  }
  if (key == ' ' && scene == Screen.playScreen){
    pause=!pause;
    if(!pause && playFlag) sine.start();
  }
  if (key == 's' || key == 'S'){
    playFlag = !playFlag;
    if (!playFlag){
      sine.stop();
    }
    else{
      sine.start();
      sine.amp(volume);
    }
  }
  if (key == 'q' || key == 'Q') reset(); 
}

function mouseClicked() {
	
	//if (scene == Screen.startScreen){
	for(var i=0; i < buttons.length; i++){
		if (buttons[i].isClicked() && buttons[i].isDisplayed){
			if ( buttons[i].txt == "BEGIN"){
				levelUp();
			}else if (buttons[i].txt == "Pause"){
				console.log('pause');
				pause=!pause;
		 		if(!pause && playFlag) {
		 			sine.start();
		 		}
		 		
		 		//add other buttons here
			}else {
				gameType = buttons[i].txt;
			}		
		}
	}
}

function windowResized() {
	sizeEveryThing();
}

