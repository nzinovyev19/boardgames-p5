let font;
let boardgames;
let planets = [];
let viewManager;
let galaxyBackground;

/*
* FIXME: стоит довести до выложенного состояния (можно ли для этого использовать github?
* Кажется, через github-pages раньше вполне было можно)
* TODO: стоит прикрутить использования самой модалки, вывести все поля (добавить возможность увеличвать кол-во игр)
* TODO: а также можно добавить данные для сохранения сыгранных игры (с именами игроков и победителем)
* TODO: можно выводить планеты в 3D-рендере по радиусу (маленькие планеты ближе к центру, большие дальше)
* TODO: дорабатывать и формализовывать нормальную паллетку
*/

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