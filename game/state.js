import Player from './player';

export default class State {
    constructor(json) {
        Object.assign(this, json);
        this.entities = new Map(json.entities);
    }

    toJson() {
        return {
            ...this,
            entities: [...this.entities.entries()],
        };
    }
}
