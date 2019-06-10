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
let alleyLevelOne;
let alleyLinesOne;

let gridTiles;

let bookcase;
let wall;
let dumpster;
let desk;
let doorRight;
let doorLeft;

let itemFrame;
let otherItemFrame
let knuckles;
let imageList;

let kirkRight;
let kirkLeft;
let ferdinandRight;

let kirk;

let enemyList;

let officeMusic;

function preload(){
  ///// LEVELS
  officeLevel = "assets/levels/officeLevel.txt";
  officeLines = loadStrings(officeLevel);
  alleyLevelOne = "assets/levels/alleyLevelOne.txt";
  alleyLinesOne = loadStrings(alleyLevelOne);

  ///// MUSIC
  officeMusic = loadSound("assets/music/officeMusic.mp3");

  ///// IMAGES
  itemFrame = loadImage("assets/miscSprites/itemFrame.png");
  otherItemFrame = loadImage("assets/miscSprites/otherItemFrame.png");

  knuckles = loadImage("assets/items/knuckles.png");
  laserCannon = loadImage("assets/items/laserCannon.png");

  bookcase = loadImage("assets/setPieces/bookcase.png");
  wall = loadImage("assets/setPieces/wall.png");
  doorRight = loadImage("assets/setPieces/doorRight.png");
  doorLeft = loadImage("assets/setPieces/doorLeft.png");
  dumpster = loadImage("assets/setPieces/dumpster.png");
  desk = loadImage("assets/setPieces/desk.png");

  kirkRight = loadImage("assets/kirk/kirkRight.png");
  kirkLeft = loadImage("assets/kirk/kirkLeft.png");

  ferdinandRight = loadImage("assets/enemies/ferdinandRight.png");

  imageList = [knuckles, laserCannon];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameScalar = floor(height/12);

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
    xPos: floor(height/2-gameScalar/2),
    yPos: floor(height/2-gameScalar),
    speed: 5,
  }

  assignLevel();
  kirk.xPos = floor(height/2-gameScalar/2);
  kirk.yPos = floor(height/2-gameScalar);
  
  officeMusic.loop();

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
    moveEnemies();
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
  displayStuff();
  displayEnemies();
  image(kirk.image, kirk.xPos, kirk.yPos, gameScalar, 2*gameScalar);
  displayDoors();
}

function keyPressed(){
  if (gameMode === "game"){
    if (key === "e"){
      paused = !paused;
    }
  }
}

function honk(){
  console.log("honk");
}

function windowResized(){
  createCanvas(windowWidth, windowHeight);
}

function mouseClicked(){
  if (paused === true){
    pickUp();
  }
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
      floor(kirk.yPos);
      if (invalidMove()){
        kirk.yPos += 1;
      }
    }
  }


  if (keyIsDown(83)){ //DOWN
    for(let i = 0; i < kirk.speed; i++){
      kirk.yPos += 1;
      floor(kirk.yPos);
      if (invalidMove()){
        kirk.yPos -= 1;
      }
    }
  }

  if (keyIsDown(65)){ //LEFT
    for(let i = 0; i < kirk.speed; i++){
      kirk.xPos -= 1;
      floor(kirk.xPos);
      if (invalidMove()){
        kirk.xPos += 1;
      }
    }
    kirk.image = kirkLeft;
  }

  if (keyIsDown(68)){ //RIGHT
    for(let i = 0; i < kirk.speed; i++){
      kirk.xPos += 1;
      floor(kirk.xPos);
      if (invalidMove()){
        kirk.xPos -= 1;
      }
    }
    kirk.image = kirkRight;
  }
}

function invalidMove(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (gridTiles[x][y] !== "." && gridTiles[x][y] !== "K"){
        if (gridTiles[x][y].type === "wall" || gridTiles[x][y].type === "bookcase"){
          if ((kirk.xPos + gameScalar > gridTiles[x][y].xPos && kirk.xPos < gridTiles[x][y].xPos + gameScalar) && (kirk.yPos + gameScalar*2 > gridTiles[x][y].yPos && kirk.yPos + gameScalar < gridTiles[x][y].yPos + gameScalar)){
            return true;
          }
        }
        if (gridTiles[x][y].type === "dumpster"){
          if ((kirk.xPos + gameScalar > gridTiles[x][y].xPos && kirk.xPos < gridTiles[x][y].xPos + gameScalar*2) && (kirk.yPos + gameScalar*2 > gridTiles[x][y].yPos && kirk.yPos + gameScalar < gridTiles[x][y].yPos + gameScalar*2)){
            return true;
          }
        }
        if (gridTiles[x][y].type === "desk"){
          if ((kirk.xPos + gameScalar > gridTiles[x][y].xPos && kirk.xPos < gridTiles[x][y].xPos + gameScalar*2) && (kirk.yPos + gameScalar*2 > gridTiles[x][y].yPos && kirk.yPos + gameScalar < gridTiles[x][y].yPos + gameScalar)){
            return true;
          }
        }
        if (gridTiles[x][y].type === "door"){
          if ((kirk.xPos + gameScalar/2 > gridTiles[x][y].xPos && kirk.xPos < gridTiles[x][y].xPos + gameScalar/2) && (kirk.yPos + gameScalar*2 > gridTiles[x][y].yPos && kirk.yPos < gridTiles[x][y].yPos + gameScalar)){
            goTo(gridTiles[x][y].destination);
            return true;
          }
        }
      }
    }
  }
  return false;
}

