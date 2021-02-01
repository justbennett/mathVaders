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

var isMobile = /Mobi|Android/i.test(navigator.userAgent);


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
var fontSize;
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
var pause;
var buttonSpacing = 28;

function setup(){
  createCanvas(windowWidth, windowHeight);
  //canv.parent("title");
  link = createA("../mathVaders", "Go Back");
  link.position(10, height-30);
  sine = new p5.Oscillator();
  sine.setType('sine');
  noise = new p5.Oscillator();
  noise.setType('sawtooth');
  buttonColor = color(78, 137, 232);
  reset();

  textSize(25);
  bottomBarY = height * 0.90;
  buttons.push(new Button('+', width/2 - buttonSpacing, height * 0.15 + buttonSpacing));
  buttons.push(new Button('-', width/2, height * 0.15 + buttonSpacing));
  buttons.push(new Button('x', width/2 + buttonSpacing, height * 0.15 + buttonSpacing));
  buttons.push(new Button('Mixed', width/2, height * 0.15 + buttonSpacing*3));
  buttons.push(new Button('Enter', width/2, height * 0.5));
  pauseButton = new Button('Pause', width * 0.33, bottomBarY + buttonSpacing);

}

function draw(){

  setAudio();
  drawScreen();

  if (scene==Screen.startScreen){
    textSize(25);
      textAlign(CENTER);
      noStroke();
      fill(255);
      text("Select Game Type", width/2, height * 0.10);    //:\n+  -  x\nMixed", width/2, 40);
      text("Type an answer, then ENTER\nto destroy invaders", width/2, height/2 - buttonSpacing*2);
      text("to Begin\n\n[q] to quit\n[s] to toggle sound\n UP and DOWN for Volume\nSPACE to pause",  width/2, height/2 + buttonSpacing*4);
      textAlign(LEFT);
      noFill();
      
      for (var i = 0; i < buttons.length ; i++){
        buttons[i].display();
    }

  }else if(scene == Screen.playScreen){
      if(!document.hasFocus())pause=true;
      showInvaders();
      textAlign(CENTER);
      noStroke();
      if(pause) text("PAUSED\n\n Press 'Pause' or SPACEBAR to continue", width/2, height/2);
      textAlign(LEFT);
      if(score >=20*level) scene = Screen.levelUpScreen;
      if(life<1) scene = Screen.gameOverScreen;
      pauseButton.display();

    }else if(scene == Screen.levelUpScreen){
      fill(255);
    textSize(25);
    noStroke();
    textAlign(CENTER);
    text("Great Job!\nENTER to Play Next Level\nScore: " + floor(cumulativeScore*100), width/2, height/2);
    textAlign(LEFT);
    }else if(scene == Screen.gameOverScreen){
    textSize(25);
    noStroke();
    textAlign(CENTER);
    text("You Lost!\nENTER to Play Again\nScore: " + floor(cumulativeScore*100), width/2, height/2);
    textAlign(LEFT);
    } 
}

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
  rect(width*7/8-100, bottomBarY + buttonSpacing*1.75, 100, 20);

  fill(255);
  rect(width*7/8-life*20, bottomBarY + buttonSpacing*1.75, life*20, 20);
  rect(10,bottomBarY + buttonSpacing*1.75, volume*100, 10);               //volume indicator

  textSize(25);
  textAlign(LEFT);
  text("VOL", 10, bottomBarY + buttonSpacing);
  if (!playFlag) text('X', 10 + textWidth("VOL"), bottomBarY + buttonSpacing);
  
  text("Score: " + floor(cumulativeScore*100), 120, bottomBarY + buttonSpacing);

  text("Life", width*7/8+10, bottomBarY + buttonSpacing*2);            //life bar
                                      
  text("Level Up", 10, 22);                        //LevelUP bars
  var scoreBar = map(score, (level-1)*20, level*20, 0, width-20);
  rect(10, 5, scoreBar, 5);

  text("Level: ",width*7/8, bottomBarY + buttonSpacing);            //Level indicator
  text(level, width*7/8+80, bottomBarY + buttonSpacing);
                          
  textAlign(CENTER);//Answer entry
  for(var i = 0; i < answerBuffer.length; i++){
  text(answerBuffer[i], width/2 +i*10, height - 20);     
  }
  textAlign(LEFT);
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
  
  if (scene == Screen.startScreen){
    for(var i=0; i < buttons.length; i++){
      if (buttons[i].isClicked()){
        if ( buttons[i].txt == "Enter"){
          
          levelUp();
        }else {
          gameType = buttons[i].txt;
        }//add other buttons here
      }
    }
  } else if (pauseButton.isClicked()){
      pause=!pause;
      if(!pause && playFlag) sine.start();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

