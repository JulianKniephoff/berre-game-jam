const PLAYER_HEIGHT = 50;

const render = (ctx, t, world) => {
    // Background
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Platforms
    ctx.fillStyle = 'brown';
    for (const { x, y, w, h } of world.platforms) {
        ctx.fillRect(x, y, w, h);
    }

    // Player
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    const position = world.player.position;
    ctx.arc(
        position.x,
        position.y - PLAYER_HEIGHT / 2,
        PLAYER_HEIGHT / 2,
        0,
        2 * Math.PI,
    );
    ctx.fill();
};

export default render;
