
import { createMainCanvas } from '../public/js/main.js';

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

