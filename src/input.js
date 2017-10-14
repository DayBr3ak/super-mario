import Keyboard from './KeyboardState.js';

export function setupKeyboard(entity) {
    const input = new Keyboard();
    const goTrait = entity.getTrait('go');
    const jumpTrait = entity.getTrait('jump');

    input.addMapping('Space', keyState => {
        if (keyState) {
            jumpTrait.start();
        } else {
            jumpTrait.cancel();
        }
    });

    input.addMapping('ArrowRight', keyState => {
        goTrait.dir = keyState;
    });

    input.addMapping('ArrowLeft', keyState => {
        goTrait.dir = -keyState;
    });

    return input;
}
