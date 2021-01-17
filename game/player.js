export default class Player {
    position = { x: 0, y: 0 };
    movingLeft = false;
    movingRight = false;

    constructor(json) {
        Object.assign(this, json);
    }
}
