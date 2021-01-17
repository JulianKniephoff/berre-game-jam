import State from '../game/state';
import World from '../game/world';

export default class Client {
    id = null;
    state = null;

    constructor() {
        this.playerName = prompt("Please enter name:");
        this.socket = new WebSocket('ws://' + location.hostname + ':8080');
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
                this.getPlayer().name = this.playerName;
                this.updatePlayer();
                break;
            case 'update':
            case 'updatePlayer':
                this.state.handleMessage(message);
                break;
        }
    }

    sendMessage(data) {
        this.socket.send(JSON.stringify(data));
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
                case "Space":
                    const player = this.getPlayer();
                    if (!player.jumping) {
                        player.jumping = true;
                        player.ySpeed = 45;
                    }
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
        this.sendMessage({
            name: 'updatePlayer',
            data: {
                id: this.id,
                player: this.getPlayer(),
            },
        });
    }
}
