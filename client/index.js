import World from '../game/world';
import State from '../game/state';
import simulate from '../game/simulation';

import Client from './client';

import render from './renderer';


const client = new Client();

const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

// TODO Do we want a service worker?
const mainLoop = t => {
    // TODO We probably want to decouple this from rendering ...
    simulate(t, client.state);
    render(ctx, t, client.state);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
