import World from '../game/world';
import State from '../game/state';
import Simulation from '../game/simulation';
import Sound from "./sound";

import Client from './client';

import render from './renderer';


const client = new Client();

const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

// TODO Do we want a service worker?

const simulation = new Simulation(performance.now());
const mainLoop = t => {
    const lag = simulation.run(t, client.state, () => client.sound.play(Sound.SOUNDS.EAT));
    render(ctx, client, lag);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
