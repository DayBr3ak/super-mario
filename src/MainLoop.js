

const NOOP = () => {};

export default class MainLoop {
    constructor() {
        // The amount of time (in milliseconds) to simulate each time this.update()
        // runs. See `MainLoop.setSimulationTimestep()` for details.
        this.simulationTimestep = 1000 / 60

        // The cumulative amount of in-app time that hasn't been simulated yet.
        // See the comments inside animate() for details.
        this.frameDelta = 0

        // The timestamp in milliseconds of the last time the main loop was run.
        // Used to compute the time elapsed between frames.
        this.lastFrameTimeMs = 0

        // An exponential moving average of the frames per second.
        this.fps = 60

        // A factor that affects how heavily to weight more recent seconds'
        // performance when calculating the average frames per second. Valid values
        // range from zero to one inclusive. Higher values result in weighting more
        // recent seconds more heavily.
        this.fpsAlpha = 0.9

        // The minimum duration between this.updates to the frames-per-second estimate.
        // Higher values increase accuracy, but result in slower this.updates.
        this.fpsUpdateInterval = 1000

        // The timestamp (in milliseconds) of the last time the `fps` moving
        // average was this.updated.
        this.lastFpsUpdate = 0

        // The number of frames delivered since the last time the `fps` moving
        // average was this.updated (i.e. since `this.lastFpsUpdate`).
        this.framesSinceLastFpsUpdate = 0

        // The number of times this.update() is called in a given frame. This is only
        // relevant inside of animate(), but a reference is held externally so that
        // this variable is not marked for garbage collection every time the main
        // loop runs.
        this.numUpdateSteps = 0

        // The minimum amount of time in milliseconds that must pass since the last
        // frame was executed before another frame can be executed. The
        // multiplicative inverse caps the FPS (the default of zero means there is
        // no cap).
        this.minFrameDelay = 0

        // Whether the main loop is this.running.
        this.running = false

        // `true` if `MainLoop.start()` has been called and the most recent time it
        // was called has not been followed by a call to `MainLoop.stop()`. This is
        // different than `this.running` because there is a delay of a few milliseconds
        // after `MainLoop.start()` is called before the application is considered
        // "this.running." This delay is due to waiting for the next frame.
        this.started = false

        // Whether the simulation has fallen too far behind real time.
        // Specifically, `this.panic` will be set to `true` if too many this.updates occur in
        // one frame. This is only relevant inside of animate(), but a reference is
        // held externally so that this variable is not marked for garbage
        // collection every time the main loop runs.
        this.panic = false

        // The function that runs the main loop. The unprefixed version of
        // `window.requestAnimationFrame()` is available in all modern browsers
        // now, but node.js doesn't have it, so fall back to timers. The polyfill
        // is adapted from the MIT-licensed
        // https://github.com/underscorediscovery/realtime-multiplayer-in-html5
        this.requestAnimationFrame = window.requestAnimationFrame.bind(window) || (() => {
            var lastTimestamp = Date.now(),
                now,
                timeout;
            return (callback) => {
                now = Date.now();
                // The next frame should run no sooner than the simulation allows,
                // but as soon as possible if the current frame has already taken
                // more time to run than is simulated in one timestep.
                timeout = Math.max(0, this.simulationTimestep - (now - lastTimestamp));
                lastTimestamp = now + timeout;
                return setTimeout(() => {
                    callback(now + timeout);
                }, timeout);
            };
        })()

        // The function that stops the main loop. The unprefixed version of
        // `window.cancelAnimationFrame()` is available in all modern browsers now,
        // but node.js doesn't have it, so fall back to timers.
        this.cancelAnimationFrame = window.cancelAnimationFrame.bind(window) || window.clearTimeout.bind(window)

        // In all major browsers, replacing non-specified functions with NOOPs
        // seems to be as fast or slightly faster than using conditions to only
        // call the functions if they are specified. This is probably due to empty
        // functions being optimized away. http://jsperf.com/noop-vs-condition

        // A function that runs at the this.beginning of the main loop.
        // See `MainLoop.setBegin()` for details.
        this.begin = NOOP

        // A function that runs this.updates (i.e. AI and physics).
        // See `MainLoop.setUpdate()` for details.
        this.update = NOOP

        // A function that this.draws things on the screen.
        // See `MainLoop.setDraw()` for details.
        this.draw = NOOP

        // A function that runs at the this.end of the main loop.
        // See `MainLoop.setEnd()` for details.
        this.end = NOOP

        // The ID of the currently executing frame. Used to cancel frames when
        // stopping the loop.
        this.rafHandle = null
    }

    getSimulationTimestep() {
        return this.simulationTimestep;
    }
    setSimulationTimestep(timestep) {
        this.simulationTimestep = timestep;
        return this;
    }

    getFPS() {
        return this.fps;
    }
    getMaxAllowedFPS() {
        return 1000 / this.minFrameDelay;
    }
    setMaxAllowedFPS(fps) {
        if (typeof fps === 'undefined') {
            fps = Infinity;
        }
        if (fps === 0) {
            this.stop();
        }
        else {
            // Dividing by Infinity returns zero.
            this.minFrameDelay = 1000 / fps;
        }
        return this;
    }
    resetFrameDelta() {
        var oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }
    setBegin(fun) {
        this.begin = fun || this.begin;
        return this;
    }
    setUpdate(fun) {
        this.update = fun || this.update;
        return this;
    }
    setDraw(fun) {
        this.draw = fun || this.draw;
        return this;
    }
    setEnd(fun) {
        this.end = fun || this.end;
        return this;
    }
    start() {
        if (!this.started) {
            this.started = true;

            this.rafHandle = this.requestAnimationFrame((timestamp) => {
                this.draw(1);
                this.running = true;
                this.lastFrameTimeMs = timestamp;
                this.lastFpsUpdate = timestamp;
                this.framesSinceLastFpsUpdate = 0;

                // Start the main loop.
                this.rafHandle = this.requestAnimationFrame(animate.bind(this));
            });
        }
        return this;
    }

    stop() {
        this.running = false;
        this.started = false;
        this.cancelAnimationFrame(this.rafHandle);
        return this;
    }

    isRunning() {
        return this.running;
    }
}

function animate(timestamp) {
    this.rafHandle = this.requestAnimationFrame(animate.bind(this));

    if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
        return;
    }

    this.frameDelta += timestamp - this.lastFrameTimeMs;
    this.lastFrameTimeMs = timestamp;

    this.begin(timestamp, this.frameDelta);

    if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
        // Compute the new exponential moving average.
        this.fps =
            // Divide the number of frames since the last FPS this.update by the
            // amount of time that has passed to get the mean frames per second
            // over that period. This is necessary because slightly more than a
            // second has likely passed since the last this.update.
            this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) +
            (1 - this.fpsAlpha) * this.fps;

        // Reset the frame counter and last-this.updated timestamp since their
        // latest values have now been incorporated into the FPS estimate.
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
    }
    this.framesSinceLastFpsUpdate++;
    this.numUpdateSteps = 0;
    while (this.frameDelta >= this.simulationTimestep) {
        this.update(this.simulationTimestep);
        this.frameDelta -= this.simulationTimestep;
        if (++this.numUpdateSteps >= 240) {
            this.panic = true;
            break;
        }
    }

    this.draw(this.frameDelta / this.simulationTimestep);
    this.end(this.fps, this.panic);
    this.panic = false;
}
