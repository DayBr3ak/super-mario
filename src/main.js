import Camera from './Camera.js';
import Timer from './Timer.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';
import {createCollisionLayer, createCameraLayer} from './layers.js';
import {setupKeyboard} from './input.js';
import {setupMouseControl} from './debug.js';


export function createMainCanvas(anchorId) {
  let anchor = document.body;
  if (anchorId) {
    anchor = document.getElementById(anchorId);
    if (!anchor) {
      return undefined;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', 640);
  canvas.setAttribute('height', 640);
  anchor.appendChild(canvas);
  return canvas;
}

export class App {

  constructor() {
    this.canvas = null;
  }

  async init(canvas) {
    this.canvas = canvas;
    if (!canvas) {
      console.warn('Game >> Element ID doesn\'t exist');
      return;
    }
    const context = this.canvas.getContext('2d');
    const [mario, level] = await Promise.all([
      createMario(),
      loadLevel('1-1')
    ]);

    const camera = new Camera();
    window.camera = camera;

    mario.pos.set(64, 64);

    level.comp.layers.push(
      createCollisionLayer(level),
      createCameraLayer(camera));

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(this.canvas, mario, camera);

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
      level.update(deltaTime);

      level.comp.draw(context, camera);
    }

    timer.start();
  }
}

window.startGame = (anchorId) => {
  const app = new App();
  app.init(createMainCanvas(anchorId));
}
