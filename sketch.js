//las variables de jugando,final e el estado del juego en jugar
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//las variables de las imaguenes de los trex
var trex, trex_running, trex_collided;
//variables del piso, piso invicible e la imaguen del piso
var ground, invisibleGround, groundImage;
//variables de el grupo de nubes e la imguen de la nube
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//var del puntaje 
var score=0;
//var de fin del juego y reiniciar
var gameOver, restart;


//funcion de precarga
function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  //cuando el trex choca con algun obstaculo carga la animacion "trex_collided.png"
  trex_collided = loadAnimation("trex_collided.png");
  //la imagen del piso
  groundImage = loadImage("ground2.png");
  //laimagen de la nube
  cloudImage = loadImage("cloud.png");
  //imagenes de los obstaculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //imagenes de fin del juego y reiniciar juego
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}
//funcion de configuracion
function setup() {
  
  //el ancho de la pantalla
  createCanvas(600, 200);
  //el sprite del trex
  trex = createSprite(50,180,20,50);
  
  //la animaciones del trex y la escala 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //el sprite del piso,la imagen,la posicion y la velocidad del piso
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  // la imagen y el sprite del fin del juego
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
   // la imagen y el sprite de reiniciar
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //la escala de las imaguenes del fin del juego y reiniciar
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
//fin del juego e restart que no sean visibles
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  //que el piso invisible no sea visible 
  invisibleGround.visible = false;
  //los grupos de las nubes y obstaculos
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}
//funcion de dibujar
function draw() {
  //trex.debug = true;
  background(255);
  background("black");
  //el texto de la puntuacion
  text("Puntuación: "+ score, 500,50);
  //aumenta la velocidad del piso
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  //si tocamos la barar espaciadora el trex saltara
    if(keyDown("w") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  //la velocidad del trex en y
    trex.velocityY = trex.velocityY + 0.80
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
  //si el grupo de obstaculos toca a el trex el estado del juego es END
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  //hace visible las imagenes de fin del juego y reiniciar
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establece velocidad de cada objeto del juego en 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambia la animación de Trex
    trex.changeAnimation("collided",trex_collided);
    
    //establece ciclo de vida a los objetos del juego para que nunca puedan ser destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //si el mouse preciona la imagen restart se reinicia el juego
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}
//funcion de aparecer nuebes
function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asigna ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajusta la profundiad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agrega cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}
//funcion de aparecer obstaculos
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //genera obstáculos al azar
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
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}
//funcion de resetiar
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}