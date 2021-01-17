import Player from './player';

export default class State {
    constructor(json) {
        Object.assign(this, json);
        this.setEntities(json.entities);
    }

    toJson() {
        return {
            ...this,
            entities: [...this.entities.entries()],
        };
    }

    setEntities(entities) {
        this.entities = new Map(entities.map(
            ([_, entity]) => [_, new Player(entity)]
        ));
    }

    handleMessage({ name, data }) {
        switch (name) {
        case 'update':
            this.setEntities(data.entities);
            this.foods = data.foods;
            break;
        case 'updatePlayer':
            this.entities.set(data.id, new Player(data.player));
            break;
        }
    }
}
