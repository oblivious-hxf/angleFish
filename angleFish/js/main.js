var canvas1,canvas2,context1,context2,lastTime = 0,deltaTime=0,ane,fruit,fishMom,fishBaby,data,dust;
var canWidth,canHeight,mouseX,mouseY,wave;
var bgPic=new Image();
var babyTail=[],momTail=[],babyEye=[],momEye=[],babyBody=[],momBodyOrange=[],momBodyBlue=[],momEatOrange=[],momEatBlue=[],dustImage=[];

var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;

var prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
for( var i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
}

//如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime();
      //为了使setTimteout的尽可能的接近每秒60帧的效果
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ); 
      var id = window.setTimeout( function() {
        callback( currTime + timeToCall );
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };
    
    cancelAnimationFrame = function( id ) {
      window.clearTimeout( id );
    };
}

//得到兼容各浏览器的API
window.requestAnimationFrame = requestAnimationFrame; 
window.cancelAnimationFrame = cancelAnimationFrame;


document.body.onload=game;


function game(){
	initial();
	lastTime=Date.now();
	gameloop();
}


function initial(){
	canvas1=document.getElementById("canvas1");  //fish.ui.dust.circle
	canvas2=document.getElementById("canvas2");  //background,haikui,fruits
	if(canvas1.getContext){
		context1=canvas1.getContext("2d");
		context2=canvas2.getContext("2d");
}
    

    canvas1.addEventListener('mousemove',onMouseMove,false);
    context1.font="20px Verdana";
	context1.taxtAlign="center";

	bgPic.src="./src/background.jpg";
	canWidth=canvas1.width;
	canHeight=canvas1.height;

	ane=new aneObject();
	ane.initial();
	fruit=new fruitObject();
	fruit.initial();
	fishMom=new fishMomObject();
	fishMom.initial();
	
	

	mouseX=canWidth*0.5;
	mouseY=canHeight*0.5;

	for (var i =0; i < 8; i++) {
		babyTail[i]=new Image();
		babyTail[i].src="./src/babyTail"+i+".png";
	}

	for (var i = 0; i < 8; i++) {
		momTail[i]=new Image();
		momTail[i].src="./src/bigTail"+i+".png";
	}

	for (var i =0; i < 2; i++) {
		babyEye[i]=new Image();
		babyEye[i].src="./src/babyEye"+i+".png";
	}

	for (var i = 0; i < 2; i++) {
		momEye[i]=new Image();
		momEye[i].src="./src/bigEye"+i+".png";
	}

	for (var i =0; i < 20; i++) {
		babyBody[i]=new Image();
		babyBody[i].src="./src/babyFade"+i+".png";
	}

	for (var i = 0; i < 8; i++) {
		momBodyOrange[i]=new Image();
		momBodyOrange[i].src="./src/bigSwim"+i+".png";
		momBodyBlue[i]=new Image();
		momBodyBlue[i].src="./src/bigSwimBlue"+i+".png";
	}

	for (var i = 0; i < 8; i++) {
		momEatOrange[i]=new Image();
		momEatOrange[i].src="./src/bigEat"+i+".png";
		momEatBlue[i]=new Image();
		momEatBlue[i].src="./src/bigEatBlue"+i+".png";
	}


	for (var i = 0; i < 7; i++) {
		dustImage[i]=new Image();
		dustImage[i].src="./src/dust"+i+".png";
	}

	fishBaby=new fishBabyObject();
	fishBaby.initial();
	data=new dataObject();

	wave=new waveObject();
	wave.initial();
	dust=new dustObject();
	dust.initial();


}


function onMouseMove(e){

	if (e.offSetX||e.layerX) {

		mouseX = e.layerX||e.offSetX;
		mouseY = e.layerY||e.offSetY;
	}
}


function gameloop(){
	requestAnimationFrame(gameloop);
	var nowTime=Date.now();
	deltaTime=nowTime-lastTime;
	lastTime=nowTime;
	if (deltaTime>40) {deltaTime=40;}

	drawBackground();
	ane.draw();
	fruitMonitor();
	fruit.draw();

	context1.clearRect(0,0,canWidth,canHeight);
	fishEatFruit();
	fishMom.draw();
	fishBaby.draw();
	data.draw();
	momFeedBaby();
	wave.draw();
	dust.draw();
}


