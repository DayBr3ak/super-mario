const override = (that, fun, ride) => {
  that[fun] = ride(that[fun]);
};

override(window, 'fetch', (origin) => {
  return (...args) => {
    if (args[0].startsWith('/levels')) {
      args[0] = args[0].replace('/levels', './public/levels');
    }
    if (args[0].startsWith('/img')) {
      args[0] = args[0].replace('/img', './public/img');
    }

    console.log('fetch', ...args);
    return origin(...args);
  };
});

import { createMainCanvas, App } from '../src/main.js';

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


describe("App ", () => {
  it("should exist", () => {
    const app = new App();
    expect(app).toBeDefined();
    expect(app).not.toBe(null);
  })

  it('should start', () => {
    const app = new App();
    app.init(createMainCanvas());
  })

})
















