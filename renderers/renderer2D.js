class Renderer2D extends BaseRenderer {
  constructor() {
    super();
    this.name = '2d';
    this.gridCols = 3;
    this.gridRows = 3;
  }

  update(planets) {
    planets.forEach((planet, i) => {
      // Сетка 2D позиций
      const gapX = width / this.gridCols;
      const gapY = height / this.gridRows;
      const paddingX = 100;
      const paddingY = 150;

      const targetX = (i % this.gridCols) * gapX + paddingX;
      const targetY = Math.floor(i / this.gridCols) * gapY + paddingY;

      planet.screenX = targetX;
      planet.screenY = targetY;
      planet.z = 0; // Все на одном уровне в 2D

      // Легкое покачивание
      planet.screenX += Math.sin(frameCount * 0.01 + i) * 5;
      planet.screenY += Math.cos(frameCount * 0.015 + i) * 3;
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
    stroke("orange");
    strokeWeight(3);
    circle(planet.screenX, planet.screenY, planet.radius);

    // Название
    fill("rgb(33,30,226)");
    stroke("rgb(222,164,232)");
    textSize(10);
    textAlign(CENTER);
    text(planet.boardgame.name,
      planet.screenX,
      planet.screenY + planet.radius/2 + 20
    );
  }
}