import World from '../game/world';
import State from '../game/state';
import Simulation from '../game/simulation';

import Client from './client';

import render from './renderer';


const client = new Client();

const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

// TODO Do we want a service worker?

const simulation = new Simulation(performance.now());
const mainLoop = t => {
    simulation.run(t, client.state);
    render(ctx, client);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
