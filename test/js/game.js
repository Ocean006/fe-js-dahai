
//Screen size and globals 全局
myWidth = 1024;
myHeight = 480;
myCenterH = 320;
myCenterV = 240;
mouseX = 0;
mouseY = 0;
scoreX=0;
scoreY=0;

//data about missiles 发射物 导弹
maxMissiles = 10;
missileStatus = [];
missileX = [];
missileY = [];
missileIteration = [];

//data about meteors  流星 陨星
meteorPeriod = 3000; //流星时期
maxmeteors =50; //流星最大值
meteorVelocity = 15; //流星速度
meteorStatus = []; //流星状态
meteorX = [];
meteorY = [];
meteorIteration = []; //流星迭代
meteorVelocityX = [];  //流星X速度
meteorVelocityY = []; //流星Y速度

//data about shields 盾牌
//shieldStat = [];
//shieldH = [];

//data about smoke puffs 烟雾喷
maxPuffs = 124;
puffStat = [];
puffX = [];
puffY = [];

//data about explosions 爆炸
maxExplosions = 9;
explosionStat = [];
explosionX = [];
explosionY = [];

//Stats 统计
myScore = 10;
myLevel = 1;
myLives = 1;
myKills = 0;

//Game status 游戏状态
tankLive = 0; //坦克活
meteorLive = 0;  // 陨星活
tankH = 0;
tankIteration = 1; //坦克循环
isPaused = 0;  //暂停

//Get the window size  窗口大小
function getWindowSize()
{
  if (typeof(window.innerWidth) == 'number')
    {
    //Non-IE
	myWidth = window.innerWidth;
    myHeight = window.innerHeight;
    }
  else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
    {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
    }
  else if (document.body && (document.body.clientWidth || document.body.clientHeight))
    {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
    }
    myCenterH = myWidth / 2;
    myCenterV = myHeight / 2;
}

//Write text variables (score, level, lives) to screen 屏幕写文本变量（得分，水平，生活）
function writeText()
  {
  //Do Level
  //Int to Str
  var stringText = myLevel + '';
  //Pad string 垫弦
  var i = 0;
  for (i = 1; i <= 2; i++)
    {
    if (stringText.length < 2)
      {
      stringText = '0' + stringText;
      }
    }
  for (i = 1; i <= 2; i++)
    {
    document.getElementById('LEVEL' + i).src = "img/numbers1" + stringText.charAt(i - 1) + ".png";
    }
  //Do Score
  //Int to Str
  var stringText = myScore + '';
  //Pad string
  for (i = 1; i <= 5; i++)
    {
    if (stringText.length < 5)
      {
      stringText = '0' + stringText;
      }
    }
  for (i = 1; i <= 5; i++)
    {
      document.getElementById('SCORE' + i).src = "img/numbers" + stringText.charAt(i - 1) + ".png";  //charAt() 方法可返回指定位置的字符。
    }
  //Do Lives
  //Int to Str
  var stringText = myLives + '';
  //Pad string
  for (i = 1; i <= 2; i++)
    {
    if (stringText.length < 2)
      {
        stringText = '0' + stringText;
      }
    }
  for (i = 1; i <= 2; i++)
    {
      document.getElementById('LIVES' + i).src = "img/numbers2" + stringText.charAt(i - 1) + ".png";
    }
}

//Animate/Move Moon
function drawMoon(iteration) //iteration循环
  {
  iteration++;
  if (iteration > myWidth)
    {
    iteration = -100;  
    }
  moonLoc = myHeight - (Math.sin(((iteration * 2.5) / myWidth)) * 250)- 200;
 // moveObjTo(MOON, iteration, moonLoc)
  window.setTimeout("drawMoon(" + iteration + ");", 200);
  }

//Track Mouse 跟踪鼠标
function trackMouse(event)
  {
  mouseX = event.clientX;
  mouseY = event.clientY;
  }
  
//Get things started... but not until the images are loaded! 事情开始...但直到图像加载！
function picLoadInit()
  {
  if (isImageOk(INFOTEXT))
    {
    //Init vars
    var i = 0;
    for (i = 1; i <= maxmeteors; i++)
      {
      meteorStatus[i] = 0;
      }
    for (i = 1; i <= maxPuffs; i++)
      {
      puffStat[i] = 0;
      }
    for (i = 1; i <= maxExplosions; i++)
      {
      explosionStat[i] = 0;
      }
    //Init routines go here
	  moveObjTo(LOADING, 0, -500);
	  initScreen();
	  initLive();
	  writeText();
	  getready(1);
	  moveTank();
	  //initShields();
	  firemeteor();
	  puffer();
    }
  else
    {
      window.setTimeout("picLoadInit();", 200);
    }
}

