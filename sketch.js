function defineModal() {
  const modal = select('#modal');
  const modalTitle = select('#modal-title');
  const modalGames = select('#modal-games');
  const modalDescription = select('#modal-description');
  const modalCloseButton = select('#modal-close');
  modalCloseButton.mousePressed(modalClose);


  function modalOpen({ name, games, description }) {
    modalTitle.elt.innerHTML = name;
    modalGames.elt.innerHTML = games;
    modalDescription.elt.innerHTML = description;

    modal.elt.style.display = 'flex';
  }

  function modalClose() {
    modal.elt.style.display = 'none';
  }

  return { modal, modalTitle, modalDescription, modalGames, modalCloseButton, modalClose, modalOpen };
};


const ROWS = 3;
const COLUMNS = 3;

const STROKE_OF_PLANETS = 5;
const PADDING_TOP = 150;
const PADDING_LEFT = 100;

let boardgames;
let modalOpen;

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(600, 600);
  ({ modalOpen } = defineModal());
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


    // Draw planet
    fill(paletteLerp([
      ['white', 0],
      ['orange', 5],
      ['red', 10]
    ], boardgame.difficult));
    stroke("orange");
    strokeWeight(STROKE_OF_PLANETS);
    circle(positionByHorizontal, positionByVerticaly, boardgame.games);

    // Draw planet text
    fill("rgb(33,30,226)");
    stroke("rgb(222,164,232)");
    textSize(10);
    text(boardgame.name, positionByHorizontal, positionByVerticaly + boardgame.games + STROKE_OF_PLANETS);

    // Handle click on planet
    // TODO: textBounds()
    // rect(positionByHorizontal, positionByVerticaly, boardgame.games, boardgame.games);
    if (
      mouseIsPressed
      && mouseX > (positionByHorizontal - (boardgame.games / 2))
      && mouseX < (positionByHorizontal + (boardgame.games / 2))
      && mouseY > (positionByVerticaly - (boardgame.games / 2))
      && mouseY < (positionByVerticaly + (boardgame.games / 2))
    ) {
      modalOpen({ name: boardgame.name, games: boardgame.games, description: boardgame.description });
    }
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