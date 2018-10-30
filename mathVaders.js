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

var instructions; 

var isMobile = /Mobi|Android/i.test(navigator.userAgent);

if(!isMobile){
var sine;
var noise;
}

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

var column;
var row;
var bottomBarY;
var buttons = [];
var kepad = [];
var buttonSpacing;
var fontSize;
var padding;
var buttonBoxX;
var myCanvas;

function setup(){
	 myCanvas = createCanvas(windowWidth, windowHeight);
	myCanvas.style.width = '100%';
		myCanvas.style.height = '100%';
	column = width/10;
	row = height /50;
	//canv.parent("title");
	if (!isMobile){
		sine = new p5.Oscillator();
		sine.setType('sine');
		noise = new p5.Oscillator();
		noise.setType('sawtooth');
	}

	buttonColor = color(78, 137, 232);
	reset();

	var plus = new Button('+', 0,0);
	var minus = new Button('-', 0,0);
	var times = new Button('x', 0,0);
	var mixed = new Button('Mixed', 0,0);
	var begin= new Button('BEGIN', 0,0);
	var pauseButton = new Button('Pause', 0,0);
	var quit = new Button('Quit', 0,0);
		buttons = [plus, minus, times, mixed, begin, pauseButton, quit];

	var enter = new Button('Enter', width/2, bottomBarY + buttonSpacing*2 + padding);
	for (var i = 0; i < 10; i++){
		kepad.push(new Button(i, (width/2) + i*buttonSpacing, bottomBarY + buttonSpacing));
	}
	kepad.push(enter);
	sizeEveryThing();
	instructions = createDiv("Select Game Type: </br></br></br></br></br></br> Type and answer then ENTER to destroy invaders</br></br></br>[q] to quit </br>[s] to toggle sound</br>UP and DOWN for Volume</br>SPACE to pause");

	instructions.style("width", "300");
	instructions.style("color", "white");
	instructions.style("background-color", "#ffffff1f");
	instructions.style("font-family", "arial");
	instructions.style("border", "1px solid white");
	instructions.style("border-radius", "10px");
	instructions.style("padding", "10px");
	instructions.position(width * 0.11, buttonSpacing * 2);
	
}

function draw(){

	setAudio();
	drawScreen();

	for (var i = 0; i < kepad.length; i++){
		kepad[i].display();
	}

    for (var i = 0; i < buttons.length ; i++){ //Display all buttons marked display
	    if (buttons[i].isDisplayed) buttons[i].display();
	}

	if (scene==Screen.startScreen){
		/*var instructionsBox = new TextBox(column *2, row * 4, 1,1);
		textSize(fontSize);
	    textAlign(LEFT);
	    noStroke();
	    fill(255);
	    text("Select Game Type:", width * 0.1, buttonSpacing * 3);    //:\n+  -  x\nMixed", width/2, 40);
	    text("Type an answer then ENTER\nto destroy invaders", width * 0.1, buttonSpacing*6);
	    text("[q] to quit\n[s] to toggle sound\n UP and DOWN for Volume\nSPACE to pause",  width * 0.1, buttonSpacing*10);
	    noFill();*/
	    
	    for (var i = 0; i < 5 ; i++){
		    buttons[i].isDisplayed = true;
		}

	}else if(scene == Screen.playScreen){
		instructions.style("display", "none");
	
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
		buttons[6].display();
    } 
}

//----------------Input functions----------------------
function keyPressed(){
	if (!isMobile){
		if (keyCode == UP_ARROW) volume+=0.05;
		if (keyCode == DOWN_ARROW) volume-=0.05;
		volume = constrain(volume, 0, 1);
		sine.amp(volume);
		noise.amp(volume);
	}
  
  if (keyCode >= 48 && keyCode <= 57 && !pause){ 
    answerBuffer.push(keyCode -48);
    print(answerBuffer);
  }

    if (keyCode >= 96 && keyCode <= 105 && !pause){ 
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
    if(!pause && playFlag && !isMobile) sine.start();
  }
  if (key == 's' || key == 'S'){
    playFlag = !playFlag;
    if (!playFlag && !isMobile){
      sine.stop();
    }
    else if (!isMobile){
      sine.start();
      sine.amp(volume);
    }
  }
  if (key == 'q' || key == 'Q') {
  	instructions.style("display", "block");
	reset(); 
  }
}

function mouseClicked() {
	
	for(var i=0; i < buttons.length; i++){
		if (buttons[i].isClicked() && buttons[i].isDisplayed){
			if ( buttons[i].txt == "BEGIN"){
				levelUp();
			}else if (buttons[i].txt == "Pause"){
				console.log('pause');
				pause=!pause;
		 		if(!pause && playFlag && !isMobile) {
		 			sine.start();
		 		}
			}//add other buttons here
			else if (buttons[i].txt == "Quit"){
				console.log('quit');
				instructions.style("display", "block");
				reset();
			}else {
				gameType = buttons[i].txt;
			}		
		}
	}

	for(var i = 0; i < kepad.length; i++){
		if (kepad[i].isClicked()){
			if (kepad[i].txt == "Enter"){
				getAnswer();
			} else {
				answerBuffer.push(i);
			}
		}
	}
}

function windowResized() {
	sizeEveryThing();
}
