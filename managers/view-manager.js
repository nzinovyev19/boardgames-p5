class ViewManager {
  constructor(boardgames) {
    this.currentView = storageManager.getCurrentView(); // Загружаем из localStorage
    this.boardgames = boardgames; // Сохраняем ссылку на данные
    this.planets = Object.values(boardgames).map((boardgame, i) => createPlanet(boardgame, i));
    this.renderer2D = new Renderer2D();
    this.renderer3D = new Renderer3D();
    
    // Подписываемся на изменения данных
    storageManager.subscribe((event, data) => {
      if (event === 'gamesUpdated') {
        this.updatePlanetsFromData(data);
      }
    });
  }

  switchTo(viewType) {
    if (this.currentView === viewType) return;

    this.currentView = viewType;
    storageManager.setCurrentView(viewType); // Сохраняем в localStorage

    // Просто пересчитываем позиции для нового режима
    this.updatePlanets();
  }

  updatePlanets() {
    // Делегируем обновление текущему рендереру
    this.getCurrentRenderer().update(this.planets);
  }

  update() {
    this.updatePlanets();
  }

  draw() {
    this.getCurrentRenderer().draw(this.planets);
    this.handleClick(mouseX, mouseY, modalOpen);
  }

  getCurrentRenderer() {
    return this.currentView === '2d' ? this.renderer2D : this.renderer3D;
  }

  handleClick(mouseX, mouseY, modalOpen) {
    this.getCurrentRenderer().handleClick(this.planets, mouseX, mouseY, modalOpen);
  }

  // Обновляет планеты при изменении данных игр
  updatePlanetsFromData(updatedGames) {
    this.boardgames = updatedGames;
    
    this.planets.forEach((planet, i) => {
      if (updatedGames[i]) {
        planet.boardgame = updatedGames[i];
        // FIXME: протекает логика из planet.js
        planet.radius = planet.boardgame.games * 3 + 10;
      }
    });
    
  }
}