function drawBackground(){
	context2.drawImage(bgPic,0,0,canWidth,canHeight);
}


//------------------ane---draw----------

var aneObject=function(){
	this.rootx=[];
	this.headx=[];
	this.heady=[];
	this.amp=[];
	this.alpha=0;
}

aneObject.prototype.num=50;
aneObject.prototype.initial=function(){
	for (var i = this.num; i >= 0; i--) {
		this.rootx[i]=i*16+Math.random()*20;
		this.heady[i]=canHeight-200+Math.random()*50;
		this.amp[i]=Math.random()*50+40;
	}
}

aneObject.prototype.draw=function(){
	this.alpha+=deltaTime*0.0008;
	var l=Math.sin(this.alpha);
	context2.save();
	context2.globalAlpha=0.6;
	context2.lineWidth=20;
	context2.lineCap="round";
	context2.strokeStyle="#3b154e";
	for (var i = this.num; i >= 0; i--) {
		
		context2.beginPath();
		context2.moveTo(this.rootx[i],canHeight);
		this.headx[i]=this.rootx[i]+l*this.amp[i]
		context2.quadraticCurveTo(this.rootx[i],canHeight-100,this.headx[i],this.heady[i]);
		context2.stroke();
	}
	context2.restore();
}


//----------------fruit-----draw-------

var fruitObject=function(){
	this.alive=[];//boolean
	this.x=[];
	this.y=[];
	this.l=[];
	this.speed=[];
	this.aneID=[];
	this.fruitType=[];//orange||blue
	this.orange=new Image();
	this.blue=new Image();
}

fruitObject.prototype.num=30;
fruitObject.prototype.initial=function(){
	for (var i = this.num; i >= 0; i--) {
		this.alive[i]=false;
		this.x[i]=0;
		this.y[i]=0;
		this.l[i]=0;
		this.aneID[i]=0;
		this.speed[i]=Math.random()*0.015+0.003;

	}
	this.orange.src="./src/fruit.png";
	this.blue.src="./src/blue.png";
}

fruitObject.prototype.draw=function(){
	for (var i = this.num; i >= 0; i--) {
		//draw
		//find a ane,grow,fly up
		
		if (this.alive[i]) {

			if (this.fruitType[i]=="orange") {
				var pic=this.orange;
			}
			else{
				var pic=this.blue;
			}

		   if (this.l[i]<=15) {
		   	var No=this.aneID[i];
		   	this.x[i]=ane.headx[No];
		   	this.y[i]=ane.heady[No];
			this.l[i]+=this.speed[i]*deltaTime;
		                      }
		   else{
			this.y[i]-=this.speed[i]*7*deltaTime;
		       }
		
		context2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
		   if (this.y[i]<10) {
		   this.alive[i]=false;
	       }
	}
	}
	}

fruitObject.prototype.born=function(i){
	this.aneID[i]=Math.floor(Math.random()*ane.num);
	this.x[i]=ane.headx[this.aneID[i]];
	this.y[i]=ane.heady[this.aneID[i]];
	this.alive[i]=true;
	var ran =Math.random()*100;
	if (ran<92) {
		this.fruitType[i]="orange";
	}
	else{
		this.fruitType[i]="blue";
	}
	
}


fruitObject.prototype.dead=function(i){
	this.alive[i]=false;

}


function fruitMonitor(){

	var num=0;
	for (var i = fruit.num; i >= 0; i--) {
		if (fruit.alive[i])  num++;
		}

	if(num<15){
		//born fruit
		sendFruit();
		return;
	}
}


function sendFruit(){

	for (var i = fruit.num; i >= 0; i--) {
		if(!fruit.alive[i]){
			fruit.born(i);
			return;
		}
	}
}


//------------fish---------draw----------


var fishMomObject=function(){
	this.x=[];
	this.y=[];
	this.angle=-1;
	this.fishMomEye=new Image();
	this.fishMomBody=new Image();
	this.fishMomTail=new Image();

	this.momTailTime=0;
	this.momTailCount=0;

	this.momEyeTime=0;
	this.momEyeCount=0;
	this.momEyeInterval=1000;

	this.momBodyCount=0;
	this.eatState=false;
}

