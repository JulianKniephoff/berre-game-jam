import playerSVG from './img/fox.svg';
import grassBottomCenterSVG from './img/grass-bottom-center.svg';
import grassBottomLeftSVG from './img/grass-bottom-left.svg';
import grassBottomRightSVG from './img/grass-bottom-right.svg';
import grassMiddleCenterSVG from './img/grass-middle-center.svg';
import grassMiddleLeftSVG from './img/grass-middle-left.svg';
import grassMiddleRightSVG from './img/grass-middle-right.svg';
import grassTopCenterSVG from './img/grass-top-center.svg';
import grassTopLeftSVG from './img/grass-top-left.svg';
import grassTopRightSVG from './img/grass-top-right.svg';

const loadImage = (svg) => {
    const img = new Image();
    img.src = svg;
    return img;
};

const playerImage = loadImage(playerSVG);

const grass = {
    bottom: {
        center: loadImage(grassBottomCenterSVG),
        left: loadImage(grassBottomLeftSVG),
        right: loadImage(grassBottomRightSVG),
    },
    middle: {
        center: loadImage(grassMiddleCenterSVG),
        left: loadImage(grassMiddleLeftSVG),
        right: loadImage(grassMiddleRightSVG),
    },
    top: {
        center: loadImage(grassTopCenterSVG),
        left: loadImage(grassTopLeftSVG),
        right: loadImage(grassTopRightSVG),
    },
};


const render = (ctx, t, client) => {
    // TODO Indicate loading somehow
    if (!client.state) return;

    const { world, entities } = client.state;

    // Background
    ctx.fillStyle = '#34b1eb';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    // Move camera
    ctx.translate(-(client.getPlayer().position.x - (ctx.canvas.width / 2)), 0);

    // Platforms
    ctx.fillStyle = 'brown';
    for (const { x, y, w, h } of world.platforms) {
        for (let i = 0; i < h; i++) {
            let imgs;
            if (i == 0) {
                imgs = grass.top;
            } else if (i == h - 1) {
                imgs = grass.bottom;
            } else {
                imgs = grass.middle;
            }

            renderPlatformLine(ctx, x, w, y + i, imgs);
        }
    }

    // Entities
    for (const { position: { x, y } } of entities.values()) {
        ctx.drawImage(playerImage, x, y - 107, 100, 107);
    }

    ctx.restore();
};

const renderPlatformLine = (ctx, x, w, y, { left, center, right }) => {
    for (let i = 0; i < w; i++) {
        let img;
        if (i == 0) {
            img = left;
        } else if (i == w - 1) {
            img = right;
        } else {
            img = center;
        }

        ctx.drawImage(img, (x + i) * 100, y * 100, 100, 100);
    }
};

export default render;
