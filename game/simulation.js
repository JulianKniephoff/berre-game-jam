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

            entity.position.y += -entity.ySpeed || 0;
            if (entity.jumping) {
                entity.ySpeed = entity.ySpeed - 2.25;
            }

            // Collision checking
            const entityLeft = entity.position.x - entity.size / 2;
            const entityRight = entity.position.x + entity.size / 2;
            const entityTop = entity.position.y - entity.size;
            const entityBottom = entity.position.y;
            for (const platform of state.world.platforms) {
                const bounds = Object.fromEntries(
                    Object.entries(platform).map(
                        ([_, p]) => [_, p * 100],
                    ),
                );

                const platformLeft = bounds.x;
                const platformRight = bounds.x + bounds.w;
                const platformTop = bounds.y;
                const platformBottom = bounds.y + bounds.h;

                // TODO Inclusive vs. exclusive
                if ((
                    entityRight > platformLeft && platformRight > entityLeft
                ) && (
                    entityBottom > platformTop && platformBottom > entityTop
                )) {
                    console.log('collision');
                }
            }
        }
    }
}
