class ViewManager {
  constructor(boardgames) {
    this.currentView = '3d'; // '2d' или '3d'
    this.planets = Object.values(boardgames).map((boardgame, i) => createPlanet(boardgame, i));
    this.renderer2D = new Renderer2D();
    this.renderer3D = new Renderer3D();
  }

  switchTo(viewType) {
    if (this.currentView === viewType) return;

    console.log(`Переключение с ${this.currentView} на ${viewType}`);
    this.currentView = viewType;

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
}