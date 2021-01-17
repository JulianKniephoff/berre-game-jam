import State from '../game/state';
import World from '../game/world';

export default class Client {
    socket = new WebSocket('ws://' + location.hostname + ':8080');
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
            case 'updatePlayer':
                this.state.handleMessage(message);
                break;
        }
    }

    getPlayer() {
        return this.state.entities.get(this.id);
    }

    initialized() {
        window.addEventListener('keydown', e => {
            let update = true;

            if (e.repeat) {
                return;
            }

            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    // Handle "turn left"
                    this.getPlayer().movingLeft = true;
                    break;
                case "KeyD":
                case "ArrowRight":
                    // Handle "turn right"
                    this.getPlayer().movingRight = true;
                    break;
                default:
                    update = false;
                    break;
            }

            if (update) {
                this.updatePlayer();
            }
        });

        window.addEventListener('keyup', e => {
            let update = true;

            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    // Handle "turn left"
                    this.getPlayer().movingLeft = false;
                    break;
                case "KeyD":
                case "ArrowRight":
                    // Handle "turn right"
                    this.getPlayer().movingRight = false;
                    break;
                default:
                    update = false;
                    break;
            }

            if (update) {
                this.updatePlayer();
            }
        });
    }

    updatePlayer() {
        this.socket.send(JSON.stringify({
            name: 'updatePlayer',
            data: {
                id: this.id,
                player: this.getPlayer(),
            },
        }));
    }
}
