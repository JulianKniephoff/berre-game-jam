import World from '../game/world';
import State from '../game/state';

import render from './renderer';


const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');

// TODO This obviously needs to come from somewhere else
import DUMMY_WORLD from '../server/worlds/0.json';

const world = new World(DUMMY_WORLD);
const state = new State(world);

// TODO Simulation loop/framerate stuff
// TODO Do we want a service worker?
const mainLoop = t => {
    render(ctx, t, state);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
