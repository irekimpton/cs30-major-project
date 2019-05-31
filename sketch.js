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
let gridTiles;

let bookcase;
let wall;
let door;

let itemFrame;
let otherItemFrame
let knuckles;
let kirkRight;
let imageList;

let kirk;

let doorToStreet;


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

  kirkRight = loadImage("assets/kirk/kirkRight.png");
  kirkLeft = loadImage("assets/kirk/kirkLeft.png");

  imageList = [knuckles, laserCannon];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameScalar = height/12;

  gridTiles = create2dArray(12, 12);

  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      let tileType = officeLines[x][y];
      gridTiles[x][y] = tileType;
    }
  }
  console.log(gridTiles);

  kirk = {
    image: kirkRight,
    xPos: height/2-gameScalar/2,
    yPos: height/2-gameScalar,
    speed: 5,
  }

  doorToStreet = {
    active: false,
    xPos: 0,
    yPos: 0,
    image: door,
  }

  assignLevel();

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
  imageMode(CORNER);
  image(kirk.image, kirk.xPos, kirk.yPos, gameScalar, 2*gameScalar);
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
  if (keyIsDown(87)){ //UP
    for(let i = 0; i < kirk.speed; i++){
      kirk.yPos -= 1;
      if (invalidMove()){
        kirk.yPos += 1;
      }
    }
  }

  if (keyIsDown(83)){ //DOWN
    for(let i = 0; i < kirk.speed; i++){
      kirk.yPos += 1;
      if (invalidMove()){
        kirk.yPos -= 1;
      }
    }
  }

  if (keyIsDown(65)){ //RIGHT
    for(let i = 0; i < kirk.speed; i++){
      kirk.xPos -= 1;
      if (invalidMove()){
        kirk.xPos += 1;
      }
    }
    kirk.image = kirkLeft
  }

  if (keyIsDown(68)){ //LEFT
    for(let i = 0; i < kirk.speed; i++){
      kirk.xPos += 1;
      if (invalidMove()){
        kirk.xPos -= 1;
      }
    }
    kirk.image = kirkRight
  }
}

function invalidMove(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (gridTiles[x][y] !== "E" && gridTiles[x][y] !== doorToStreet){
        if ((kirk.xPos + gameScalar > gridTiles[x][y].xPos && kirk.xPos + gameScalar < gridTiles[x][y].xPos + gameScalar*2) && (kirk.yPos + gameScalar*2 > gridTiles[x][y].yPos && kirk.yPos < gridTiles[x][y].yPos + gameScalar)){
          return true
        }
      }
    }
  }
  return false
}

function assignLevel(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (gridTiles[y][x] === "W"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "Wall", wall);
      }
      else if (gridTiles[y][x] === "B"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "Bookcase", bookcase);
      }
      else if(gridTiles[y][x] === "1"){
        gridTiles[y][x] = doorToStreet;
        doorToStreet.xPos = x*gameScalar;
        doorToStreet.yPos = y*gameScalar;
        doorToStreet.active = true;
      }
    }
  }
}

function displayStuff(){
  for (let i = 0; i < gridTiles.length; i++){
    for (let j = 0; j < gridTiles.length; j++){
      if (gridTiles[j][i].type === "Wall" || gridTiles[j][i].type === "Bookcase"){
        gridTiles[j][i].displaySelf();
      }
      if (gridTiles[j][i] === doorToStreet){
        image(door, doorToStreet.xPos, doorToStreet.yPos, gameScalar, 2*gameScalar);
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
    image(this.image, this.xPos, this.yPos, gameScalar, gameScalar);
  }
}