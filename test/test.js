const override = (that, fun, ride) => {
  that[fun] = ride(that[fun]);
};

override(window, 'fetch', (origin) => {
  return (...args) => {
    console.log('fetch', ...args);
    const response = origin(...args);
    response.then(r => console.log('fetch STATUS', r.status));
    return response;
  };
});

import { createMainCanvas, App } from '../src/main.js';
import Entity from '../src/Entity.js';

describe("Canvas suite", () => {
  it("should be able to create a canvas", () => {
    expect(document).toBeDefined();
    const canvas = document.createElement('canvas');
    expect(canvas).toBeDefined();
    expect(canvas).not.toBe(null);
  })

  it('should create the game canvas on body', () => {
    const canvas = createMainCanvas();
    expect(canvas).toBeDefined()
    expect(canvas).not.toBe(null);
  })

  it('should create the game canvas on custom element ID', () => {
    // setting up the div
    const divId = 'custom';
    const div = document.createElement('div');
    div.setAttribute('id', divId);
    document.body.appendChild(div);

    const canvas = createMainCanvas(divId);
    expect(canvas).toBeDefined()
    expect(canvas).not.toBe(null);
  })

  it('should return undefined if custom element ID doesn\'t exist', () => {
    const canvas = createMainCanvas('foo');
    expect(canvas).not.toBeDefined();
  })
})


describe('Entity', () => {
  let entity;
  beforeEach(() => {
    entity = new Entity();
  })

  afterEach(() => {
    entity = null;
  })

  it('should exist', () => {
    expect(entity).toBeDefined();
    expect(entity).not.toBe(null);
    expect(entity.traits.length).toBe(0)
  })

  it('should update traits', () => {
    let updateCount = 0;
    const makeTrait = () => {
      // mocking traits here
      return {
        update: () => {
          updateCount += 1;
        }
      }
    }
    entity.addTrait(makeTrait('trait1'))
    entity.addTrait(makeTrait('trait2'))
    expect(entity.traits.length).toBe(2);
    entity.update(0);
    expect(updateCount).toBe(2);
  })
})

describe("App ", () => {
  it("should exist", () => {
    const app = new App();
    expect(app).toBeDefined();
    expect(app).not.toBe(null);
  })

  it('should start', (done) => {
    const app = new App();
    app.init(createMainCanvas())
      .then(() => {
        expect(app.loop).not.toBe(null);
        app.loop.stop();
        app.canvas.remove();
      })
      .catch(err => {
        console.error(err.stack)
        expect(err).not.toBeDefined();
      })
      .then(done);
  })

  it('fetches', (done) => {
    fetch('/img/tiles.png')
      .catch(err => expect(err).not.toBeDefined())
      .then(done);
  })

})
















