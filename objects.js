function Button(txt_, x_, y_){
	this.txt = txt_;
	this.x = x_;
	this.y = y_;
	this.wide = textWidth(this.txt) + 10;
	this.high = textSize() + 10;
	this.selected = false;
	this.isDisplayed = false;
	
	this.display = function(){
		this.isDisplayed = true;
		noFill();
		stroke(255)
		rectMode(CENTER);
		if (this.selected) strokeWeight(4);
		else strokeWeight(1);
		rect(this.x, this.y, this.wide, this.high, 5);
		rectMode(CORNER);
		fill(255);
		strokeWeight(1);
		noStroke();
		textSize(fontSize);
		textAlign(CENTER, CENTER);
		text(this.txt, this.x, this.y);
	}
	
	this.isClicked = function(){
		var left = this.x - this.wide/2;
		var right = this.x + this.wide/2;
		var top = this.y - this.high/2;
		var bottom = this.y + this.high/2;

		if(mouseX > left && mouseX < right && mouseY > top && mouseY < bottom){
			this.selected = true;
			return true;
		} else {
			this.selected = false;
			return false;
		}
	}

	this.resize = function(x_, y_){
		this.x = x_;
		this.y = y_;
		this.wide = textWidth(this.txt) + 10;
		this.high = textSize() + 10;
	}
}

//-----------Text Box Object
function TextBox(txt_, x_, y_, wide_, high_){
	this.txt = txt_;
	this.x = x_;
	this.y = y_;
	this.wide = wide_;
	this.high = high_;

	this.display = function(){
		noStroke();
		fill(0,0,0,30);
		rect(this.x, this.y, this.wide, this.high);
		text(this.txt, this.x, this.y, this.wide, this.high);
	}
}
//-----------Problem Object
function Problem(x_, a_, b_, sign_){
	this.x = x_;
	this.a = a_;
	this.b = b_;
	this.y = 0;
	this.ySpeed = 1;
	this.high = textSize()*4;

	var signs = ['+','-','x'];

	if (isMobile) this.ySpeed = 5;

	if (sign_ == "Mixed") this.sign = signs[floor(random(0,2.9))];
	else this.sign = sign_;

	if(this.sign == '-'){ 
       
        if (b_>a_){
          this.a=b_;
          this.b=a_;
        }else{
          this.a = a_;
          this.b = b_;
        }
      this.product = this.a - this.b;  
    }
    else if(this.sign == '+'){
      this.a = a_;
      this.b = b_;
      this.product = this.a + this.b;
    }
    else if(this.sign == 'x'){
      this.a = a_;
      this.b = b_;
      this.product = this.a * this.b;
    }

    this.isAnswered = false;
    this.crashed = false;
	
	this.display = function(){
		fill(255);
		
		text(this.a, this.x, this.y);
		text(this.b, this.x, this.y + textSize());
		text(this.sign, this. x - textWidth(this.sign), this.y + textSize());
		stroke(255);
		line(this.x - textWidth(this.sign)*2, this.y + textSize()*1.5, this.x + textWidth(this.sign), this.y + textSize()*1.5);
		noStroke();
	}

	this.drop = function(){
		if(!this.isAnswered && !this.crashed){
			this.y += this.ySpeed;
			this.x += random(-1,1);
		}
		if (this.y > bottomBarY ){
			this.crashed = true;
		}
	}

	this.check = function(answer_){
		if (answer_ == this.product){
			isAnswered = true;
			return true;
		} else {
			return false;
		}
	}
}

/* Should I have a scene object?
function Scene(){

}
*/