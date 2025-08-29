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
}