//Reset button 重置按钮
function resetButton()
  {
  document.getElementById('gameover').style.left = -500;
  myScore = 10;
  myKills = 0;
  myLevel = 1;
  myLives = 1;
  writeText();
  var i = 0;
  for (i = 1; i <= maxmeteors; i++)
    {
    meteorStatus[i] = 0;
    document.getElementById('meteor' + i).style.left = -500;
    }
/*  for (i = 1; i <= maxPuffs; i++)
    {
    puffStat[i] = 0;
    //document.getElementById('PUFF' + i).style.left = -500;
    }*/
  //initShields(); //初始化的盾牌
  getready(1);
  location.reload();
  }

//Game over 游戏结束
function gameover()
  {
  tankLive = 0;
  tankH = -50;
  meteorLive = 0;
  document.getElementById('TANK1').style.left = -500;
  document.getElementById('gameover').style.left = myCenterH - 93;
  document.getElementById('gameover').style.top = myCenterV - 14;
  }

//Get ready...! 准备(Pause, post notice, and Go!)
function getready(iteration)
  {
  if (iteration == 1)
    {
    tankLive = 0;
    meteorLive = 0;
    tankH = -50
    document.getElementById('TANK1').style.left = -50;
    document.getElementById('getready').style.left = myCenterH - 97;
    document.getElementById('getready').style.top = myCenterV - 16;
    window.setTimeout("getready(2);", 1000);
    }
  else if (iteration == 2)
    {
    tankLive = 1;
    window.setTimeout("getready(3);", 500);
    }
  else
    {
    document.getElementById('getready').style.top = -500;
    meteorLive = 1;
    }
}


//Checks if an image is loaded with a couple methods 检查图像的加载与一对夫妇的方法
function isImageOk(img)
  {
  if (!img.complete)
    {
    return false;
    }
  if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0)
    {
    return false;
    }
  return true;
  }
  
//Reactivate (pauses for a moment to avoid triggering a false click) 激活（停顿片刻，避免引发虚假点击）
 
function doReactivate(iteration)
  {
  if (iteration == 1)
    {
    window.setTimeout("doReactivate(2);", 50);
    }
  else
    {
    isPaused = 0;
    tankLive = 1;
    }
  }

//Toggle "info" screen 切换“信息”屏幕
function showInfo()
{
  if (isPaused == 0)
    {
    moveObjTo(INFOTEXT, myCenterH - 157, myCenterV - 85);
    togglePaused()
    }
}

//Toggle "paused" status 切换“暂停”状态
function togglePaused()
  {
  if (isPaused == 1)
    {
    PAUSED.style.height = 100;
    PAUSED.style.width = 100;
    moveObjTo(PAUSED, 0, -500);
    moveObjTo(INFOTEXT, 0, -500);
    doReactivate(1);
    }
  else
    {
    isPaused = 1;
    moveObjTo(PAUSED, 0, 0);
    PAUSED.style.height = myHeight;
    PAUSED.style.width = myWidth;
    }  
  }

//Set up the basic layout 设置基本布局
function initScreen()
{
  document.bgColor = "#50d5d2";
  //Scale full-width elements, if required   //规模的全宽度元素，如果需要
  if (myWidth > 1500)
    {
    //Moving full width elements must be at least 100 greater than screen width  //移动全宽度元素必须至少100超过屏幕宽度
    CLOUDS1.width = myWidth + 100;
    CLOUDS2.width = myWidth + 100;
    CLOUDS3.width = myWidth + 100;
    MOUNTAINS.width = myWidth;
    GROUND.width = myWidth;
    }

  moveObjTo(MOUNTAINS, 0, myHeight - 420);
  moveObjTo(GROUND, 0, myHeight - 51);

  moveObjTo(TITLE, 15, 15);

 // moveObjTo(GRASS11, 0, myHeight - 118);
 // moveObjTo(GRASS21, myWidth - 120, myHeight - 100);

  moveObjTo(LEVEL1, myWidth - 76, 125);
  moveObjTo(LEVEL2, myWidth - 56, 125);
  moveObjTo(SCORE1, myWidth - 260, 16);
  moveObjTo(SCORE2, myWidth - 210, 16);
  moveObjTo(SCORE3, myWidth - 160, 16);
  moveObjTo(SCORE4, myWidth - 110, 16);
  moveObjTo(SCORE5, myWidth - 60, 16);
  
  moveObjTo(LIVES1, myWidth - 95, 215); //等级
  moveObjTo(LIVES2, myWidth - 60, 215); //等级

  moveObjTo(LEVEL, myWidth - 170, 120);
  //moveObjTo(SCORE, myWidth - 120, 195);
  moveObjTo(LIVES, myWidth - 180, 200);
  
  moveObjTo(RESET, myWidth - 137, 420);
  moveObjTo(PAUSE, myWidth - 137, 515);
  moveObjTo(INFO, myWidth - 110, 335);
  
}

