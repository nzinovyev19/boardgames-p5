class ViewManager {
  constructor(boardgames) {
    this.currentView = '2d'; // '2d' или '3d'
    this.planets = Object.values(boardgames).map((boardgame, i) => createPlanet(boardgame, i));
    this.renderer2D = new Renderer2D();
    this.renderer3D = new Renderer3D();
    this.transitionDuration = 1000; // мс
    this.isTransitioning = false;
  }

  switchTo(viewType) {
    if (this.isTransitioning || this.currentView === viewType) return;

    this.isTransitioning = true;
    // this.animateTransition(viewType);
  }

  animateTransition(newViewType) {
    // Анимация перехода
    const startTime = millis();
    const oldView = this.currentView;

    // Сохраняем текущие позиции планет
    const oldPositions = this.planets.map(p => ({x: p.screenX, y: p.screenY}));

    // Вычисляем новые позиции
    this.currentView = newViewType;
    this.updatePlanets(); // Пересчитываем позиции для нового режима
    const newPositions = this.planets.map(p => ({x: p.screenX, y: p.screenY}));

    // Запускаем интерполяцию
    this.interpolatePositions(oldPositions, newPositions, startTime);
  }

  interpolatePositions(oldPos, newPos, startTime) {
    const currentTime = millis();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / this.transitionDuration, 1);

    // Плавная интерполяция (easing)
    const eased = this.easeInOutCubic(progress);

    this.planets.forEach((planet, i) => {
      planet.screenX = lerp(oldPos[i].x, newPos[i].x, eased);
      planet.screenY = lerp(oldPos[i].y, newPos[i].y, eased);
    });

    if (progress < 1) {
      // Продолжаем анимацию
      requestAnimationFrame(() => this.interpolatePositions(oldPos, newPos, startTime));
    } else {
      this.isTransitioning = false;
    }
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  update() {
    if (!this.isTransitioning) {
      this.getCurrentRenderer().update(this.planets);
    }
  }

  draw() {
    this.getCurrentRenderer().draw(this.planets);
  }

  getCurrentRenderer() {
    return this.currentView === '2d' ? this.renderer2D : this.renderer3D;
  }

  handleClick(mouseX, mouseY, modalOpen) {
    this.getCurrentRenderer().handleClick(this.planets, mouseX, mouseY, modalOpen);
  }
}