fishMomObject.prototype.initial=function(){
	this.x=canWidth*0.5;
	this.y=canHeight*0.5;
	this.angle=0;
	this.eatState=false;
}

fishMomObject.prototype.addMomBodyCount=function(){
	this.momBodyCount=data.eatFruitNum;
	if (this.momBodyCount>7) {
		this.momBodyCount=7;
	}
}

fishMomObject.prototype.draw=function(){

    //move to (x,y)
    this.x=lerpDistance(mouseX,this.x,0.98);
    this.y=lerpDistance(mouseY,this.y,0.98);

    //fish angle   Math.atan2(y,x)
    
    var diffX=mouseX-this.x;
    var diffY=mouseY-this.y;
    var atanValue=Math.atan2(diffY,diffX)+Math.PI;

    this.angle=lerpAngle(atanValue,this.angle,0.8);


    this.momTailTime+=deltaTime;
    if (this.momTailTime>50) {
    	this.momTailCount=(this.momTailCount+1)%8;
    	this.momTailTime%=50;
    }

    this.momEyeTime+=deltaTime;
    if (this.momEyeTime>this.momEyeInterval) {
    	this.momEyeCount=(this.momEyeCount+1)%2;
    	this.momEyeTime%=this.momEyeInterval;
    	if (this.momEyeCount==0) {
    		this.momEyeInterval=Math.random()*1500+2000;
    	}
    	else{
    		this.momEyeInterval=200;
    	}
    }

	context1.save();
	context1.translate(this.x,this.y);
	context1.rotate(this.angle);

	var momTailCount=this.momTailCount;
	var momEyeCount=this.momEyeCount;
	var momBodyCount=this.momBodyCount;
	context1.drawImage(momTail[momTailCount],-momTail[momTailCount].width*0.5+30,-momTail[momTailCount].height*0.5);
	if (this.eatState) {
		if (data.double==1) {
		context1.drawImage(momEatOrange[momBodyCount],-momEatOrange[momBodyCount].width*0.5,-momEatOrange[momBodyCount].height*0.5);
	}
	else{
		context1.drawImage(momEatBlue[momBodyCount],-momEatBlue[momBodyCount].width*0.5,-momEatBlue[momBodyCount].height*0.5);
	}
		
	}
	else{
		if (data.double==1) {
		context1.drawImage(momBodyOrange[momBodyCount],-momBodyOrange[momBodyCount].width*0.5,-momBodyOrange[momBodyCount].height*0.5);
	}
	else{
		context1.drawImage(momBodyBlue[momBodyCount],-momBodyBlue[momBodyCount].width*0.5,-momBodyBlue[momBodyCount].height*0.5);
	}
	
	}
	
	
	context1.drawImage(momEye[momEyeCount],-momEye[momEyeCount].width*0.5,-momEye[momEyeCount].height*0.5);

	context1.restore();

}



function lerpDistance(aim,cur,ratio){    //目标位置，当前位置，百分比例

	var detal=cur-aim;
	return aim+detal*ratio;

}


function lerpAngle(a, b, t) {
	var d = b - a;
	if (d > Math.PI) d = d - 2 * Math.PI;
	if (d < -Math.PI) d = d + 2 * Math.PI;
	return a + d * t;
}


function calLength2(x1, y1, x2, y2) {
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}



//-----------fish--baby----draw-------


var fishBabyObject=function(){

	this.x;
	this.y;
	this.angle=-1;
	this.fishBabyEye=new Image();
	this.fishBabyBody=new Image();
	this.fishBabyTail=new Image();

	this.babyTailTime=0;
	this.babyTailCount=0;

	this.babyEyeTime=0;
	this.babyEyeCount=0;
	this.babyEyeInterval=1500;

	this.babyBodyTime=0;
	this.babyBodyCount=0;
}

fishBabyObject.prototype.initial=function(){
	this.x=canWidth*0.5-50;
	this.y=canHeight*0.5-50;
}

