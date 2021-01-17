import foxBody0SVG from './img/fox-body0.svg';
import foxEars0SVG from './img/fox-ears0.svg';
import foxEars1SVG from './img/fox-ears1.svg';
import foxMouthNormalSVG from './img/fox-mouth-normal.svg';
import foxMouthEatingSVG from './img/fox-mouth-eating.svg';
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
import cornSVG from './img/corn.svg';
import cherrySVG from './img/cherry.svg';
import berrySVG from './img/berry.svg';
import wormSVG from './img/worm.svg';

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
    mouthNormal: loadImage(foxMouthNormalSVG),
    mouthEating: loadImage(foxMouthEatingSVG),
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

const foodImages = [
    loadImage(cornSVG),
    loadImage(cherrySVG),
    loadImage(berrySVG),
    loadImage(wormSVG),
];

const render = (ctx, client, lag) => {
    // TODO Indicate loading somehow
    if (!client.state) {
        return;
    }

    const { world, entities, foods } = client.state;
    const player = client.getPlayer();
    let playerPos = {
        x: player.position.x + player.getSpeed().x * lag,
        y: player.position.y + player.getSpeed().y * lag,
    };

    // Background
    ctx.fillStyle = '#34b1eb';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    // Move camera
    ctx.translate(-(Math.floor(playerPos.x) - (ctx.canvas.width / 2)), -(Math.floor(playerPos.y) - (ctx.canvas.height / 2) - 500));

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
    for (const entity of entities.values()) {
        if (!entity.isDead()) {
            renderPlayer(ctx, entity, lag);
        }
    }

    const s = (new Date()).getSeconds() + (new Date()).getMilliseconds() / 1000;
    for (const { x, y, kind } of foods) {
        const size = 100;
        const floatyMcFloatFace = Math.sin((s * 4) % (Math.PI * 2)) * 10;
        const turnyMcTurnFace = Math.sin((s * 1.5) % (Math.PI * 2)) * 0.2;

        ctx.save();
        ctx.translate(
            x * size + size / 2,
            y * size + floatyMcFloatFace + size / 4,
        );
        ctx.rotate(turnyMcTurnFace);
        ctx.drawImage(foodImages[kind], -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    ctx.restore();

    renderUi(ctx, client.getPlayer());
};


const renderPlayer = (ctx, playerEntity, lag) => {
    const size = 200;
    let { position: { x, y }, name } = playerEntity;
    x += playerEntity.getSpeed().x * lag;
    y += playerEntity.getSpeed().y * lag;

    ctx.save();
    ctx.translate(x, y - size / 2);
    ctx.rotate(2 * x / size);

    ctx.drawImage(player.ears[0], -size / 2, -size, size, size);
    ctx.drawImage(player.bodies[0], -size / 2, -size / 2, size, size);
    if (playerEntity.eatingTimer > 0) {
        const mouth = (Math.ceil(playerEntity.eatingTimer * 10) % 2 !== 0) ? player.mouthEating : player.mouthNormal;
        ctx.drawImage(mouth, -size / 2, -size / 2, size, size);
    } else {
        ctx.drawImage(player.mouthNormal, -size / 2, -size / 2, size, size);
    }

    ctx.restore();

    // render name
    if (!name) {
        return;
    }
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name, x, y - size - 50);
    ctx.restore();
};


const renderUi = (ctx, playerEntity) => {
    if (playerEntity.isDead()) {
        ctx.fillStyle = '#000';
        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU DEAD", ctx.canvas.width / 2, ctx.canvas.height / 2)

        ctx.font = "50px Arial";
        ctx.fillText(
            Math.ceil(playerEntity.deathTimer),
            ctx.canvas.width / 2,
            ctx.canvas.height / 2 + 100,
        );
    } else {
        ctx.save();
        ctx.fillStyle = 'red';
        for (let i = 0; i < playerEntity.satiation; i++) {
            const height = 40 * Math.min(1, playerEntity.satiation - i);
            ctx.fillRect(25 + (i * 50), 25, 40, height);
        }
        ctx.restore();
    }
};

export default render;