function moveEnemies(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (gridTiles[x][y] !== "."){
        if (gridTiles[x][y].type === "enemy"){
          gridTiles[x][y].moveSelf();
        }
      }
    }
  }
}

function assignLevel(){
  for (let y = 0; y < 12; y++){
    for (let x = 0; x < 12; x++) {
      if (gridTiles[y][x] === "K"){
        kirk.xPos = x*gameScalar;
        kirk.yPos = y*gameScalar - gameScalar;
      }
      if (gridTiles[y][x] === "W"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "wall", wall);
      }
      else if (gridTiles[y][x] === "B"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "bookcase", bookcase);
      }
      else if (gridTiles[y][x] === "T"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "dumpster", dumpster);
      }
      else if (gridTiles[y][x] === "D"){
        gridTiles[y][x] = new SetPiece(x*gameScalar, y*gameScalar, "desk", desk);
      }
      else if (gridTiles[y][x] === "1"){
        gridTiles[y][x] = new Door(x*gameScalar, y*gameScalar, "door", doorRight, "alley");
      }
      else if (gridTiles[y][x] === "2"){
        gridTiles[y][x] = new Door(x*gameScalar, y*gameScalar, "door", doorLeft, "office");
      }
      else if (gridTiles[y][x] === "E"){
        gridTiles[y][x] = new Enemy(x*gameScalar, y*gameScalar, "enemy", ferdinandRight);
      }
    }
  }
}

function displayStuff(){
  for (let i = 0; i < gridTiles.length; i++){
    for (let j = 0; j < gridTiles.length; j++){
      if (gridTiles[j][i] !== "."){
        if (gridTiles[j][i].type === "wall" || gridTiles[j][i].type === "bookcase" || gridTiles[j][i].type === "dumpster" || gridTiles[j][i].type === "desk"){
          gridTiles[j][i].displaySelf();
        }
      }
    }
  }
}

function displayDoors(){
  for (let i = 0; i < gridTiles.length; i++){
    for (let j = 0; j < gridTiles.length; j++){
      if (gridTiles[j][i] !== "."){
        if (gridTiles[j][i].type === "door"){
          gridTiles[j][i].displaySelf();
        }
      }
    }
  }
}

function displayEnemies(){
  for (let i = 0; i < gridTiles.length; i++){
    for (let j = 0; j < gridTiles.length; j++){
      if (gridTiles[j][i] !== "."){
        if (gridTiles[j][i].type === "enemy"){
          gridTiles[j][i].displaySelf();
        }
      }
    }
  }
}

function goTo(place){
  if (place === "alley"){
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 12; x++) {
        let tileType = alleyLinesOne[x][y];
        gridTiles[x][y] = tileType;
      }
    }
    if (officeMusic.isPlaying()){
      stop();
    }
  }
  if (place === "office"){
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 12; x++) {
        let tileType = officeLines[x][y];
        gridTiles[x][y] = tileType;
      }
    }
  }
  assignLevel();
  officeMusic.loop();
  console.log(gridTiles);
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
    if (this.type === "dumpster"){
      image(this.image, this.xPos, this.yPos, 2*gameScalar, 2*gameScalar)
    }
    else if (this.type === "desk"){
      image(this.image, this.xPos, this.yPos, 2*gameScalar, gameScalar)
    }
    else{
      image(this.image, this.xPos, this.yPos, gameScalar, gameScalar);
    }
  }
}

class Door{
  constructor(xPos, yPos, type, image, destination){
    this.type = type
    this.image = image;
    this.xPos = xPos;
    this.yPos = yPos;
    this.destination = destination;
  }

  displaySelf(){
    image(this.image, this.xPos, this.yPos - gameScalar, gameScalar, 2*gameScalar);
  }
}

class Enemy{
  constructor(xPos, yPos, type, image){
    this.type = type
    this.image = image;
    this.xPos = xPos;
    this.yPos = yPos;
  }

  displaySelf(){
    image(this.image, this.xPos, this.yPos, gameScalar, 2*gameScalar);
  }

  moveSelf(){
    for (let i = 0; i < 2; i++){
      if (kirk.xPos > this.xPos){
        this.xPos += 1
        if (this.checkSelf()){
          this.xPos -= 1
        }
      }
      else if (kirk.xPos < this.xPos){
        this.xPos -= 1
        if (this.checkSelf()){
          this.xPos += 1
        }
      }
      if (kirk.yPos > this.yPos){
        this.yPos += 1
        if (this.checkSelf()){
          this.yPos -= 1
        }
      }
      else if (kirk.yPos < this.yPos){
        this.yPos -= 1
        if (this.checkSelf()){
          this.yPos += 1
        }
      }
    }
  }

  checkSelf(){
    for (let y = 0; y < 12; y++){
      for (let x = 0; x < 12; x++) {
        if (gridTiles[x][y] !== "." && gridTiles[x][y] !== "K"){
          if (gridTiles[x][y].type === "wall" || gridTiles[x][y].type === "bookcase"){
            if ((this.xPos + gameScalar > gridTiles[x][y].xPos && this.xPos < gridTiles[x][y].xPos  + gameScalar) && (this.yPos + gameScalar*2 > gridTiles[x][y].yPos && this.yPos + gameScalar < gridTiles[x][y].yPos + gameScalar)){
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}