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

    handleMessage({ name, data }) {
        switch (name) {
        case 'update':
            this.entities = new Map(data);
            break;
        case 'updatePlayer':
            this.entities.set(data.id, data.player);
            break;
        }
    }
}
