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
                data: {
                    entities: [...this.state.entities.entries()],
                    foods: this.state.foods,
                },
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
            foods: [],
        });

        this.simulation = new Simulation(performance.now());

        setInterval(() => {
            this.simulation.run(performance.now(), this.state, () => {}, () => {}, () => {});
            spawnFood(this.state);
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

const spawnFood = (state) => {
    const odds = 0.01;
    const num_food_kinds = 4;
    const max_num_foods = 12;

    if (state.foods.length >= max_num_foods) {
        return;
    }

    if (Math.random() < odds) {
        let positions = [];
        for (const { x, y, w } of state.world.platforms) {
            for (let i = 0; i < w; i++) {
                let p = { x: x + i, y: y - 1 };
                if (state.foods.every(other => other.x != p.x || other.y != p.y)) {
                    positions.push(p);
                }
            }
        }

        const pos = positions[Math.floor(Math.random() * positions.length)];
        const kind = Math.floor(Math.random() * num_food_kinds);

        if (pos) {
            state.foods.push({
                x: pos.x,
                y: pos.y,
                kind,
            });
        }
    }
};
