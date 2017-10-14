import Camera from './Camera.js';
import MainLoop from './MainLoop.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';
import {createCollisionLayer, createCameraLayer} from './layers.js';
import {setupKeyboard} from './input.js';
import {setupMouseControl} from './debug.js';


export function createMainCanvas(anchorId, width=300, heigth=300) {
  let anchor = document.body;
  if (anchorId) {
    anchor = document.getElementById(anchorId);
    if (!anchor) {
      return undefined;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', heigth);
  anchor.appendChild(canvas);
  return canvas;
}

export class App {

  constructor() {
    this.canvas = null;
    this.loop = null;
    window.app = this;
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
    window.mario = mario

    level.comp.layers.push(
      createCollisionLayer(level),
      createCameraLayer(camera));

    level.addEntity(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControl(this.canvas, mario, camera);

    this.loop = new MainLoop()
      .setUpdate(deltaTime => {
        level.update(deltaTime);
      })
      .setDraw(() => {
        level.comp.draw(context, camera);
      })
      .setEnd((fps, panic) => {
        if (panic) {
          // This pattern introduces non-deterministic behavior, but in this case
          // it's better than the alternative (the application would look like it
          // was running very quickly until the simulation caught up to real
          // time). See the documentation for `MainLoop.setEnd()` for additional
          // explanation.
          var discardedTime = Math.round(this.loop.resetFrameDelta());
          console.warn(
            'Main loop panicked, probably because the browser tab was put in the background. Discarding '
            + discardedTime + 'ms');
        }
      })
      .start();
  }
}

window.startGame = (anchorId) => {
  const app = new App();
  app.init(createMainCanvas(anchorId, 640, 640));
}

