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
let toolBar;
let inventoryHolding;

let itemFrame;
let knuckles;
let potato;
let squash;

function preload(){
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
  knuckles = loadImage("assets/items/knuckles.png");
  potato = loadImage("assets/items/potato.png");
  squash = loadImage("assets/items/squash.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  inventoryGridSize = 4;
  inventoryScalar = height*3/4/inventoryGridSize;
  inventorySize = height-inventoryScalar*4
  gameMode = "game";
  paused = false;

  rectMode(CENTER)

  inventoryGrid = create2dArray(inventoryGridSize, inventoryGridSize);
  toolBar = [0, 0, 0, 0];

  inventoryGrid[0][0] = "knuckles";
  inventoryGrid[1][0] = "potato";
  inventoryGrid[0][1] = "squash";
  inventoryHolding = "0";
}

///////////////////////////////////////////////////////////////////////

function draw() {
  if (gameMode === "menu"){
  }

  if (gameMode === "game"){
    if (paused === true){
      pausedDrawLoop();
    }
    if (paused === false){
      background(75);
      gameDrawLoop();
    }
    gameConstantDrawLoop();
  }
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

function gameDrawLoop(){
  rect(mouseX, mouseY, height/12, height/12);
}

function pausedDrawLoop(){
  rect(width/2, (height/2-height/24), height*3/4, height*3/4);
  displayinventoryGrid();
}

function gameConstantDrawLoop(){
  rectMode(CENTER);
  rect(width/2, height - height/24, height*5/12, height/12);
}



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
      if (inventoryGrid[x][y] === "knuckles"){
        image(knuckles, x*inventoryScalar+inventoryScalar/2, y*inventoryScalar+inventoryScalar/2, inventoryScalar*4/5, inventoryScalar*4/5);
      }
      if (inventoryGrid[x][y] === "potato"){
        image(potato, x*inventoryScalar+inventoryScalar/2, y*inventoryScalar+inventoryScalar/2, inventoryScalar*4/5, inventoryScalar*4/5);
      }
      if (inventoryGrid[x][y] === "squash"){
        image(squash, x*inventoryScalar+inventoryScalar/2, y*inventoryScalar+inventoryScalar/2, inventoryScalar*4/5, inventoryScalar*4/5);
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
  let gridSpotX = floor(newMouseX/inventoryScalar + 4);
  let gridSpotY = floor(newMouseY/inventoryScalar + 4);
  console.log(gridSpotX, gridSpotY);

  tempHold = inventoryGrid[gridSpotX][gridSpotY];
  inventoryGrid[gridSpotX][gridSpotY] = inventoryHolding;
  inventoryHolding = tempHold;

  pop();
}