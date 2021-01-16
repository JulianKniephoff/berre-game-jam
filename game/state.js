import Player from './player';

export default class State {
    constructor(world) {
        this.world = world;
        this.player = new Player({ position: this.world.spawn });
        this.moving = 0;
    }
}
