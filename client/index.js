import World from '../game/world';
import State from '../game/state';
import simulate from '../game/simulation';

import render from './renderer';

const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
    ws.send(JSON.stringify({
        "name": "getWorld",
        "data": null
    }));
};
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const name = message.name;
    const data = message.data;
    switch (name) {
        case 'world':
            break;
    }
}

const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

// TODO This obviously needs to come from somewhere else
import DUMMY_WORLD from '../server/worlds/0.json';

const world = new World(DUMMY_WORLD);
const state = new State(world);

// TODO Where to put this?
window.addEventListener('keydown', e => {
    switch (e.code) {
    case "KeyA":
    case "ArrowLeft":
        // Handle "turn left"
        state.moving = -1;
        break;
    case "KeyD":
    case "ArrowRight":
        // Handle "turn right"
        state.moving = 1;
        break;
    }
});

window.addEventListener('keyup', e => {
    switch (e.code) {
    case "KeyA":
    case "ArrowLeft":
        // Handle "turn left"
        state.moving = 0;
        break;
    case "KeyD":
    case "ArrowRight":
        // Handle "turn right"
        state.moving = 0;
        break;
    }
});

// TODO Do we want a service worker?
const mainLoop = t => {
    // TODO We probably want to decouple this from rendering ...
    simulate(t, state);
    render(ctx, t, state);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
