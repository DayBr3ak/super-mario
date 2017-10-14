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

    let rightMove = 0, leftMove = 0;
    input.addMapping('ArrowRight', keyState => {
        rightMove = keyState;
        goTrait.dir = rightMove + leftMove;
    });

    input.addMapping('ArrowLeft', keyState => {
        leftMove = -keyState;
        goTrait.dir = rightMove + leftMove;
    });

    return input;
}
