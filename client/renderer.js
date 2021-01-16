import svg from './img/fox.svg';

const playerImage = new Image();
playerImage.src = svg;

const render = (ctx, client) => {
    // TODO Indicate loading somehow
    if (!client.state) return;

    const { world, entities } = client.state;

    // Background
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    // Move camera
    ctx.translate(-(client.getPlayer().position.x - (ctx.canvas.width / 2)), 0);

    // Platforms
    ctx.fillStyle = 'brown';
    for (const { x, y, w, h } of world.platforms) {
        ctx.fillRect(x * 100, y * 100, w * 100, h * 100);
    }

    // Entities
    for (const { position: { x, y } } of entities.values()) {
        ctx.drawImage(playerImage, x, y - 107, 100, 107);
    }

    ctx.restore();
};

export default render;