//Init live objects 初始化带电物体
function initLive()
  {
  locX = (Math.random() * myWidth);  drawMoon(locX);
  cloudJiggler(CLOUDS1, 1, 50);
  cloudJiggler(CLOUDS2, 1, 70);
  cloudJiggler(CLOUDS3, 1, 110);
 // waveGrass1(1, 150);
 // waveGrass2(1, 140);
  }

//Reset shields  复位盾牌
/*function initShields()
  {
  shieldStat[1] = 1;
  shieldStat[2] = 1;
  shieldStat[3] = 1;
  shieldStat[4] = 1;
  shieldStat[5] = 1;
  var i = 0;
  for (i = 1; i <= 5; i++)
    {
    shieldH[i] = (((myWidth - 200) / 5) * (i - 1)) + 150
    document.getElementById('SHIELD' + i).src = "img/shield1.png";
    document.getElementById('SHIELD' + i).style.top = myHeight - 100;
    document.getElementById('SHIELD' + i).style.left = shieldH[i];
    }
  }*/

//Draw shields 绘制盾牌
/*function drawShields()
  {
  var i = 0;
  for (i = 1; i <= 5; i++)
    {
    if (shieldStat[i] > 0)
      {
      document.getElementById('SHIELD' + i).src = "img/shield" + shieldStat[i] + ".png";
      }
    else
      {
      document.getElementById('SHIELD' + i).style.top = -500
      }
    }
  }
*/

//Tank explosion 坦克爆炸
function tankExplosion(explodeX, iteration)
{
  if (iteration == 8)
    {
    moveObjTo(TANKEXPLODE, explodeX - 37, -500);
    }
  else
    {
    moveObjTo(TANKEXPLODE, explodeX - 37, myHeight - 75);
    document.getElementById('TANKEXPLODE').src = "img/tank-explode" + iteration + ".png";
    }
  iteration++;//循环 重复
  if (iteration < 9)
    {
    window.setTimeout("tankExplosion(" + explodeX + "," + iteration + ");", 250);
    }
}

//Fire a new meteor (if available) periodically 期触发一个新的流星（如果可用）
function firemeteor()
  {
  var i = 0;
  var launchMe = 0;
  for (i = 1; i <= maxmeteors; i++)
    {
    //try and find a launch slot 试图找到一个发射槽
    if (meteorStatus[i] != 1)
      {
      launchMe = i;
      }
    }
  if (launchMe > 0 && isPaused == 0)
    {
    meteorStatus[launchMe] = 1;
    meteorX[launchMe] = (Math.random() * (myWidth + 0)) + 100;
    meteorY[launchMe] = -20;
    meteorIteration[launchMe] = 1;
    angleRad = (135 + (Math.random() * 90)) * (Math.PI / 180);
    meteorVelocityX[launchMe] = (meteorVelocity + myLevel) * Math.sin(angleRad);
    meteorVelocityY[launchMe] = (meteorVelocity + myLevel) * Math.cos(angleRad);
    maintainmeteor(launchMe);
    }
  window.setTimeout("firemeteor();", meteorPeriod);
}

