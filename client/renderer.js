const render = (ctx, t, world) => {
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'brown';
    for (const { x, y, w, h } of world.platforms) {
        ctx.fillRect(x, y, w, h);
    }
};
export default render;
