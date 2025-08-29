let boardgames;
let planets = [];
let viewManager;
let galaxyBackground;

// TODO: подобраться более красивое оформления шрифтов (либо прям сюда установить нормальный шрифт)
// TODO: поправить реализацию сетки в 2d рендере

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ modalOpen } = defineModal());

  galaxyBackground = new GalaxyBackground();

  // Отвечает за тип текущего рендерера и логику их переключения
  viewManager = new ViewManager(boardgames);
  // Отвечает за визуальную часть переключения, рендерит кнопки и вещает на них методы из viewManager
  uiManager = new UIManager(viewManager);
}

function draw() {
  galaxyBackground.update();
  galaxyBackground.draw();

  viewManager.update(planets);
  viewManager.draw(planets);

  textSize(30);
  text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}