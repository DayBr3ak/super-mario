export function setupInput(entity) {
    const state = new Map();

    function handle(event) {
        const c = event.keyCode;
        const t = event.type === 'keydown' ? true : false;

        if (state.get(c) === t) {
            return;
        }
        state.set(c, t);

        let prevent = true;

        if (c === 32 && t) {
            entity.vel.y = -500;
        } else if (c === 68) {
            entity.go.x = 200;
        } else if (c === 65) {
            entity.go.x = -200;
        } else {
            prevent = false;
        }

        if (prevent) {
            event.preventDefault();
        }
    }

    window.addEventListener('keydown', handle);
    window.addEventListener('keyup', handle);
}