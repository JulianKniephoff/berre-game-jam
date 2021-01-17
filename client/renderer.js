import foxBody0SVG from './img/fox-body.svg';
import foxEars0SVG from './img/fox-ears0.svg';
import foxEars1SVG from './img/fox-ears1.svg';
import grassBottomCenterSVG from './img/grass-bottom-center.svg';
import grassBottomLeftSVG from './img/grass-bottom-left.svg';
import grassBottomRightSVG from './img/grass-bottom-right.svg';
import grassMiddleCenterSVG from './img/grass-middle-center.svg';
import grassMiddleLeftSVG from './img/grass-middle-left.svg';
import grassMiddleRightSVG from './img/grass-middle-right.svg';
import grassTopCenterSVG from './img/grass-top-center.svg';
import grassTopLeftSVG from './img/grass-top-left.svg';
import grassTopRightSVG from './img/grass-top-right.svg';
import blockVariation0SVG from './img/block-variation0.svg';
import blockVariation1SVG from './img/block-variation1.svg';
import blockVariation2SVG from './img/block-variation2.svg';

const loadImage = (svg) => {
    const img = new Image();
    img.src = svg;
    return img;
};

const player = {
    bodies: [loadImage(foxBody0SVG)],
    ears: [
        loadImage(foxEars0SVG),
        loadImage(foxEars1SVG),
    ],
};

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
    variations: [
        loadImage(blockVariation0SVG),
        loadImage(blockVariation1SVG),
        loadImage(blockVariation2SVG),
    ],
};


const render = (ctx, client) => {
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
    let tileNo = 0;
    for (const { x, y, w, h } of world.platforms) {
        for (let ty = 0; ty < h; ty++) {
            let imgs;
            if (ty == 0) {
                imgs = grass.top;
            } else if (ty == h - 1) {
                imgs = grass.bottom;
            } else {
                imgs = grass.middle;
            }

            for (let tx = 0; tx < w; tx++) {
                let img;
                if (tx == 0) {
                    img = imgs.left;
                } else if (tx == w - 1) {
                    img = imgs.right;
                } else {
                    img = imgs.center;
                    if (ty > 0 && ty < h - 1) {
                        if (tileNo % 37 == 0) {
                            img = grass.variations[1];
                        } else if (tileNo % 47 == 0) {
                            img = grass.variations[2];
                        } else  if (tileNo % 61 == 0) {
                            img = grass.variations[0];
                        }
                    }
                }

                ctx.drawImage(img, (x + tx) * 100, (y + ty) * 100, 100, 100);
                tileNo += 1;
            }
        }
    }

    // Entities
    for (const { position: { x, y } } of entities.values()) {
        renderPlayer(ctx, x, y);
    }

    ctx.restore();
};


const renderPlayer = (ctx, x, y) => {
    const size = 200;

    const before = ctx.save();
    ctx.translate(x, y - size / 2);
    ctx.rotate(2 * x / size);

    ctx.drawImage(player.ears[0], -size / 2, -size, size, size);
    ctx.drawImage(player.bodies[0], -size / 2, -size / 2, size, size);

    ctx.restore();
};

export default render;
