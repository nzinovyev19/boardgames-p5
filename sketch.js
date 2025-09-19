let font;
let boardgames;
let planets = [];
let viewManager;
let galaxyBackground;

/*
* FIXME: стоит довести до выложенного состояния (можно ли для этого использовать github?
* Кажется, через github-pages раньше вполне было можно)
* TODO: можно выводить планеты в 3D-рендере по радиусу (маленькие планеты ближе к центру, большие дальше)
* TODO: дорабатывать и формализовывать нормальную паллетку
* TODO: надо лучше продумать логику работу boardgame.games и boardgame.history полей - сделать их назависимыми
*/

const UI_PALETTE = {
  // Основные цвета текста
  primary: '#E2E8F0',      // Светло-серый (основной текст)

  // Специальные цвета
  highlight: '#F59E0B',    // Звёздный янтарь (важные элементы)

  // Фоновые цвета для UI
  surface: 'rgba(18,15,15,0.17)',     // Тёмная поверхность
}

function preload() {
  boardgames = loadJSON('/boardgames.json');
  font = loadFont('./fonts/Exo2-VariableFont_wght.ttf');
}

function setup() {
  textFont(font);

  createCanvas(windowWidth, windowHeight);
  // TODO: как будто раз у меня пошел уже такой объектно-ориентированный стиль, то можно перевести модалку также на класс
  ({ modalOpen } = defineModal());

  galaxyBackground = new GalaxyBackground();

  // Отвечает за тип текущего рендерера и логику их переключения
  viewManager = new ViewManager(boardgames);
  // Отвечает за визуальную часть переключения, рендерит кнопки и вешает на них методы из viewManager
  uiManager = new UIManager(viewManager);
}

function draw() {
  galaxyBackground.update();
  galaxyBackground.draw();

  viewManager.update(planets);
  viewManager.draw(planets);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}