import {Trait} from '../Entity.js';

export default class Jump extends Trait {
    constructor() {
        super('jump');

        this.shouldStart = false;
        this.shouldStop = false;
        this.duration = 300;
        this.engageTime = 0;

        this.velocity = 200;
    }

    start() {
        this.shouldStart = true;
    }

    cancel() {
        this.shouldStop = true;
    }

    update(entity, deltaTime) {
        if (this.shouldStart && entity.sharedState['canJump']) {
            this.engageTime = this.duration;
        }
        if (this.shouldStop) {
            this.engageTime = 0;
        }
        this.shouldStart = false;
        this.shouldStop = false;
        if (this.engageTime > 0) {
            entity.vel.y = -this.velocity;
            this.engageTime -= deltaTime ;
        }
    }
}
