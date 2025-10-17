let font;
let boardgames;
let planets = [];
let viewManager;
let galaxyBackground;

/*
* TODO: сделать Modal также классовым для единообразия
* TODO: подумать о переиспользовании палетки в tailwind
* TODO: можно выводить планеты в 3D-рендере по радиусу (маленькие планеты ближе к центру, большие дальше)
* TODO: аи-идея - управление камерой с помощью мыши для исследования "игровой вселенной"
* TODO: надо лучше продумать логику работу boardgame.games и boardgame.history полей - сделать их независимыми
*/

function preload() {
  // Загружаем шрифт, игры будут загружены через storage-manager в setup()
  font = loadFont('./fonts/Exo2-VariableFont_wght.ttf');
}

function setup() {
  textFont(font);

  createCanvas(windowWidth, windowHeight);

  // Загружаем игры через storage-manager
  boardgames = storageManager.loadGames();

  // Если localStorage пуст, загружаем из boardgames.json
  if (boardgames.length === 0) {
    // Асинхронная загрузка для инициализации
    loadJSON('/boardgames.json', (externalGames) => {
      storageManager.initializeFromExternal(externalGames);
      boardgames = storageManager.getAllGames();

      // Пересоздаем ViewManager с новыми данными
      viewManager = new ViewManager(boardgames);
      uiManager = new UIManager(viewManager);
    });
  }

  // TODO: как будто раз у меня пошел уже такой объектно-ориентированный стиль, то можно перевести модалку также на класс
  ({ modalOpen } = defineModal());

  galaxyBackground = new GalaxyBackground();

  // Создаем ViewManager только если данные уже загружены
  if (boardgames.length > 0) {
    // Отвечает за тип текущего рендерера и логику их переключения
    viewManager = new ViewManager(boardgames);
    // Отвечает за визуальную часть переключения, рендерит кнопки и вешает на них методы из viewManager
    uiManager = new UIManager(viewManager);
  }
}

function draw() {
  galaxyBackground.update();
  galaxyBackground.draw();

  // Обновляем и рисуем только если ViewManager создан
  if (viewManager) {
    viewManager.update(planets);
    viewManager.draw(planets);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}