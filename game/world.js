import Player from './player';

export default class World {
    platforms = [];
    spawn = null;
    loaded = false

    constructor(json) {
        Object.assign(this, json);

        this.player = new Player({
            position: this.spawn,
        });
    }

    toJson() {
        return {
            platforms: this.platforms,
            spawn: this.spawn
        };
    }

    deepestPlatform() {

    }
}