//Maintain and track meteor 维护和跟踪陨星
function maintainmeteor(meteorNo) //维持流星
  {
  if (isPaused == 1 || meteorLive == 0)
    {
    window.setTimeout("maintainmeteor(" + meteorNo + ");", 200);
    }
  else
    {
    meteorY[meteorNo] = meteorY[meteorNo] - meteorVelocityY[meteorNo];
    meteorX[meteorNo] = meteorX[meteorNo] + meteorVelocityX[meteorNo];
    mWidth = document.getElementById('meteor' + meteorNo).style.width;
    mHeight = document.getElementById('meteor' + meteorNo).style.height;
    if (meteorStatus[meteorNo] != 0)
      {
      document.getElementById('meteor' + meteorNo).style.top = meteorY[meteorNo] - (mWidth / 2);
      document.getElementById('meteor' + meteorNo).style.left = meteorX[meteorNo] - (mHeight / 2);
      }
    meteorIteration[meteorNo]++;
    if (meteorIteration[meteorNo] == 4)
      {
      meteorIteration[meteorNo] = 1;
      }
    //meteor type 流星型
    meteorType = ((meteorNo + 9) % 10) + 1;
    document.getElementById('meteor' + meteorNo).src = "img/meteor" +meteorType + meteorIteration[meteorNo] + ".png";

    //Look for collisions with shields  寻找与盾的碰撞
/*  var i = 0;
    var hitMe = 0;
    for (i = 1; i <= 5; i++)
      {
      hitMe = collide('meteor' + meteorNo, 'SHIELD' + i);
      if (hitMe == 1)
        {
        if (shieldStat[i] < 7 && shieldStat[i] > 0)
          {
          shieldStat[i]++;
          }
        else
          {
          shieldStat[i] = 0;
          }
        drawShields();
        meteorStatus[meteorNo] = 0;
        explosion(meteorX[meteorNo], meteorY[meteorNo]);
        document.getElementById('meteor' + meteorNo).style.top = -500;
        }
      }*/

    //Game over if all shields are destroyed 游戏被破坏了，如果所有的屏蔽
/*    allDead = 1;
    for (i = 1; i <= 5; i++)
      {
      if (shieldStat[i] > 0)
        {
        allDead = 0;
        }
      }
    if (allDead == 1)
      {
      meteorStatus[meteorNo] = 0;
      gameover();
      }*/

    //Look for collisions with tank 寻找用坦克碰撞
    var hitMe = 0;
    hitMe = collide('meteor' + meteorNo, 'TANK1');
    if (hitMe > 0)
      {
	  //missileStatus[missileNo] = 0;
      tankExplosion(tankH, 1);
      document.getElementById('meteor' + meteorNo).style.top = -500;
	  document.getElementById('TANK1').style.top = -500;
	  meteorStatus= 0;
      //myLives++;
	  //myScore = myScore + 9 + myLevel;
      writeText();
	  
      if (myLives == 0)
        {
        gameover();
        }
      else
        {
        getready(1);
        }
      }

    if (meteorStatus[meteorNo] == 0 || meteorY[meteorNo] > myHeight || meteorX[meteorNo] < - 100 || meteorX[meteorNo] >= myWidth + 100)
      {
      meteorStatus[meteorNo] = 0;
      }
    else
      {
        window.setTimeout("maintainmeteor(" + meteorNo + ");", 80- myLevel);
      }
    }
  }


//Rain 雨
function doRain(obj, locX, locY, speed)
{
  if (tankLive == 1)
    {
    if (locX < -70 || locY > myHeight)
      {
      locX = (Math.random() * (myWidth + 300)) + 100;
      locY = -150;
      }
    else
      {
      locX = locX - (0.76 * speed);
      locY = locY + (1.71 * speed);
      }
    moveObjTo(obj, locX, locY)
    }
  window.setTimeout("doRain(" + obj.id + "," + locX + "," + locY + "," + speed + ");", 25);
}

//Fire new missile (if available) 消防新型导弹（如果可用）
function fireMissile()
  {
  var i = 0;
  var launchMe = 0;
  for (i = 1; i <= maxMissiles; i++)
    {
    //try and find a launch slot 试图找到一个发射槽
    if (missileStatus[i] != 1)
      {
      launchMe = i;
      }
    }
  if (launchMe > 0 && isPaused == 0 && tankLive == 1)
    {
    missileStatus[launchMe] = 1;
    missileX[launchMe] = tankH;
    missileY[launchMe] = myHeight - 55;
    missileIteration[launchMe] = 1;
    maintainMissile(launchMe);
    }
  }

