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
  const gapInRow = width / COLUMNS;
  const gapInColumn = (height / 5);
  const centerX = i * gapInRow % width + PADDING_LEFT;
  const centerY = Math.floor(i / ROWS) * gapInColumn + PADDING_TOP;

  const areaSize = Math.min(gapInRow, gapInColumn) * 0.4;

  return {
    boardgame,
    centerX,
    centerY,
    x: centerX + random(-areaSize/4, areaSize/4),
    y: centerY + random(-areaSize/4, areaSize/4),
    speedX: random(-0.5, 0.5),
    speedY: random(-0.5, 0.5),
    radius: boardgame.games,
    areaSize
  }
}

function drawPlanet(planet) {
  fill(paletteLerp([
    ['white', 0],
    ['orange', 5],
    ['red', 10]
  ], planet.boardgame.difficult));
  stroke("orange");
  strokeWeight(STROKE_OF_PLANETS);

  circle(planet.x, planet.y, planet.radius);

  // Рисуем текст планеты
  fill("rgb(33,30,226)");
  stroke("rgb(222,164,232)");
  textSize(10);
  textAlign(CENTER);
  text(planet.boardgame.name, planet.x, planet.y + planet.radius/2 + STROKE_OF_PLANETS + 10);

   // Опционально: рисуем границы области движения (для отладки)
  stroke("rgba(255,255,255,0.3)");
  strokeWeight(1);
  noFill();
  rectMode(CENTER);
  rect(planet.centerX, planet.centerY, planet.areaSize, planet.areaSize);
}

function updatePlanet(planet) {
  planet.x += planet.speedX;
  planet.y += planet.speedY;

  // Границы квадратной области
  const leftBound = planet.centerX - planet.areaSize / 2;
  const rightBound = planet.centerX + planet.areaSize / 2;
  const topBound = planet.centerY - planet.areaSize / 2;
  const bottomBound = planet.centerY + planet.areaSize / 2;

  // Отражение от границ с небольшой случайностью
  if (planet.x <= leftBound || planet.x >= rightBound) {
    planet.speedX *= -1;
    planet.speedX += random(-0.2, 0.2); // Добавляем хаотичность
    planet.x = constrain(planet.x, leftBound, rightBound);
  }

  if (planet.y <= topBound || planet.y >= bottomBound) {
    planet.speedY *= -1;
    planet.speedY += random(-0.2, 0.2); // Добавляем хаотичность
    planet.y = constrain(planet.y, topBound, bottomBound);
  }

  // Ограничиваем скорость
  planet.speedX = constrain(planet.speedX, -2, 2);
  planet.speedY = constrain(planet.speedY, -2, 2);

  // Периодически добавляем случайные изменения в движение
  // if (random() < 0.02) { // 2% шанс каждый кадр
  //   planet.speedX += random(-0.5, 0.5);
  //   planet.speedY += random(-0.5, 0.5);
  // }
}

function checkPlanetClick(planet, modalOpen) {
  if (
    mouseIsPressed
    && dist(mouseX, mouseY, planet.x, planet.y) < planet.radius / 2
  ) {
    modalOpen({
      name: planet.boardgame.name,
      games: planet.boardgame.games,
      description: planet.boardgame.description
    });
  }
}