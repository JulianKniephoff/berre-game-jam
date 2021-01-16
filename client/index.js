const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

const render = (ctx, t) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "black";
    for (let i = 0; i < ctx.canvas.height; i += 2) {
        ctx.fillRect(0, i, ctx.canvas.width, 1);
    }
};

// TODO Simulation loop/framerate stuff
// TODO Do we want a service worker?
const mainLoop = t => {
    render(ctx, t);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
