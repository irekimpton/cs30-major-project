// KIRK FISTICUFF, PRIVATE EYE!
// Ian Kimpton
// 
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let gameMode;
let paused;
let inventorySize;
let inventoryGridSize;
let inventoryGrid;
let inventoryScalar;
let inventoryHolding;

let itemFrame;
let otherItemFrame
let knuckles;
let potato;
let squash;
let kirkStillRight;
let imageList = [];

let kirk;

function preload(){
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
  otherItemFrame = loadImage("assets/miscSprites/otherItemFrame.png");

  knuckles = loadImage("assets/items/knuckles.png");
  laserCannon = loadImage("assets/items/laserCannon.png");

  kirkStillRight = loadImage("assets/kirk/kirkStillRight.png");

  imageList = [knuckles, laserCannon];
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  kirk = {
    xPos: width/2,
    yPos: height/2,
    top: this.yPos - 32,
    bottom: this.yPos + 32,
    left: this.xPos - 16,
    right: this.xPos + 16,
    facing: "right",
    speed: 5,
  }

  inventoryGridSize = 4;
  inventoryScalar = height*3/4/inventoryGridSize;
  inventorySize = inventoryScalar*inventoryGridSize
  gameMode = "game";
  paused = false;

  rectMode(CENTER)

  inventoryGrid = create2dArray(inventoryGridSize, inventoryGridSize);

  inventoryGrid[0][0] = 1;
  inventoryGrid[1][0] = 2;
  inventoryHolding = 0;
}

/////////////////////////////////////////////////////////////////////// DrawLoops

function draw(){
  if (gameMode === "game"){
    if (paused === false){
    gameUpdateLoop();
    }

    gameDisplayLoop();

    if (paused === true){
      pausedDrawLoop();
    }
  }
}

function gameUpdateLoop(){
  if (paused === false){
    moveKirk();
  }
}

function pausedDrawLoop(){
  displayinventoryGrid();
  if (inventoryHolding !== 0){
    imageMode(CENTER);
    if (inventoryHolding < inventoryGridSize){
      image(imageList[inventoryHolding-1], mouseX, mouseY, inventoryScalar, inventoryScalar);
    }
  }
}

function gameDisplayLoop(){
  background(75);
  imageMode(CENTER);
  image(kirkStillRight, kirk.xPos, kirk.yPos, height/12, height/6);
}

///////////////////////////////////////////////////////////////////////

function keyPressed(){
  if (gameMode === "game"){
    if (key === "e"){
      paused = !paused;
    }
  }
}

function windowResized(){
  createCanvas(windowWidth, windowHeight);
}

function mouseClicked(){
  if (paused === true){
    pickUp();
  }
}

///////////////////////////////////////////////////////////////////////

function create2dArray(rows, columns){
  let emptyArray = [];
  for (i = 0; i < rows; i ++){
    emptyArray.push([]);
    for (j = 0; j < columns; j ++){
      emptyArray[i].push(0);
    }
  }
  return emptyArray;
}

function displayinventoryGrid(){
  push();
  translate((width - inventorySize)/2, (height - inventorySize)/2);
  for (let y = 0; y < inventoryGridSize; y++){
    for (let x = 0; x < inventoryGridSize; x++){
      imageMode(CORNER);
      if (x === 0 && y === inventoryGridSize-1){
        image(otherItemFrame, x*inventoryScalar, y*inventoryScalar, inventoryScalar, inventoryScalar);
      }
      else{
        image(itemFrame, x*inventoryScalar, y*inventoryScalar, inventoryScalar, inventoryScalar);
      }
      imageMode(CENTER);
      if (inventoryGrid[x][y] !== 0){
        image(imageList[inventoryGrid[x][y]-1], x*inventoryScalar+inventoryScalar/2, y*inventoryScalar+inventoryScalar/2, inventoryScalar*4/5, inventoryScalar*4/5);
      }
    }
  }
  pop();
}

function pickUp(){
  let tempHold;
  push();
  translate((width - inventorySize)/2, (height - inventorySize)/2);
  let newMouseX = mouseX - (width - inventorySize)/2;
  let newMouseY = mouseY - (height - inventorySize)/2;
  let gridSpotX = floor(newMouseX/inventoryScalar);
  let gridSpotY = floor(newMouseY/inventoryScalar);
  console.log(gridSpotX, gridSpotY);

  if (gridSpotX >= 0 && gridSpotY >= 0 && gridSpotX < inventoryGridSize && gridSpotY < inventoryGridSize){
    tempHold = inventoryGrid[gridSpotX][gridSpotY];
    inventoryGrid[gridSpotX][gridSpotY] = inventoryHolding;
    inventoryHolding = tempHold;
  }

  pop();
}

function moveKirk(){
  if (keyIsDown(87) && upDetection()){
    kirk.yPos -= kirk.speed;
  }

  if (keyIsDown(83) && dpwnDetection()){
    kirk.yPos += kirk.speed;
  }

  if (keyIsDown(65) && leftDetection()){
    kirk.xPos -= kirk.speed;
  }

  if (keyIsDown(68) && rightDetection()){
    kirk.xPos += kirk.speed;
  }
}

function upDetection(){
  if (kirk.left >

}

function downDetection(){
  
}

function leftDetection(){
  
}

function rightDetection(){
  
}