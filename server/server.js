import ws from 'ws';
import World from '../game/world';

export default class Server {

    sockets = [];
    world = null;

    constructor() {
        this.wsServer = new ws.Server({port: 8080});
    }

    listen() {
        this.wsServer.on('connection', (socket) => {
            this.sockets.push(socket);

            socket.on('message', (message) => {
                this.handleMessage(JSON.parse(message), socket);
            });

            socket.on('close', (socketToClose) => {
                this.sockets = this.sockets.filter(socketToClose => socketToClose !== socket);
            })
        });
    }

    handleMessage(message, socket) {
        const name = message.name;
        const data = message.data;
        switch (name) {
            case 'getWorld':
                socket.send(JSON.stringify({
                    "name": "world",
                    "data": this.world.toJson()
                }));
                break;
        }
    }

    loadWorld(world) {
        this.world = new World(world);
    }
}
