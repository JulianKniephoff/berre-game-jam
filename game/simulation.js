const GRAVITY = 7000;


export default class Simulation {
    previous = 0;

    // In seconds
    lag = 0;
    DT = 0.016;

    constructor(start) {
        this.previous = start;
    }

    run(t, state) {
        const dt = (t - this.previous) / 1000;
        this.previous = t;
        this.lag += dt;

        while (this.lag >= this.DT) {
            this.update(state, this.DT);
            this.lag -= this.DT;
        }

        return this.lag;
    }

    // delta in s
    update(state, delta) {
        if (!state) {
            return;
        }

        for (const entity of state.entities.values()) {
            const xSpeed = entity.getSpeed().x;
            entity.position.x += delta * xSpeed;

            entity.position.y += delta * (entity.ySpeed || 0);
            if (entity.jumping) {
                entity.ySpeed = entity.ySpeed + (delta * GRAVITY);
            }

            entity.satiation -= delta / 5;
            if (entity.satiation < 0) {
                entity.satiation = 0;
            }
        }
    }
}
