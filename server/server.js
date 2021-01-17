import ws from 'ws';
import { performance } from 'perf_hooks';

import World from '../game/world';
import State from '../game/state';
import Player from '../game/player';
import Simulation from '../game/simulation';

export default class Server {

    sockets = new Map();
    socketIndex = new Map();
    state = null;
    simulation = null;

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
                this.state.handleMessage(message);
                for (const [id, socket] of this.sockets.entries()) {
                    if (data.id === id) continue;
                    this.send(socket, message);
                }
                break;
        }
    }

    loadWorld(world) {
        this.state = new State({
            world,
            entities: [],
            foods: [{ x: 5, y: 9, kind: 0 }, { x: 16, y: 1, kind: 1 }],
        });

        this.simulation = new Simulation(performance.now());

        setInterval(() => {
            this.simulation.run(performance.now(), this.state);
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