//Move missiles and track for collision (or leaving screen) 移动导弹和轨道碰撞（或离开屏幕）
function maintainMissile(missileNo) //missileNo导弹号  
  {
  if (isPaused == 1)
    {
    window.setTimeout("maintainMissile(" + missileNo + ");", 200);
    return;
    }
   missileY[missileNo] = missileY[missileNo] - 10;
   //document.getElementById('BULLET' + missileNo).style.top = missileY[missileNo];
   //document.getElementById('BULLET' + missileNo).style.left = missileX[missileNo] - 6;
   //document.getElementById('TANK' + missileNo).style.top = missileY[missileNo];
   //document.getElementById('TANK' + missileNo).style.left = missileX[missileNo] - 6;
   missileIteration[missileNo]++;
  if (missileIteration[missileNo] == 5)
    {
    missileIteration[missileNo] = 1;
    }  
	document.getElementById('TANK' + missileNo).src = "img/TANK" + missileIteration[missileNo] + ".png";
    document.getElementById('TANK' + missileNo).style.top = missileY[missileNo] + 24;
    document.getElementById('TANK' + missileNo).style.left = missileX[missileNo] - 6;



  //Look for collisions with meteors 看流星碰撞
  var i = 0;
  var hitMe = 0;
  for (i = 1; i <= maxmeteors; i++)
    {
    //hitMe = collide('BULLET' + missileNo, 'meteor' + i);
	hitMe = collide('TANK' + missileNo, 'meteor' + i);  //collide碰撞
    if (hitMe > 0)
      {
      missileStatus[missileNo] = 0;
      //document.getElementById('FLAME' + missileNo).style.top = -500;
      document.getElementById('TANK' + missileNo).style.top = -500;
      document.getElementById('meteor' + i).style.top = -500;
/*    explosion(meteorX[i], meteorY[i]);
      meteorStatus[i] = 0;
      myScore = myScore + 50 + myLevel;
      myKills++;
      if (myKills == 12)
        {
        myKills = 0;
        myLevel++;
        }
      writeText();*/
      }
    }
  if (missileY[missileNo] < -40 || missileStatus[missileNo] == 0)
    {
    missileStatus[missileNo] = 0;
    }
  else
    {
    window.setTimeout("maintainMissile(" + missileNo + ");", 20);
    }
  }

  
//Puffer periodically creates puffs 河豚定期创建泡芙
function puffer()
  {
  var i = 0;
  var launchMe = 0;
  for (i = 1; i <= maxPuffs; i++)
    {
    //try and find a launch slot
    if (puffStat[i] == 0)
      {
      launchMe = i;
      }
    }
  puffStat[launchMe] = -1;
  if (launchMe > 0 && isPaused == 0)
    {
    var start = 0;
    start = Math.floor((Math.random() * maxmeteors) + 1)
    for (i = start; i <= start + 11; i++)
      {
      thisM = i;
      if (thisM > 12)
        {
        thisM = thisM - 12;
        }
      if (meteorStatus[thisM] > 0)
        {
        whichmeteor = thisM;
        puffX[launchMe] = meteorX[whichmeteor];
        puffY[launchMe] = meteorY[whichmeteor];
        puffStat[launchMe] = 1;
        }
      }
    if (puffStat[launchMe] == 1)
      {
      maintainPuff(launchMe);
      }
    else
      {
      puffStat[launchMe] = 0;
      }
    }
  window.setTimeout("puffer();", 50);
  }

