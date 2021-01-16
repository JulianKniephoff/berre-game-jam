class World {
    platforms = [];
    spawn = null;
    loaded = false

    constructor(json) {
        Object.assign(this, json);
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
