import svg from './img/fox.svg';

const PLAYER_HEIGHT = 50;

const playerImage = new Image();
playerImage.src = svg;

const render = (ctx, t, { world, player }) => {
    // Background
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Platforms
    ctx.fillStyle = 'brown';
    for (const { x, y, w, h } of world.platforms) {
        ctx.fillRect(x, y, w, h);
    }

    // Player
    {
        const { x, y } = player.position;
        ctx.drawImage(playerImage, x, y - 107, 100, 107);
    }
};

export default render;