//Check two objects for collision 检查两个物体碰撞
function collide(obj1, obj2)
{
  var l1 = 0;  var l2 = 0;  var r1 = 0;  var r2 = 0;  var t1 = 0;  var t2 = 0;  var b1 = 0;  var b2 = 0;
  l1 = parseInt(document.getElementById(obj1).style.left) + 3;
  r1 = parseInt(document.getElementById(obj1).style.left) + parseInt(document.getElementById(obj1).width) - 3;
  
  l2 = parseInt(document.getElementById(obj2).style.left) + 3;
  r2 = parseInt(document.getElementById(obj2).style.left) + parseInt(document.getElementById(obj2).width) - 3;
  
  t1 = parseInt(document.getElementById(obj1).style.top) + 3;
  b1 = parseInt(document.getElementById(obj1).style.top) + parseInt(document.getElementById(obj1).height) - 3;
  
  t2 = parseInt(document.getElementById(obj2).style.top) + 3;
  b2 = parseInt(document.getElementById(obj2).style.top) + parseInt(document.getElementById(obj1).height) - 3;

		
  if (r1 > l2 && l1 < r2 && t1 < b2 && b1 > t2)
    {
		//console.log(l2);
		//console.log(c2);
		//console.log(r2);
		
		var _data = $("#"+obj1).data("num");
		var _left = $("#"+obj1).offset();
		var _name = $("#"+obj1).data("name");
		
        //alert(_left.left);
		if((_left.left-l2<=150 && _data <= 0)||(_left.left-l2>150 && _data >0)){
			//console.log("加分");	
			 //playSound();  
			 myLives++;
			 //myLevel++;
		     //myScore = myScore + 9 + myLevel;
			 if(myLives >1&&myLives <=10)
			 {
				 if(_name==1)
				 {
				    myScore = myScore + 10;
				    window.setTimeout(function(){document.getElementById('score10').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score10').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore + 20;
				    window.setTimeout(function(){document.getElementById('score20').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score20').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore + 30;
				    window.setTimeout(function(){document.getElementById('score30').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score30').style.display='none';},1000);
				 }
			 }
			 else if(myLives >10&&myLives <=20)
			 {
				 if(_name==1)
				 {
				    myScore = myScore + 20;
				    window.setTimeout(function(){document.getElementById('score20').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score20').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore + 40;
				    window.setTimeout(function(){document.getElementById('score40').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score40').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore + 60;
				    window.setTimeout(function(){document.getElementById('score60').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score60').style.display='none';},1000);
				 }
			 }
			 else if(myLives >20)
			 {
			   if(_name==1)
				 {
				    myScore = myScore + 30;
				    window.setTimeout(function(){document.getElementById('score30').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score30').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore + 60;
				    window.setTimeout(function(){document.getElementById('score60').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score60').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore + 90;
				    window.setTimeout(function(){document.getElementById('score90').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score90').style.display='none';},1000);
				 }
			 }
			 
			 //myLevel++
			  if(myScore<=100)
			 {
				 myLevel=1;
			 }
			 else if(myScore>100&&myScore<=200)
			 {
				  myLevel=2;
			 }
			 else if(myScore>200&&myScore<=300)
			 {
				 myLevel=3;
			 }
			 else if(myScore>300&&myScore<=400)
			 {
				myLevel=4;
			 }
			 else if(myScore>400&&myScore<=500)
			 {
				 myLevel=5;
			 }
			 else if(myScore>500&&myScore<600)
			 {
				myLevel=6;
			 }
			 else if(myScore>600&&myScore<=700)
			 {
				 myLevel=7;
			 }
			 else if(myScore>700&&myScore<=800)
			 {
				 myLevel=8;
			 }
			  else if(myScore>800&&myScore<=900)
			 {
				myLevel=9;
			 }
			  else if(myScore>900&&myScore<=1000)
			 {
				 myLevel=10;
			 }
			  else if(myScore>1000&&myScore<=1100)
			 {
				myLevel=11;
			 }
			  else if(myScore>1100&&myScore<=1200)
			 {
				 myLevel=12;
			 }
			  else if(myScore>1200&&myScore<=1300)
			 {
				myLevel=13;
			 }			  
			 else if(myScore>1300&&myScore<=1400)
			 {
				 myLevel=14;
			 }
			  else if(myScore>1400)
			 {
				myLevel=15;
			 }
			 
			 writeText();

		 if (myLives == 30)
			  {
			    gameover();
			  }
      
		}else{
			//console.log("不加分");
			 //myScore = myScore - 9 - myLevel;
			// myScore = myScore - 10;
			 if(myLives >1&&myLives <=10)
			 {
				 if(_name==1)
				 {
				    myScore = myScore - 10;
				    window.setTimeout(function(){document.getElementById('score11').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score11').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore - 20;
				    window.setTimeout(function(){document.getElementById('score21').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score21').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore - 30;
				    window.setTimeout(function(){document.getElementById('score31').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score31').style.display='none';},1000);
				 }
			 }
			 if(myLives >10&&myLives <=20)
			 {
				 if(_name==1)
				 {
				    myScore = myScore - 20;
				    window.setTimeout(function(){document.getElementById('score21').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score21').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore - 40;
				    window.setTimeout(function(){document.getElementById('score41').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score41').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore - 60;
				    window.setTimeout(function(){document.getElementById('score61').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score61').style.display='none';},1000);
				 }
			 }
			 if(myLives >20)
			 {
			   if(_name==1)
				 {
				    myScore = myScore - 30;
				    window.setTimeout(function(){document.getElementById('score31').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score31').style.display='none';},1000);
				 }
				else if(_name==2)
				 {
				    myScore = myScore - 60;
				    window.setTimeout(function(){document.getElementById('score61').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score61').style.display='none';},1000);
				 }
				 else
				 {
				    myScore = myScore - 90;
				    window.setTimeout(function(){document.getElementById('score91').style.display='block';},50);
			        window.setTimeout(function(){document.getElementById('score91').style.display='none';},1000);
				 }
			 }
			 if(myScore<=100)
			 {
				 myLevel=1;
			 }
			 else if(myScore>100&&myScore<=200)
			 {
				  myLevel=2;
			 }
			 else if(myScore>200&&myScore<=300)
			 {
				 myLevel=3;
			 }
			 else if(myScore>300&&myScore<=400)
			 {
				myLevel=4;
			 }
			 else if(myScore>400&&myScore<=500)
			 {
				 myLevel=5;
			 }
			 else if(myScore>500&&myScore<600)
			 {
				myLevel=6;
			 }
			 else if(myScore>600&&myScore<=700)
			 {
				 myLevel=7;
			 }
			 else if(myScore>700&&myScore<=800)
			 {
				 myLevel=8;
			 }
			  else if(myScore>800&&myScore<=900)
			 {
				myLevel=9;
			 }
			  else if(myScore>900&&myScore<=1000)
			 {
				 myLevel=10;
			 }
			  else if(myScore>1000&&myScore<=1100)
			 {
				myLevel=11;
			 }
			  else if(myScore>1100&&myScore<=1200)
			 {
				 myLevel=12;
			 }
			  else if(myScore>1200&&myScore<=1300)
			 {
				myLevel=13;
			 }			  
			 else if(myScore>1300&&myScore<=1400)
			 {
				 myLevel=14;
			 }
			  else if(myScore>1400)
			 {
				myLevel=15;
			 }
			 
			 //myLevel--;
			 myLives--;
			 writeText();
			 
			 if (myLives == 0)
			  {
			    gameover();
			  }
		}
/*		if(_left.left-l2>150 && _data >0 ){
			//console.log("加分");
			myLives++;
			myScore = myScore + 9 + myLevel;
		    myLevel++
			writeText();
		  if (myLives == 32)
			{
			gameover();
			}
			  
		}else{
			//console.log("不加分")
			 myLives--;
			 myScore = myScore - 9 - myLevel;
			 myLevel--
			 writeText();
			 if (myLives == 0)
			  {
			  gameover();
			  }
		}*/
		$("#"+obj1).hide();
		
    return 1;
    }
  else
    {
    return 0;
    }
  }

//Maintain puff
function maintainPuff(puffNo)
  {
/*  if (isPaused == 0 && meteorLive == 1)
    {
    if (puffStat[puffNo] > 3)
      {
      document.getElementById('PUFF' + puffNo).style.top = -500;
      puffStat[puffNo] = 0;
      }
    else
      {
      puffType = ((puffNo + 3) % 4) + 1;
      document.getElementById('PUFF' + puffNo).src = "img/puff" + puffType + puffStat[puffNo] + ".png";
      document.getElementById('PUFF' + puffNo).style.top = puffY[puffNo]
      document.getElementById('PUFF' + puffNo).style.left = puffX[puffNo]
      puffStat[puffNo]++;
      window.setTimeout("maintainPuff(" + puffNo + ");", 250);
      }
    }
  else
    {
    window.setTimeout("maintainPuff(" + puffNo + ");", 250);
    }*/
  }
  
  
//Create an explosion 创建一个爆炸
function explosion(explodeX, explodeY)
{
  var i = 0;
  var launchMe = 0;
  for (i = 1; i <= maxExplosions; i++)
    {
    //try and find a launch slot
    if (explosionStat[i] == 0)
      {
      launchMe = i;
      }
    }
  if (launchMe > 0 && isPaused == 0)
    {
    explosionStat[launchMe] = 1;
    explosionX[launchMe] = explodeX;
    explosionY[launchMe] = explodeY;
    window.setTimeout("maintainExplosion(" + launchMe + ");", 50);
    }
}


//Maintain explosion 保持爆炸
function maintainExplosion(explosionNo)
{
  if (isPaused == 0)
    {
    if (explosionStat[explosionNo] > 5)
      {
      document.getElementById('EXPLOSION' + explosionNo).style.top = -500;
      explosionStat[explosionNo] = 0;
      }
    else
      {
		explosionType = ((explosionNo + 2) % 3) + 1;
		document.getElementById('EXPLOSION' + explosionNo).src = "img/explode" + explosionType + explosionStat[explosionNo] + ".png";
		document.getElementById('EXPLOSION' + explosionNo).style.top = explosionY[explosionNo] - 25;
		document.getElementById('EXPLOSION' + explosionNo).style.left = explosionX[explosionNo] - 25;
		explosionStat[explosionNo]++;
		window.setTimeout("maintainExplosion(" + explosionNo + ");", 50);
      }
    }
  else
    {
    window.setTimeout("maintainExplosion(" + explosionNo + ");", 200);
    }
}


//Move tank 移动坦克
function moveTank()
  {
  if (tankLive == 1 && isPaused == 0)
    {
    if (tankH < mouseX)
      {
      tankH = tankH + (Math.abs(mouseX - tankH) / 2) + 3;
      tankIteration++;
      if (tankIteration == 4)
        {
        tankIteration = 1;
        }
        document.getElementById('TANK1').src = "img/tank3" + tankIteration + ".png";
	  //document.getElementById('TANK21').src = "img/tank" + tankIteration + ".png";
      if (tankH > mouseX)
        {
        tankH = mouseX;
        }
      }
	  
/*	 else if (tankH == mouseX)
      {
      tankH = tankH + (Math.abs(mouseX - tankH) / 2) + 3;
      tankIteration++;
      if (tankIteration == 4)
        {
        tankIteration = 1;
        }
        document.getElementById('TANK1').src = "img/tank1" + tankIteration + ".png";
	  //document.getElementById('TANK21').src = "img/tank" + tankIteration + ".png";
      if (tankH > mouseX)
        {
        tankH = mouseX;
        }
      }*/
	  
    else if (tankH > mouseX)
      {
      tankH = tankH - (Math.abs(mouseX - tankH) / 2) - 3;
      tankIteration--;
      if (tankIteration == 0)
        {
        tankIteration = 3;
        }
        document.getElementById('TANK1').src = "img/tank2" + tankIteration + ".png";
	   //document.getElementById('TANK21').src = "img/tank" + tankIteration + ".png";
      if (tankH < mouseX)
        {
        tankH = mouseX;
        } 
      }
    }
    moveObjTo(TANK1, tankH - 133, myHeight - 155);
    window.setTimeout("moveTank();", 20);
  }

//Wave grass 波草
/*function waveGrass1(iteration, spe

  iteration++
  if (iteration > 4)
    {
    iteration = 0;
    }
  if (iteration == 0)
    {
    GRASS11.src = "img/grass11.png";
    }
  else if (iteration == 1)
    {
    GRASS11.src = "img/grass12.png";
    }
  else if (iteration == 2)
    {
    GRASS11.src = "img/grass13.png";
    }
  else 
    {
    GRASS11.src = "img/grass12.png";
    }
  window.setTimeout("waveGrass1(" + iteration + "," + speed + ");", speed);
  }
function waveGrass2(iteration, speed)
  {
  iteration++
  if (iteration > 4)
    {
    iteration = 0;
    }
  if (iteration == 0)
    {
    GRASS21.src = "img/grass21.png";
    }
  else if (iteration == 1)
    {
    GRASS21.src = "img/grass22.png";
    }
  else if (iteration == 2)
    {
    GRASS21.src = "img/grass23.png";
    }
  else 
    {
    GRASS21.src = "img/grass22.png";
    }
  window.setTimeout("waveGrass2(" + iteration + "," + speed + ");", speed);
  }
*/
//Do cloud motion 做云运动
function cloudJiggler(obj, iteration, speed)
  {
  iteration++;
  tempTop = (Math.sin((iteration) / 20) * 50) - 50;
  moveObjTo(obj, tempTop, 0);
  window.setTimeout("cloudJiggler(" + obj.id + "," + iteration + "," + speed + ");", speed);
  }

//Simple move function 简单的移动功能
function moveObjTo(obj,oleft,otop)
  {
  obj.style.left = oleft;
  obj.style.top = otop;
  }