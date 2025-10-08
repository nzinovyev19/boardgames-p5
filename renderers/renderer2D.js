class Renderer2D extends BaseRenderer {
  constructor() {
    super();
    this.name = '2d';
    this.gridCols = 3;
    this.gridRows = 3;
  }

  update(planets) {
    const planetsCount = planets.length;

    // Автоматически подбираем сетку (простая логика)
    const cols = Math.ceil(Math.sqrt(planetsCount));
    const rows = Math.ceil(planetsCount / cols);

    // Размеры ячеек с отступами
    const paddingHoriontal = 100;
    const paddingVertical = 20;
    const cellWidth = (width - paddingHoriontal * 2) / cols;
    const cellHeight = (height - paddingVertical * 2) / rows;

    // Центрируем сетку
    const gridWidth = cols * cellWidth;
    const gridHeight = rows * cellHeight;
    const startX = (width - gridWidth) / 2;
    const startY = (height - gridHeight) / 2;

    planets.forEach((planet, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Центр каждой ячейки
      planet.screenX = startX + (col + 0.5) * cellWidth;
      planet.screenY = startY + (row + 0.5) * cellHeight;
      planet.z = 0;

      // Легкое покачивание
      planet.screenX += Math.sin(frameCount * 0.01 + i) * 3;
      planet.screenY += Math.cos(frameCount * 0.015 + i) * 2;
    });
  }

  draw(planets) {
    planets.forEach(planet => {
      this.drawPlanet2D(planet);
    });
  }

  drawPlanet2D(planet) {
    const planetColor = paletteLerp([
      ['white', 0],
      ['orange', 5],
      ['red', 10]
    ], planet.boardgame.difficult);

    // 2D стиль без эффектов глубины
    fill(planetColor);
    stroke(PALETTE.accent.primary);
    strokeWeight(3);
    circle(planet.screenX, planet.screenY, planet.radius);

    // Название
    fill(PALETTE.primary.text);
    strokeWeight(0);
    textSize(16);
    textAlign(CENTER);
    text(planet.boardgame.name,
      planet.screenX,
      planet.screenY + planet.radius/2 + 20
    );
  }
}