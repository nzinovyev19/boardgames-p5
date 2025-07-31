let boardgames;
let planets = [];
let stars = [];

function preload() {
  boardgames = loadJSON('/boardgames.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ({ modalOpen } = defineModal());

  Object.values(boardgames).map((boardgame, i) => {
    planets.push(createPlanet(boardgame, i));
  })

  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height),
      size: random(0.5, 3),
      brightness: random(50, 150),
      twinkleOffset: random(0, 100)
    });
  }
}

function draw() {
  background("rgba(18,15,15,0.17)");
  stars.forEach(star => {
    // Легкое мерцание
    const twinkle = Math.sin((frameCount + star.twinkleOffset) * 0.5) * 20 + star.brightness;

    fill(255, 255, 255, twinkle);
    stroke(255, 255, 255, twinkle * 0.3);
    strokeWeight(0.5);
    circle(star.x, star.y, star.size);
  });

  fill("rgb(33,30,226)");
  stroke("rgb(222,164,232)");
  textSize(30);
  textAlign(CENTER);
  text("Boardgames galaxy", width / 2, 50);

  planets.forEach(planet => {
    updatePlanet(planet);
    drawPlanet(planet);
    checkPlanetClick(planet, modalOpen);
  });

  textSize(30);
  text("🚀", frameCount % windowWidth, frameCount % windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}