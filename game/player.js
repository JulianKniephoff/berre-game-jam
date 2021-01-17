export default class Player {
    position = { x: 0, y: 0 };
    movingLeft = false;
    movingRight = false;
    size = 200;

    constructor(json) {
        Object.assign(this, json);
        if (this.position.x == null || this.position.y == null) debugger;
    }
}
