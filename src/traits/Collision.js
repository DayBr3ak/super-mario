import {Trait} from '../Entity.js';

export default class Collision extends Trait {
    constructor() {
        super('collision');
        this.tileCollider = null;
    }

    update(entity, deltaTime) {
        entity.pos.x += entity.vel.x * deltaTime / 1000;
        this.tileCollider.checkX(entity);

        entity.pos.y += entity.vel.y * deltaTime / 1000;
        this.tileCollider.checkY(entity);
    }
}
