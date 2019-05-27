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
let gameScalar;

let officeLevel;
let officeLines;
let officeTiles;

let bookcase;
let wall;
let door;

let walls;
let bookcases;
let doors;

let itemFrame;
let otherItemFrame
let knuckles;
let kirkStillRight;
let imageList;

let kirk;


function preload(){
  ///// LEVELS
  officeLevel = "assets/levels/officeLevel.txt";
  officeLines = loadStrings(officeLevel);

  ///// IMAGES
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
  otherItemFrame = loadImage("assets/miscSprites/otherItemFrame.png");

  knuckles = loadImage("assets/items/knuckles.png");
  laserCannon = loadImage("assets/items/laserCannon.png");

  bookcase = loadImage("assets/setPieces/bookcase.png");
  wall = loadImage("assets/setPieces/wall.png");
  door = loadImage("assets/setPieces/door.png");

  kirkStillRight = loadImage("assets/kirk/kirkStillRight.png");

  imageList = [knuckles, laserCannon];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameScalar = height/12;

  officeTiles = create2dArray(12, 12);

  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      let tileType = officeLines[x][y];
      officeTiles[x][y] = tileType;
    }
  }
  assignClasses();
  console.log(officeTiles);

  kirk = {
    xPos: height/2,
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
  imageMode(CORNER);
  displayStuff();
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
  if (keyIsDown(87) && checkUp()){
    kirk.yPos -= kirk.speed;
  }

  if (keyIsDown(83)){
    kirk.yPos += kirk.speed;
  }

  if (keyIsDown(65)){
    kirk.xPos -= kirk.speed;
  }

  if (keyIsDown(68)){
    kirk.xPos += kirk.speed;
  }
}

function checkUp(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (officeTiles[x][y] != "E"){
        return !(officeTiles[x][y].yPos < kirk.bottom && officeTiles[x][y].yPos + gameScalar > kirk.top);
      }
    }
  }
}

function checkDown(){

}

function checkLeft(){

}

function checkRight(){

}

function assignClasses(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (officeTiles[y][x] === "W"){
        officeTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "Wall", wall);
      }
      else if (officeTiles[y][x] === "B"){
        officeTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "Bookcase", bookcase);
      }
      else if (officeTiles[y][x] === "D"){
        officeTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "Door", door);
      }
    }
  }
}

function displayStuff(){
  for (let i = 0; i < officeTiles.length; i++){
    for (let j = 0; j < officeTiles.length; j++){
      if (officeTiles[j][i].type === "Wall" || officeTiles[j][i].type === "Bookcase" || officeTiles[j][i].type === "Door"){
        officeTiles[j][i].displaySelf();
      }
    }
  }
}

///////////////////////////////////////////////////////// Classes

class SetPiece{
  constructor(xPos, yPos, type, image){
    this.type = type;
    this.image = image;
    this.xPos = xPos;
    this.yPos = yPos;
  }

  displaySelf(){
    if (this.type !== "Door") {
      image(this.image, this.xPos, this.yPos, gameScalar, gameScalar);
    }
    else {
      image(this.image, this.xPos, this.yPos, gameScalar, 2*gameScalar);
    }
  }
}