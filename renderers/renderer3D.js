const STROKE_OF_PLANETS = 5;

class Renderer3D extends BaseRenderer {
  constructor() {
    super();
    this.name = '3d';
  }

  update(planets) {
    planets.forEach(planet => {
      // Орбитальное движение
      planet.orbitAngle += planet.orbitSpeed;

      const x3d = Math.cos(planet.orbitAngle) * planet.orbitRadius;
      const z3d = Math.sin(planet.orbitAngle) * planet.orbitRadius;
      const y3d = Math.sin(planet.orbitAngle) * planet.orbitRadius * Math.sin(planet.orbitInclination);

      planet.screenX = planet.centerX + x3d;
      planet.screenY = planet.centerY + y3d;
      planet.z = z3d;
    });

    // Сортируем по глубине
    planets.sort((a, b) => a.z - b.z);
  }

  draw(planets) {
    planets.forEach(planet => {
      this.drawOrbit(planet);
      this.drawPlanet(planet);
    });
  }

  drawPlanet(planet) {
    const depthScale = map(planet.z, -planet.orbitRadius, planet.orbitRadius, 0.7, 1.3);
    const planetSize = planet.radius * depthScale;

    // Яркость зависит от глубины (дальше = темнее)
    const brightness = map(planet.z, -planet.orbitRadius, planet.orbitRadius, 100, 255);

    const planetColor = paletteLerp([
      ['white', 0],
      ['orange', 5],
      ['red', 10]
    ], planet.boardgame.difficult);


    // Применяем яркость
    const currentFill = color(red(planetColor), green(planetColor), blue(planetColor), brightness);
    fill(currentFill);

    stroke("orange");
    strokeWeight(STROKE_OF_PLANETS * depthScale);

    circle(planet.screenX, planet.screenY, planetSize);

    // Название планеты
    fill("rgb(33,30,226)");
    stroke("rgb(222,164,232)");
    textSize(8 * depthScale);
    textAlign(CENTER);
    text(planet.boardgame.name,
      planet.screenX,
      planet.screenY + planetSize/2 + STROKE_OF_PLANETS + 15
    );
  }

  drawOrbit(planet) {
    if (planet.orbitPoints.length < 2) return;

    const planetColor = paletteLerp([
      ['white', 0],
      ['orange', 5],
      ['red', 10]
    ], planet.boardgame.difficult);

    noFill();

    for (let i = 1; i < planet.orbitPoints.length; i++) {
      const progress = i / (planet.orbitPoints.length - 1);
      const alpha = map(progress, 0, 1, 10, 80);
      const weight = map(progress, 0, 1, 0.5, 2);

      // Учитываем глубину для прозрачности трейла
      const depthAlpha = map(planet.orbitPoints[i].z, -planet.orbitRadius, planet.orbitRadius, 0.5, 1);

      stroke(red(planetColor), green(planetColor), blue(planetColor), alpha * depthAlpha);
      strokeWeight(weight);

      line(
        planet.orbitPoints[i-1].x, planet.orbitPoints[i-1].y,
        planet.orbitPoints[i].x, planet.orbitPoints[i].y
      );
    }
  }
}