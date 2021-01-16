class World {
    data = {
        "platforms": [],
        "spawn": null,
        "loaded": false
    }

    fromJson(json) {
        const out = new World();
        out.data.platforms = json.platforms;
        out.data.spawn = json.spawn;
        out.data.loaded = true;
        return out;
    };

    toJson() {
        return {
            "platforms": this.data.platforms,
            "spawn": this.data.spawn
        }
    }

    deepestPlatform() {

    }
}
