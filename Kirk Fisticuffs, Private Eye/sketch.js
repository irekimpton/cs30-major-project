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
let toolBar = [0, 0, 0, 0];;
let inventoryHolding;

let itemFrame;
let knuckles;
let potato;
let squash;
let kirkStillRight;
let imageList = [];


let kirk;

function preload(){
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
  knuckles = loadImage("assets/items/knuckles.png");
  potato = loadImage("assets/items/potato.png");
  squash = loadImage("assets/items/squash.png");

  kirkStillRight = loadImage("assets/kirk/kirkStillRight.png");

  imageList = [knuckles, potato, squash];
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
  }

  inventoryGridSize = 4;
  inventoryScalar = height*3/4/inventoryGridSize;
  inventorySize = height-inventoryScalar*4
  gameMode = "game";
  paused = false;

  rectMode(CENTER)

  inventoryGrid = create2dArray(inventoryGridSize, inventoryGridSize);

  inventoryGrid[0][0] = 1;
  inventoryGrid[1][0] = 2;
  inventoryGrid[0][1] = 3;
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

    gameConstantDrawLoop();
  }
}

function gameUpdateLoop(){
  if (keyIsPressed){

  }
}

function pausedDrawLoop(){
  rect(width/2, (height/2-height/24), height*3/4, height*3/4);
  displayinventoryGrid();
  if (inventoryHolding !== 0){
    imageMode(CENTER);
    image(imageList[inventoryHolding-1], mouseX, mouseY, inventoryScalar, inventoryScalar);
  }
}

function gameDisplayLoop(){
  background(75);
  imageMode(CENTER);
  image(kirkStillRight, kirk.xPos, kirk.yPos, height/12, height/6);
}

function gameConstantDrawLoop(){
  rectMode(CENTER);
  rect(width/2, height - height/24, height/3, height/12);
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
  translate(width/2 - height*3/8, (height/2-height/24) - height*3/8);
  for (let y = 0; y < inventoryGridSize; y++){
    for (let x = 0; x < inventoryGridSize; x++){
      imageMode(CORNER);
      image(itemFrame, x*inventoryScalar, y*inventoryScalar, inventoryScalar, inventoryScalar);
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
  translate(width/2 - height*3/8, (height/2-height/24) - height*3/8);
  let newMouseX = mouseX - width/2 - height*3/8;
  let newMouseY = mouseY - (height/2-height/24) - height*3/8;
  let gridSpotX = floor(newMouseX/inventoryScalar + inventoryGridSize);
  let gridSpotY = floor(newMouseY/inventoryScalar + inventoryGridSize);
  console.log(gridSpotX, gridSpotY);

  tempHold = inventoryGrid[gridSpotX][gridSpotY];
  inventoryGrid[gridSpotX][gridSpotY] = inventoryHolding;
  inventoryHolding = tempHold;

  pop();
}