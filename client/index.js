import render from './renderer';

const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');

// TODO This obviously needs to come from somewhere else
import world from '../server/worlds/0.json';

// TODO Simulation loop/framerate stuff
// TODO Do we want a service worker?
const mainLoop = t => {
    render(ctx, t, world);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