fishBabyObject.prototype.draw=function(){
    //draw in context1
    this.x=lerpDistance(fishMom.x-30,this.x,0.99);
    this.y=lerpDistance(fishMom.y-30,this.y,0.99);

    var diffBabyMomX=fishMom.x-this.x;
    var diffBabyMomY=fishMom.y-this.y;
    var angleForBabyMom=Math.atan2(diffBabyMomY,diffBabyMomX)+Math.PI;

    this.angle=lerpAngle(angleForBabyMom,this.angle,0.6);

    this.babyTailTime+=deltaTime;
    if (this.babyTailTime>50) {
    	this.babyTailCount=(this.babyTailCount+1)%8;
    	this.babyTailTime%=50;
    }


    this.babyEyeTime+=deltaTime;
    if (this.babyEyeTime>this.babyEyeInterval) {
    	this.babyEyeCount=(this.babyEyeCount+1)%2;
    	this.babyEyeTime%=this.babyEyeInterval;
    	if (this.babyEyeCount==0) {
    		this.babyEyeInterval=Math.random()*1500+2000;
    	}
    	else{
    		this.babyEyeInterval=200;
    	}
    }


    this.babyBodyTime+=deltaTime;
    if (this.babyBodyTime>500) {
    	this.babyBodyCount=this.babyBodyCount+1;
    	this.babyBodyTime%=500;
    	if(this.babyBodyCount>=19){
    		this.babyBodyCount=19;
    		//alert game over
    		data.gameOver=true;
    	}
    }

    context1.save();
    context1.translate(this.x,this.y);
    context1.rotate(this.angle);

    var babyTailCount=this.babyTailCount;
    var babyEyeCount=this.babyEyeCount;
    var babyBodyCount=this.babyBodyCount;
    context1.drawImage(babyTail[babyTailCount],-babyTail[babyTailCount].width*0.5+23,-babyTail[babyTailCount].height*0.5);
	context1.drawImage(babyBody[babyBodyCount],-babyBody[babyBodyCount].width*0.5,-babyBody[babyBodyCount].height*0.5);
	context1.drawImage(babyEye[babyEyeCount],-babyEye[babyEyeCount].width*0.5,-babyEye[babyEyeCount].height*0.5);


	context1.restore();

}


//-----------mom----feed-------baby--

function momFeedBaby(){
	var momToBabyLength=calLength2(fishMom.x,fishMom.y,fishBaby.x,fishBaby.y);
	if (momToBabyLength<900&&!data.gameOver) {
		//fishBaby recovery
		if (data.eatFruitNum>0) {
			
				if (fishBaby.babyBodyCount>=data.eatFruitNum) {
					fishBaby.babyBodyCount-=data.eatFruitNum;
					fishMom.momBodyCount=0;
				    data.reset();
				}
				else  {
					data.eatFruitNum-=fishBaby.babyBodyCount;
					fishBaby.babyBodyCount=0;
					if (data.eatFruitNum-fishBady.babyBodyCount<7) {
						fishMom.momBodyCount=data.eatFruitNum-fishBady.babyBodyCount;
					}
					else{
						fish.momBodyCount=7;
					}
					data.double=1;
				}
				var c="fish";
				wave.born(fishBaby.x,fishBaby.y,c);
		}
		
	}
}


//-----------fish --eat-----fruit-------


function fishEatFruit(){
	if (!data.gameOver) {
		for (var i = fruit.num; i >= 0; i--) {
		if(fruit.alive[i]){
			//calculate distance
			
			var distanceFromFishToFruit=calLength2(fruit.x[i],fruit.y[i],fishMom.x,fishMom.y);
			if (distanceFromFishToFruit<2500) {
				fishMom.eatState=true;
			}
			if (distanceFromFishToFruit<900) {
				fruit.dead(i);
				if (data.double==1) {
				data.eatFruitNum++;
			}
			    else{
			    	data.eatFruitNum+=data.double;
			    }
			    if (fruit.fruitType[i]=="blue") {
					data.double=2;
					
				}
			    fishMom.addMomBodyCount();
			    data.getScore();
			    var c="fruit";
			    wave.born(fruit.x[i],fruit.y[i],c);
				
			}
			else{
				fishMom.eatState=false;
			}
		}
	}
	}
	
}

//------data---calculate---object---

var dataObject=function(){
	this.eatFruitNum=0;
	this.double=1;
	this.score=0;
	this.gameOver=false;
	this.alpha=0;
}

