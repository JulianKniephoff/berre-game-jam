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

    run(t, state, onFoodEaten) {
        const dt = (t - this.previous) / 1000;
        this.previous = t;
        this.lag += dt;

        while (this.lag >= this.DT) {
            this.update(state, this.DT, onFoodEaten);
            this.lag -= this.DT;
        }

        return this.lag;
    }

    // delta in s
    update(state, delta, onFoodEaten) {
        if (!state) {
            return;
        }

        for (const entity of state.entities.values()) {
            if (!entity.isDead()) {
                const xSpeed = entity.getSpeed().x;
                entity.position.x += delta * xSpeed;

                entity.position.y += delta * (entity.ySpeed || 0);
                if (entity.jumping) {
                    entity.ySpeed = entity.ySpeed + (delta * GRAVITY);
                }

                entity.satiation -= delta * HUNGRY_PER_SECOND;
                entity.eatingTimer -= delta;
                if (entity.satiation < 0) {
                    entity.die();
                }

                // eat near food
                const toRemove = [];
                for (const food of state.foods) {
                    // TODO: get player and food size from class
                    const playerCenter = { x: entity.position.x, y : entity.position.y - 100 };
                    const foodCenter = { x: food.x * 100 + 50, y: food.y * 100 + 25 };
                    const distance = Math.sqrt(Math.pow(foodCenter.x - playerCenter.x, 2) + Math.pow(foodCenter.y - playerCenter.y, 2));
                    if (distance < 100) {
                        entity.satiation += 1;
                        entity.eatingTimer = EATING_TIME;
                        toRemove.push(food);
                        onFoodEaten();
                    }
                }

                state.foods = state.foods.filter((food) => !toRemove.includes(food));
            } else {
                entity.deathTimer -= delta;
                if (entity.deathTimer <= 0) {
                    entity.deathTimer = 0;
                    entity.respawn(state.world.spawn);
                }
            }
        }
    }
}
