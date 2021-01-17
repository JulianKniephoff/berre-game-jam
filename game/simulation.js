export default class Simulation {
    previous = 0;
    lag = 0;

    DT = 16

    constructor(start) {
        this.previous = start;
    }

    run(t, state) {
        const dt = t - this.previous;
        this.previous = t;
        this.lag += dt;

        while (this.lag >= this.DT) {
            this.update(state);
            this.lag -= this.DT;
        }
    }

    update(state) {
        if (!state) return;

        for (const entity of state.entities.values()) {
            const xSpeed = entity.movingRight - entity.movingLeft;
            entity.position.x += 10 * xSpeed;
        }
    }
}
