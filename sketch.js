let boardgames;
let planets = [];
let galaxyBackground;

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ modalOpen } = defineModal());

  galaxyBackground = new GalaxyBackground();

  Object.values(boardgames).map((boardgame, i) => {
    planets.push(createPlanet(boardgame, i));
  })

}

function draw() {
  galaxyBackground.update();
  galaxyBackground.draw();

  fill("rgb(33,30,226)");
  stroke("rgb(222,164,232)");
  textSize(30);
  textAlign(CENTER);
  text("Boardgames galaxy", width / 2, 50);

  planets.forEach(planet => {
    updatePlanet(planet);
    drawPlanet(planet);
    checkPlanetClick(planet, modalOpen);
  });

  textSize(30);
  text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}