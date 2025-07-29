let boardgames;
let planets = [];

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ modalOpen } = defineModal());

  Object.values(boardgames).map((boardgame, i) => {
    planets.push(createPlanet(boardgame, i));
  })
}

function draw() {
  background("rgba(18,15,15,0.17)");

  fill("rgb(33,30,226)");
  stroke("rgb(222,164,232)");
  textSize(30);
  textAlign(CENTER);
  text("Boardgames galaxy", width / 2, 50);

  planets.forEach(planet => {
    updatePlanet(planet);
    drawPlanet(planet);
    // checkPlanetClick(planet);
  });

  // Object.values(boardgames).map((boardgame, i) => {

  //   // const gapInRow = width / COLUMNS;
  //   // const gapInColumn = (height / 5);

  //   // const positionByHorizontal = i * gapInRow % width + PADDING_LEFT;
  //   // const positionByVerticaly = Math.floor(i / ROWS) * gapInColumn + PADDING_TOP;
  //   // let speedY = random(-2, 2);
  //   // let speedX = random(-2, 2);

  //   // let x = positionByHorizontal;
  //   // let y = positionByVerticaly;

  //   // Draw planet
  //   // fill(paletteLerp([
  //   //   ['white', 0],
  //   //   ['orange', 5],
  //   //   ['red', 10]
  //   // ], boardgame.difficult));
  //   // stroke("orange");
  //   // strokeWeight(STROKE_OF_PLANETS);

  //   // x += positionByHorizontal + speedX;
  //   // y += positionByVerticaly + speedY;
  //   // circle(x, y, boardgame.games);
  //   // // Keep the circle within the canvas boundaries
  //   // if (x > positionByHorizontal - 100 || x < 25) {
  //   //   speedX *= -1;
  //   // }
  //   // if (y > height - 25 || y < 25) {
  //   //   speedY *= -1;
  //   // }

  //   let { x, y, speedX, speedY } = definePlanet(boardgame, i);
  //   x += speedX;
  //   y += speedY;
  //   if (x > width - 100 || x < 25) {
  //     speedX *= -1;
  //   }
  //   if (y > height - 25 || y < 25) {
  //     speedY *= -1;
  //   }
  //   // circle(x, y, boardgame.games);
  //   // Keep the circle within the canvas boundaries


  //   // Draw planet text
  //   // fill("rgb(33,30,226)");
  //   // stroke("rgb(222,164,232)");
  //   // textSize(10);
  //   // text(boardgame.name, positionByHorizontal, positionByVerticaly + boardgame.games + STROKE_OF_PLANETS);

  //   // Handle click on planet
  //   // TODO: textBounds()
  //   // rect(positionByHorizontal, positionByVerticaly, boardgame.games, boardgame.games);
  //   // if (
  //   //   mouseIsPressed
  //   //   && mouseX > (positionByHorizontal - (boardgame.games / 2))
  //   //   && mouseX < (positionByHorizontal + (boardgame.games / 2))
  //   //   && mouseY > (positionByVerticaly - (boardgame.games / 2))
  //   //   && mouseY < (positionByVerticaly + (boardgame.games / 2))
  //   // ) {
  //   //   modalOpen({ name: boardgame.name, games: boardgame.games, description: boardgame.description });
  //   // }
  // })

  // fill("yellow");
  // stroke("orange");
  // strokeWeight(10);
  // circle(150, 100, 50);

  // fill("red");
  // stroke("rgb(156,130,145)");
  // strokeWeight(7);
  // circle(300, 200, 50);

  // fill("rgb(33,30,226)");
  // stroke("rgb(222,164,232)");
  // strokeWeight(5);
  // circle(80, 260, 50);

  textSize(30);
  // rotate(QUARTER_PI / 100);
  text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}