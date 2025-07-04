let boardgames;

// TODO: оформить логику для определения цвета планеты по жанру или сложности
// fill(paletteLerp([
//     ['white', 0],
//     ['red', 3],
//     ['green', 6],
//     ['blue', 10]
//   ], boardgame.difficult));
// const PALITRE_COLOR_BY_GENRE = {
// }

const ROWS = 3;
const COLUMNS = 3;

const STROKE_OF_PLANETS = 10;
const PADDING_TOP = 150;
const PADDING_LEFT = 100;

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background("rgba(18,15,15,0.17)");

  fill("rgb(33,30,226)");
  stroke("rgb(222,164,232)");
  textSize(30);
  textAlign(CENTER);
  text("Boardgames galaxy", width / 2, 50);

  Object.values(boardgames).map((boardgame, i) => {

    const gapInRow = width / COLUMNS;
    const gapInColumn = (height / 5);

    const positionByHorizontal = i * gapInRow % width + PADDING_LEFT;
    const positionByVerticaly = Math.floor(i / ROWS) * gapInColumn + PADDING_TOP;


    fill("yellow")
    stroke("orange");
    strokeWeight(STROKE_OF_PLANETS);
    circle(positionByHorizontal, positionByVerticaly, boardgame.games);

    fill("rgb(33,30,226)");
    stroke("rgb(222,164,232)");
    textSize(10);
    text(boardgame.name, positionByHorizontal, positionByVerticaly + boardgame.games + STROKE_OF_PLANETS);
  })

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
  text("🚀", frameCount % height, frameCount % width);
}

/**
 *
 */