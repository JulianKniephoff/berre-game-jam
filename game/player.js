const PLAYER_SPEED = 600;
const PLAYER_JUMP_STRENGTH = 2700;

export default class Player {
    position = { x: 0, y: 0 };
    movingLeft = false;
    movingRight = false;
    ySpeed = 0;
    satiation = 5;

    constructor(json) {
        Object.assign(this, json);
    }

    getSpeed() {
        return {
            x: PLAYER_SPEED * (this.movingRight - this.movingLeft),
            y: this.ySpeed,
        };
    }

    jump() {
        this.jumping = true;
        this.ySpeed = -PLAYER_JUMP_STRENGTH;
    }
}
