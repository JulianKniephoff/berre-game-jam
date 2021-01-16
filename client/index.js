const screen = document.getElementById("screen");
const ctx = screen.getContext("2d");

const resize = () => {
    const { width, height } = document.body.getBoundingClientRect();
    requestAnimationFrame(t => {
        // TODO How do we want to size this?
        //   Do we want to keep a specific aspect ratio?
        //   or a specific size, even?
        //   How do we want to deal with HiDPI?

        screen.width = Math.floor(width * devicePixelRatio);
        screen.height = Math.floor(height * devicePixelRatio);
        screen.style.width = `${screen.width / devicePixelRatio}px`;
        screen.style.height = `${screen.height / devicePixelRatio}px`;

        render(ctx, t);
    });
};

window.addEventListener("resize", resize);
resize();

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
