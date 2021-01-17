const GRAVITY = 7000;
const HUNGRY_PER_SECOND = 0.2;
const EATING_TIME = 0.5;


export default class Simulation {
    previous = 0;

    // In seconds
    lag = 0;
    DT = 0.016;

    constructor(start) {
        this.previous = start;
    }

    run(t, state, onFoodEaten, onPlayerDied, onRespawn) {
        const dt = (t - this.previous) / 1000;
        this.previous = t;
        this.lag += dt;

        while (this.lag >= this.DT) {
            this.update(state, this.DT, onFoodEaten, onPlayerDied, onRespawn);
            this.lag -= this.DT;
        }

        return this.lag;
    }

    // delta in s
    update(state, delta, onFoodEaten, onPlayerDied, onRespawn) {
        if (!state) {
            return;
        }

        for (const entity of state.entities.values()) {
            if (!entity.isDead()) {
                const startPosition = { ... entity.position };

                const xSpeed = entity.getSpeed().x;
                entity.position.x += delta * xSpeed;

                entity.position.y += delta * (entity.ySpeed || 0);
                entity.ySpeed = entity.ySpeed + (delta * GRAVITY);

                entity.satiation -= delta * HUNGRY_PER_SECOND;
                entity.eatingTimer -= delta;
                entity.timeAlive += delta;
                if (entity.satiation < 0) {
                    entity.die();
                    onPlayerDied();
                }

                const playerCenter = {
                    x: entity.position.x,
                    y : entity.position.y - entity.size / 2,
                };

                // eat near food
                const toRemove = [];
                for (const food of state.foods) {
                    // TODO: get food size from class
                    const foodCenter = { x: food.x * 100 + 50, y: food.y * 100 + 25 };
                    const distance = Math.sqrt(
                        Math.pow(foodCenter.x - playerCenter.x, 2)
                            + Math.pow(foodCenter.y - playerCenter.y, 2)
                    );
                    if (distance < 100) {
                        entity.satiation += 1;
                        entity.eatingTimer = EATING_TIME;
                        toRemove.push(food);
                        onFoodEaten();
                    }
                }
                state.foods = state.foods.filter((food) => !toRemove.includes(food));

                // die when too far away from platforms
                const lowestPlatform = state.world.platforms.reduce((a, b) => {
                    const lowA = (a.y + a.h) * 100;
                    const lowB = (b.y + b.h) * 100;

                    if (lowA > lowB) {
                        return a;
                    } else {
                        return b;
                    }
                });
                if ((playerCenter.y - 1000) > (lowestPlatform.y + lowestPlatform.h) * 100) {
                    entity.die();
                    onPlayerDied();
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

                        if (eject.y < 0) {
                            entity.ySpeed = 0;
                            entity.jumping = false;
                        } else if (eject.y > 0) {
                            entity.ySpeed = 0;
                        }
                    }
                }
            } else {
                entity.deathTimer -= delta;
                if (entity.deathTimer <= 0) {
                    entity.deathTimer = 0;
                    entity.respawn(state.world.spawn);
                    onRespawn();
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

    let candidateSolutions = [
        {
            normal: { x: 1, y: 0 },
            againstMovement: dx < 0,
            t: (obstacle.x + obstacle.w - (start.x - size.w / 2)) / dx,
            a: [startTop, startBottom],
            b: [obstacleTop, obstacleBottom],
        },
        {
            normal: { x: -1, y: 0 },
            againstMovement: dx > 0,
            t: (obstacle.x - (start.x + size.w / 2)) / dx,
            a: [startTop, startBottom],
            b: [obstacleTop, obstacleBottom],
        },
        {
            normal: { x: 0, y: 1 },
            againstMovement: dy < 1,
            t: (obstacle.y + obstacle.h - (start.y - size.h)) / dy,
            a: [startLeft, startRight],
            b: [obstacleLeft, obstacleRight],
        },
        {
            normal: { x: 0, y: -1 },
            againstMovement: dy > 1,
            t: (obstacle.y - start.y) / dy,
            a: [startLeft, startRight],
            b: [obstacleLeft, obstacleRight],
        },
    ];
    candidateSolutions = candidateSolutions.filter(
        // TODO Inclusive/exclusive?!
        ({ t, a, b, againstMovement }) => {
            if (isNaN(t)) {
                return false;
            }

            if (!againstMovement) {
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
        x: min.normal.x * (1 - min.t) * Math.abs(dx),
        y: min.normal.y * (1 - min.t) * Math.abs(dy),
    };
};
