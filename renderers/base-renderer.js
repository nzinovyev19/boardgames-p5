class BaseRenderer {
  constructor() {
    this.name = 'base';
  }

  update(planets) {
    // Переопределяется в наследниках
  }

  draw(planets) {
    // Переопределяется в наследниках
  }

  handleClick(planets, mouseX, mouseY, modalOpen) {
    planets.forEach(planet => {
      if (dist(mouseX, mouseY, planet.screenX, planet.screenY) < planet.radius / 2) {
        if (mouseIsPressed) {
          modalOpen({
            name: planet.boardgame.name,
            games: planet.boardgame.games,
            description: planet.boardgame.description
          });
        }
      }
    });
  }
}