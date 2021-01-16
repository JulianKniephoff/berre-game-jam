import ws from 'ws';
import { performance } from 'perf_hooks';

import World from '../game/world';
import State from '../game/state';
import Player from '../game/player';
import simulate from '../game/simulation';

export default class Server {

    sockets = new Map();
    socketIndex = new Map();
    state = null;

    nextId = 0

    constructor() {
        this.wsServer = new ws.Server({port: 8080});
    }

    listen() {
        this.wsServer.on('connection', (socket) => {

            const clientId = this.nextId++;

            this.state.entities.set(clientId, new Player({ position: this.state.world.spawn }));

            this.send(socket, {
                name: 'initialize',
                data: {
                    id: clientId,
                    state: this.state.toJson(),
                }
            });

            this.sockets.set(clientId, socket);
            this.socketIndex.set(socket, clientId);

            socket.on('message', (message) => {
                this.handleMessage(JSON.parse(message), socket);
            });

            socket.on('close', () => {
                const clientId = this.socketIndex.get(socket);
                this.socketIndex.delete(socket);
                this.state.entities.delete(clientId);
            });
        });

        setInterval(() => {
            this.broadcast({
                name: 'update',
                data: [...this.state.entities.entries()],
            });
        }, 1000);
    }

    handleMessage(message, socket) {
        const name = message.name;
        const data = message.data;
        switch (name) {
            case 'updatePlayer':
                this.state.entities.set(data.id, data.player);
                break;
        }
    }

    loadWorld(world) {
        this.state = new State({
            world,
            entities: [],
        });


        setInterval(() => {
            simulate(performance.now(), this.state);
        }, 16);
    }

    send(socket, message) {
        socket.send(JSON.stringify(message));
    }

    broadcast(message) {
        for (const socket of this.sockets.values()) {
            this.send(socket, message);
        }
    }
}
