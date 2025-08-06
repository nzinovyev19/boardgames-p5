class GalaxyBackground {
  constructor() {
    this.stars = [];
    this.nebulae = [];
    this.clusters = [];
    this.generateGalaxy();
  }

  generateGalaxy() {
    // Создаем звездные скопления (галактики)
    this.generateClusters();

    // Создаем туманности
    this.generateNebulae();

    // Создаем отдельные звезды
    this.generateScatteredStars();
  }

  generateClusters() {
    const clusterCount = random(3, 6);

    for (let i = 0; i < clusterCount; i++) {
      const centerX = random(0, width);
      const centerY = random(0, height);
      const radius = random(80, 200);
      const starCount = random(30, 80);
      const rotation = random(0, Math.PI * 2);
      const rotationSpeed = random(-0.002, 0.002);

      const cluster = {
        centerX,
        centerY,
        radius,
        rotation,
        rotationSpeed,
        stars: []
      };

      // Создаем звезды в кластере с галактической спиралью
      for (let j = 0; j < starCount; j++) {
        const angle = random(0, Math.PI * 2);
        const distance = Math.pow(random(0, 1), 1.5) * radius; // Больше звезд к центру
        const spiralOffset = distance * 0.01; // Спиральный эффект

        cluster.stars.push({
          angle: angle + spiralOffset,
          distance,
          size: random(0.3, 2),
          brightness: random(30, 120),
          twinkleOffset: random(0, 100),
          orbitSpeed: random(-0.001, 0.001)
        });
      }

      this.clusters.push(cluster);
    }
  }

  generateNebulae() {
    const nebulaCount = random(2, 4);

    for (let i = 0; i < nebulaCount; i++) {
      this.nebulae.push({
        x: random(0, width),
        y: random(0, height),
        size: random(100, 300),
        color: random(['purple', 'blue', 'pink', 'cyan']),
        alpha: random(10, 30),
        drift: {
          x: random(-0.1, 0.1),
          y: random(-0.1, 0.1)
        }
      });
    }
  }

  generateScatteredStars() {
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: random(0, width),
        y: random(0, height),
        size: random(0.5, 1.5),
        brightness: random(40, 100),
        twinkleOffset: random(0, 100)
      });
    }
  }

  update() {
    // Медленно вращаем галактические кластеры
    this.clusters.forEach(cluster => {
      cluster.rotation += cluster.rotationSpeed;

      cluster.stars.forEach(star => {
        star.angle += star.orbitSpeed;
      });
    });

    // Дрейф туманностей
    this.nebulae.forEach(nebula => {
      nebula.x += nebula.drift.x;
      nebula.y += nebula.drift.y;

      // Wrap around screen
      if (nebula.x > width + nebula.size) nebula.x = -nebula.size;
      if (nebula.x < -nebula.size) nebula.x = width + nebula.size;
      if (nebula.y > height + nebula.size) nebula.y = -nebula.size;
      if (nebula.y < -nebula.size) nebula.y = height + nebula.size;
    });
  }

  draw() {
    // Рисуем фон
    background("rgba(18,15,15,0.17)");

    // Рисуем туманности
    this.drawNebulae();

    // Рисуем галактические кластеры
    this.drawClusters();

    // Рисуем разрозненные звезды
    this.drawScatteredStars();
  }

  drawNebulae() {
    this.nebulae.forEach(nebula => {
      const colors = {
        purple: [147, 0, 211],
        blue: [0, 100, 200],
        pink: [255, 20, 147],
        cyan: [0, 255, 255]
      };

      const [r, g, b] = colors[nebula.color];

      // Создаем эффект размытой туманности
      for (let i = 0; i < 3; i++) {
        const alpha = nebula.alpha * (1 - i * 0.3);
        const size = nebula.size * (1 + i * 0.3);

        fill(r, g, b, alpha);
        stroke(r, g, b, alpha * 0.5);
        strokeWeight(0.5);
        circle(nebula.x, nebula.y, size);
      }
    });
  }

  drawClusters() {
    this.clusters.forEach(cluster => {
      cluster.stars.forEach(star => {
        const x = cluster.centerX + Math.cos(star.angle + cluster.rotation) * star.distance;
        const y = cluster.centerY + Math.sin(star.angle + cluster.rotation) * star.distance;

        // Мерцание
        const twinkle = Math.sin((frameCount + star.twinkleOffset) * 0.03) * 15 + star.brightness;

        fill(255, 255, 255, twinkle);
        stroke(255, 255, 255, twinkle * 0.3);
        strokeWeight(0.3);
        circle(x, y, star.size);
      });
    });
  }

  drawScatteredStars() {
    this.stars.forEach(star => {
      const twinkle = Math.sin((frameCount + star.twinkleOffset) * 0.025) * 20 + star.brightness;

      fill(255, 255, 255, twinkle);
      stroke(255, 255, 255, twinkle * 0.2);
      strokeWeight(0.2);
      circle(star.x, star.y, star.size);
    });
  }

  resize() {
    this.stars = [];
    this.nebulae = [];
    this.clusters = [];
    this.generateGalaxy();
  }
}