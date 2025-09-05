let font;
let boardgames;
let planets = [];
let viewManager;
let galaxyBackground;

// TODO: дорабатывать и формализовывать нормальную паллетку
const UI_PALETTE = {
  // Основные цвета текста
  primary: '#E2E8F0',      // Светло-серый (основной текст)
  // secondary: '#94A3B8',    // Приглушённый серый (вторичный текст)
  // accent: '#60A5FA',       // Космический синий (акценты, ссылки)

  // Специальные цвета
  highlight: '#F59E0B',    // Звёздный янтарь (важные элементы)
  // success: '#10B981',      // Космический зелёный (успех, активные состояния)

  // Фоновые цвета для UI
  surface: 'rgba(18,15,15,0.17)',     // Тёмная поверхность
  // surfaceHover: 'rgba(99, 102, 241, 0.3)', // При наведении
}

function preload() {
  boardgames = loadJSON('/boardgames.json');
  font = loadFont('./fonts/Exo2-VariableFont_wght.ttf');
}

function setup() {
  textFont(font);

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

  // textSize(30);
  // text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}