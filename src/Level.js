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

    addEntity(entity) {
        if (this.entities.has(entity)) {
            return;
        }
        this.entities.add(entity);
        let collision;
        if (collision = entity.getTrait('collision')) {
            collision.tileCollider = this.tileCollider;
        }
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
            entity.vel.y += this.gravity * deltaTime;
        });
    }
}
