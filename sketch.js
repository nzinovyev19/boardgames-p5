let boardgames;
let planets = [];
let uiManager;
let viewManager;
let galaxyBackground;

// TODO: прибрать закомменченный код
// TODO: подобраться более красивое оформления шрифтов (либо прям сюда установить нормальный шрифт)
// TODO: поправить реализацию сетки в 2d рендере

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ modalOpen } = defineModal());

  galaxyBackground = new GalaxyBackground();

  // Инициализация менеджеров
  viewManager = new ViewManager(boardgames);
  uiManager = new UIManager(viewManager);

  // Object.values(boardgames).map((boardgame, i) => {
  //   // planets.push(createPlanet(boardgame, i))
  //   viewManager.planets.push(createPlanet(boardgame, i));
  // })
}

function draw() {
  galaxyBackground.update();
  galaxyBackground.draw();

  viewManager.update(planets);
  viewManager.draw(planets);
  // planets.forEach(planet => {
  //   updatePlanet(planet);
  //   drawPlanet(planet);
  //   checkPlanetClick(planet, modalOpen);
  // });

  textSize(30);
  text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}