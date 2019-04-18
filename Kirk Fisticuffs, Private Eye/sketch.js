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
let itemFrame;

function preload(){
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  inventoryGridSize = 8;
  inventoryScalar = height*3/4/inventoryGridSize;
  inventorySize = height-inventoryScalar*4
  gameMode = "game";
  paused = false;

  rectMode(CENTER)

  inventoryGrid = create2dArray(inventoryGridSize, inventoryGridSize);
  toolBar = [0, 0, 0, 0];
}

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



function gameDrawLoop(){
  rect(mouseX, mouseY, height/12, height/12);
}

function pausedDrawLoop(){
  rect(width/2, (height/2-height/24), height*3/4, height*3/4);
  displayinventoryGrid();
}

function gameConstantDrawLoop(){
  rectMode(CENTER);
  rect(width/2, height - height/24, height*5/12, height/12)
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
      if (inventoryGrid[y][x] === 0){
        noStroke()
        fill("brown")
      }
      else{
        fill(0)
      }
      rectMode(CORNER);
      image(itemFrame, x*inventoryScalar, y*inventoryScalar, inventoryScalar, inventoryScalar);
    }
  }
  pop();
}