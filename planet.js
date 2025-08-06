const ROWS = 3;
const COLUMNS = 3;

const STROKE_OF_PLANETS = 5;
const PADDING_TOP = 150;
const PADDING_LEFT = 100;

/**
 * Cуть такова, что мы рисуем планету (она же настольная игра). И в зависимости от кол-ва сыграных игр определяется
 * размер планет. А в зависимости от сложности игры определяется цвет
 * @param {*} boardgame
 * @param {*} i
 * @returns
 */

function createPlanet(boardgame, i) {
  const centerX = width / 2;  // Центр "солнечной системы"
  const centerY = height / 2;

  // Орбитальные параметры
  const orbitRadius = 150 + i * 80; // Расстояние от центра
  const orbitAngle = random(0, TWO_PI); // Начальный угол
  const orbitSpeed = 0.005 + random(-0.002, 0.002); // Скорость вращения
  const orbitInclination = PI / 8; // Наклон орбиты (22.5 градуса)

  const circumference = TWO_PI * orbitRadius;
  const pointDensity = 3; // Точек на единицу длины (настраиваемый параметр)
  const orbitResolution = Math.max(60, Math.floor(circumference / pointDensity)); // Минимум 60 точек

  // Предвычисляем точки орбиты
  const orbitPoints = [];

  for (let j = 0; j < orbitResolution; j++) {
    const angle = (j / orbitResolution) * TWO_PI;

    // 3D координаты
    const x3d = Math.cos(angle) * orbitRadius;
    const z3d = Math.sin(angle) * orbitRadius;
    const y3d = Math.sin(angle) * orbitRadius * Math.sin(orbitInclination);

    // Экранные координаты
    const screenX = centerX + x3d;
    const screenY = centerY + y3d;
    const depth = z3d;

    orbitPoints.push({ x: screenX, y: screenY, z: depth });
  }


  return {
    boardgame,
    centerX,
    centerY,
    orbitPoints,
    orbitRadius,
    orbitAngle,
    orbitSpeed,
    orbitInclination,
    radius: boardgame.games * 3 + 10, // Размер планеты
    z: 0, // Глубина для сортировки
    screenX: 0, // Экранные координаты
    screenY: 0,
    maxTrailLength: 40
  };
  // const gapInRow = width / COLUMNS;
  // const gapInColumn = (height / 5);
  // const centerX = i * gapInRow % width + PADDING_LEFT;
  // const centerY = Math.floor(i / ROWS) * gapInColumn + PADDING_TOP;

  // const areaSize = Math.min(gapInRow, gapInColumn) * 0.4;

  // return {
  //   boardgame,
  //   centerX,
  //   centerY,
  //   x: centerX + random(-areaSize/4, areaSize/4),
  //   y: centerY + random(-areaSize/4, areaSize/4),
  //   speedX: random(-0.5, 0.5),
  //   speedY: random(-0.5, 0.5),
  //   radius: boardgame.games,
  //   areaSize
  // }
}

function drawPlanet(planet) {
  // Размер планеты зависит от глубины (ближе = больше)
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

  // fill(paletteLerp([
  //   ['white', 0],
  //   ['orange', 5],
  //   ['red', 10]
  // ], planet.boardgame.difficult));
  // stroke("orange");
  // strokeWeight(STROKE_OF_PLANETS);

  // circle(planet.x, planet.y, planet.radius);

  // // Рисуем текст планеты
  // fill("rgb(33,30,226)");
  // stroke("rgb(222,164,232)");
  // textSize(10);
  // textAlign(CENTER);
  // text(planet.boardgame.name, planet.x, planet.y + planet.radius/2 + STROKE_OF_PLANETS + 10);

  //  // Опционально: рисуем границы области движения (для отладки)
  // stroke("rgba(255,255,255,0.3)");
  // strokeWeight(1);
  // noFill();
  // rectMode(CENTER);
  // rect(planet.centerX, planet.centerY, planet.areaSize, planet.areaSize);
  drawPlanetTrail(planet);
}

function drawPlanetTrail(planet) {
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

function updatePlanet(planet) {
  // Обновляем угол орбиты
  planet.orbitAngle += planet.orbitSpeed;

  // Вычисляем 3D позицию на орбите
  const x3d = Math.cos(planet.orbitAngle) * planet.orbitRadius;
  const z3d = Math.sin(planet.orbitAngle) * planet.orbitRadius;
  const y3d = Math.sin(planet.orbitAngle) * planet.orbitRadius * Math.sin(planet.orbitInclination);

  // Преобразуем в экранные координаты
  planet.screenX = planet.centerX + x3d;
  planet.screenY = planet.centerY + y3d;
  planet.z = z3d;

  // // Сохраняем позицию для трейла
  // planet.trail.push({
  //   x: planet.screenX,
  //   y: planet.screenY,
  //   z: planet.z
  // });

  // if (planet.trail.length > planet.maxTrailLength) {
  //   planet.trail.shift();
  // }

  // Сохраняем для сортировки по глубине
  // planet.x += planet.speedX;
  // planet.y += planet.speedY;

  // // Границы квадратной области
  // const leftBound = planet.centerX - planet.areaSize / 2;
  // const rightBound = planet.centerX + planet.areaSize / 2;
  // const topBound = planet.centerY - planet.areaSize / 2;
  // const bottomBound = planet.centerY + planet.areaSize / 2;

  // // Отражение от границ с небольшой случайностью
  // if (planet.x <= leftBound || planet.x >= rightBound) {
  //   planet.speedX *= -1;
  //   planet.speedX += random(-0.2, 0.2); // Добавляем хаотичность
  //   planet.x = constrain(planet.x, leftBound, rightBound);
  // }

  // if (planet.y <= topBound || planet.y >= bottomBound) {
  //   planet.speedY *= -1;
  //   planet.speedY += random(-0.2, 0.2); // Добавляем хаотичность
  //   planet.y = constrain(planet.y, topBound, bottomBound);
  // }

  // // Ограничиваем скорость
  // planet.speedX = constrain(planet.speedX, -2, 2);
  // planet.speedY = constrain(planet.speedY, -2, 2);

  // Периодически добавляем случайные изменения в движение
  // if (random() < 0.02) { // 2% шанс каждый кадр
  //   planet.speedX += random(-0.5, 0.5);
  //   planet.speedY += random(-0.5, 0.5);
  // }
}

function checkPlanetClick(planet, modalOpen) {
  if (
    mouseIsPressed
    && dist(mouseX, mouseY, planet.screenX, planet.screenY) < planet.radius / 2
  ) {
    modalOpen({
      name: planet.boardgame.name,
      games: planet.boardgame.games,
      description: planet.boardgame.description
    });
  }
}