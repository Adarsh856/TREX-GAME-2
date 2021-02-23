var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var snakeGroup, snake, snakeImage;
var eagleGroup, eagle, eagleImage;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  snakeImage = loadImage("snake.png");
  eagleImage = loadImage("eagle.png"); 
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,height-15,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.75;
  restart.scale = 0.75;
  
  invisibleGround = createSprite(200,height-10,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  snakesGroup = createGroup();
  eagleGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  textSize(50);
  text("Score: "+ score, width/2-125, height/2-200);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0 || keyDown("space")&& trex.y >= height-70) {
        trex.velocityY = -11;
        jumpSound.play();
        touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
      
    }
    
    if(score<1000){
      spawnSnakes();
    }
    
    if(score>1000){
      spawnEagles();
      snakesGroup.destroyEach();
      background("black");
      fill("White");
      text("Score: "+ score, 500,50);
    }
    
    if(snakesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
    
    if(eagleGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }  
  }
   else if (gameState === END) {
      if(score>1000){
        background("Black");
      }
     
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     snakesGroup.setLifetimeEach(-1);
     eagleGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     snakesGroup.setVelocityXEach(0);
     eagleGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
     reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function reset(){
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  snakesGroup.destroyEach();
  eagleGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
  gameState=PLAY;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,height-35,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnSnakes() {
  if (frameCount % 100 === 0) {
    snake = createSprite(windowWidth,height-200,40,10);
    snake.y = Math.round(random(height-160,height-200));
    snake.addImage(snakeImage);
    snake.scale = 0.1;
    snake.velocityX = -3;
    
     //assign lifetime to the variable
    snake.lifetime = width;
    
    snakesGroup.add(snake);
  }
}

function spawnEagles() {
  if (frameCount % 100 === 0) {
    eagle = createSprite(windowWidth,height-200,40,10);
    eagle.y = Math.round(random(height-160,height-200));
    eagle.addImage(eagleImage);
    eagle.scale = 0.1;
    eagle.velocityX = -3;
    
     //assign lifetime to the variable
    eagle.lifetime = width;
    
    eagleGroup.add(eagle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth,height+30,40,10);
    cloud.y = Math.round(random(50,height-250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}