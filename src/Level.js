import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import {Matrix} from './math.js';

export default class Level {
    constructor() {
        this.gravity = 2.0;

        this.comp = new Compositor();
        this.entities = new Set();
        this.tiles = new Matrix();

        this.tileCollider = new TileCollider(this.tiles);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            entity.pos.x += entity.vel.x * deltaTime / 1000;
            this.tileCollider.checkX(entity);

            entity.pos.y += entity.vel.y * deltaTime / 1000;
            this.tileCollider.checkY(entity);

            entity.vel.y += this.gravity * deltaTime;
        });
    }
}
