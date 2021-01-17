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
            const startPosition = { ... entity.position };

            const xSpeed = entity.movingRight - entity.movingLeft;
            entity.position.x += 10 * xSpeed;

            entity.position.y += -entity.ySpeed || 0;
            if (entity.jumping) {
                entity.ySpeed = entity.ySpeed - 2.25;
            }

            // Collision checking
            if (startPosition.x !== entity.position.x || startPosition.y !== entity.position.y) {
                for (const platform of state.world.platforms) {
                    const bounds = Object.fromEntries(
                        Object.entries(platform).map(
                            ([_, p]) => [_, p * 100],
                        ),
                    );

                    const eject = ejectionForce(
                        startPosition,
                        entity.position,
                        { w: entity.size, h: entity.size },
                        bounds,
                    );

                    entity.position.x += eject.x;
                    entity.position.y += eject.y;
                }
            }
        }
    }
}

const ejectionForce = (start, end, size, obstacle) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const startLeft = start.x - size.w / 2;
    const startRight = startLeft + size.w;
    const startBottom = start.y;
    const startTop = startBottom - size.h;

    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + obstacle.w;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + obstacle.h;

    const candidateSolutions = [
        {
            normal: { x: 1, y: 0 },
            t: (obstacle.x + obstacle.w - (start.x - size.w / 2)) / dx,
            a: [startTop, startBottom],
            b: [obstacleTop, obstacleBottom],
        },
        {
            normal: { x: -1, y: 0 },
            t: (obstacle.x - (start.x + size.w / 2)) / dx,
            a: [startTop, startBottom],
            b: [obstacleTop, obstacleBottom],
        },
        {
            normal: { x: 0, y: 1 },
            t: (obstacle.y + obstacle.h - (start.y - size.h)) / dy,
            a: [startLeft, startRight],
            b: [obstacleLeft, obstacleRight],
        },
        {
            normal: { x: 0, y: -1 },
            t: (obstacle.y - start.y) / dy,
            a: [startLeft, startRight],
            b: [obstacleLeft, obstacleRight],
        },
    ].filter(
        // TODO Inclusive/exclusive?!
        ({ t, a, b }) => {
            if (isNaN(t)) {
                return false;
            }

            if (t < 0 || t > 1) {
                return false;
            }

            if (a[0] > b[1] || b[0] > a[1]) {
                return false;
            }

            return true;
        });
    candidateSolutions.sort(({ t: t1 }, { t: t2 }) => t2 - t1);
    const min = candidateSolutions[0];

    if (!min) return { x: 0, y: 0 };
    return {
        x: min.normal.x * 1.1 * (1 - min.t) * dx,
        y: min.normal.y * 1.1 * (1 - min.t) * dy,
    };
};
