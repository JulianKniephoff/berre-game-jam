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
            x: this.movingRight - this.movingLeft,
            y: this.ySpeed,
        };
    }
}
