const PLAYER_SPEED = 600;
const PLAYER_JUMP_STRENGTH = 2700;

export default class Player {
    position = { x: 0, y: 0 };
    movingLeft = false;
    movingRight = false;
    size = 195;
    ySpeed = 0;
    satiation = 5;
    deathTimer = 0;
    jumping = false;
    eatingTimer = 0;

    constructor(json) {
        Object.assign(this, json);
        if (this.position.x == null || this.position.y == null) debugger;
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

    isDead() {
        return this.deathTimer > 0;
    }

    die() {
        this.deathTimer = 3;
        this.movingLeft = false;
        this.movingRight = false;
        this.ySpeed = 0;
    }

    respawn(pos) {
        let n = new Player();
        n.id = this.id;
        n.position = pos;
        Object.assign(this, n);
    }
}
