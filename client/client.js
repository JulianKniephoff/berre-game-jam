import State from '../game/state';
import World from '../game/world';

export default class Client {
    socket = new WebSocket('ws://localhost:8080');
    id = null;
    state = null;

    constructor() {
        this.socket.addEventListener('message', event => this.handleMessage(event));
    }

    handleMessage(event) {
        const message = JSON.parse(event.data);
        const name = message.name;
        const data = message.data;
        switch (name) {
            case 'initialize':
                this.id = data.id;
                this.state = new State(data.state);

                this.initialized();
                break;
            case 'update':
                this.state.entities = new Map(data);
                break;
        }
    }

    getPlayer() {
        return this.state.entities.get(this.id);
    }

    initialized() {
        window.addEventListener('keydown', e => {
            switch (e.code) {
            case "KeyA":
            case "ArrowLeft":
                // Handle "turn left"
                this.getPlayer().moving = -1;
                break;
            case "KeyD":
            case "ArrowRight":
                // Handle "turn right"
                this.getPlayer().moving = 1;
                break;
            }
        });

        window.addEventListener('keyup', e => {
            switch (e.code) {
            case "KeyA":
            case "ArrowLeft":
                // Handle "turn left"
                this.getPlayer().moving = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                // Handle "turn right"
                this.getPlayer().moving = 0;
                break;
            }
        });
    }
}