dataObject.prototype.reset=function(){
	this.eatFruitNum=0;
	this.double=1;
}

dataObject.prototype.getScore=function(){
		this.score+=10*this.double;
}

dataObject.prototype.draw=function(){
	context1.save();
	context1.shadowBlur=20;
	context1.shadowColor="white";
	context1.fillStyle="white";
	context1.fillText("水果："+this.eatFruitNum,canWidth*0.5-80,canHeight-20);
	context1.fillText("倍数："+this.double,canWidth*0.5+30,canHeight-20);
	context1.fillText("得分："+this.score,canWidth*0.5-30,30);
	if (this.gameOver) {
		    this.alpha+=deltaTime*0.001;
		    if (this.alpha>1) {this.alpha=1;}
		    context1.fillStyle="rgba(255,255,255,"+this.alpha+")";
    		context1.fillText("Game Over",canWidth*0.5-50,canHeight*0.5);
    		context1.fillText("Click to try again",canWidth*0.5-80,canHeight*0.5+50);
    		canvas1.removeEventListener('mousemove',onMouseMove,false);
    		canvas1.addEventListener('mousedown',initial,false);
    	}
    context1.restore();
}


//------------wave-----draw---------


var waveObject=function(){
	this.x=[];
	this.y=[];
	this.alive=[];
	this.radiu=[];
	this.fishOrFruit="";
}
waveObject.prototype.num=10;
waveObject.prototype.initial=function(){
	for (var i = this.num; i >= 0; i--) {
		this.alive[i]=false;
		this.radiu[i]=0;
	}
}

waveObject.prototype.draw=function(){
	context1.save();
	context1.lineWidth=2;
	context1.shadowBlur=20;
	for (var i = this.num; i >= 0; i--) {
		if(this.alive[i]){
			this.radiu[i]+=deltaTime*0.05;
			if(this.radiu[i]>50) {
				this.alive[i]=false;
				break;
			}
			var alpha=1-this.radiu[i]/50;

			//draw wave
			if (this.fishOrFruit=="fruit") {
			context1.shadowColor="white";
			context1.beginPath();
			context1.arc(this.x[i],this.y[i],this.radiu[i],0,2*Math.PI);
			context1.closePath();
			context1.strokeStyle="rgba(255,255,255,"+alpha+")";
			context1.stroke();
			}
			else{
				context1.lineWidth=3;
			context1.shadowColor="#EEEE00";
			context1.beginPath();
			context1.arc(this.x[i],this.y[i],this.radiu[i],0,2*Math.PI);
			context1.moveTo(this.x[i]+this.radiu[i]+10,this.y[i]);
			context1.arc(this.x[i],this.y[i],this.radiu[i]+10,0,2*Math.PI);
			context1.closePath();
			context1.strokeStyle="rgba(255,255,255,"+alpha+")";
			context1.stroke();
			}
			
		}
	}
	context1.restore();
}

waveObject.prototype.born=function(a,b,c){
	for (var i = this.num; i >= 0; i--) {
		if(!this.alive[i]){
			//born
			this.alive[i]=true;
			this.radiu[i]=10;
			this.x[i]=a;
			this.y[i]=b;
			this.fishOrFruit=c;
			return;
		}
	}
}


//-----------dust-------draw-----------


var dustObject=function(){
	this.x=[];
	this.y=[];
	this.amp=[];
	this.No=[];
	this.alpha=0;
}
dustObject.prototype.num=23;
dustObject.prototype.initial=function(){
	for (var i = this.num; i >= 0; i--) {
		this.x[i]=Math.random()*canWidth;
		this.y[i]=Math.random()*canHeight;
		this.amp[i]=23+Math.random()*39;
		this.No[i]=Math.floor(Math.random()*7);
	}
	this.alpha=0;
}

dustObject.prototype.draw=function(){
	this.alpha+=deltaTime*0.0008;
	var l=Math.sin(this.alpha);
	
    for (var i = this.num; i >= 0; i--) {
    	var No=this.No[i];
    	context1.drawImage(dustImage[No],this.x[i]+l*this.amp[i],this.y[i]+l*this.amp[i]);
    }

}