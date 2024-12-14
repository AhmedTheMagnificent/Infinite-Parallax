import { loadSprite, makeSprite, makeLayer, makeInfiniteScroll } from "./utils.js";

const container = document.querySelector(".container");

new ResizeObserver(() => {
    document.documentElement.style.setProperty(
        "--scale",
        Math.min(
            container.parentElement.offsetWidth / container.offsetWidth,
            container.parentElement.offsetHeight / container.offsetHeight
        )
    );
}).observe(container.parentElement);

async function main() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load all sprites
    const [sprite1, sprite2, sprite3, sprite4] = await Promise.all([
        loadSprite("assets/nature_5/1.png"),
        loadSprite("assets/nature_5/2.png"),
        loadSprite("assets/nature_5/3.png"),
        loadSprite("assets/nature_5/4.png"),
    ]);

    // Create game objects
    const layer1GameObj = makeSprite(ctx, sprite1, { x: 0, y: -100 }, 4);
    const layer2GameObj = makeLayer(ctx, sprite2, { x: 0, y: -100 }, 4);
    const layer3GameObj = makeLayer(ctx, sprite3, { x: 0, y: -100 }, 4);
    const layer4GameObj = makeLayer(ctx, sprite4, { x: 0, y: -100 }, 4);

    let dt;
    let oldTimeStamp = 0;
    let fps;
    const debugMode = true;

    function gameLoop(timeStamp) {
        dt = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;
        fps = Math.round(1 / dt);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and animate layers
        layer1GameObj.draw(); // Static layer
        makeInfiniteScroll(dt, layer2GameObj, -100); // Scrolling layer
        makeInfiniteScroll(dt, layer3GameObj, -50);
        makeInfiniteScroll(dt, layer4GameObj, -25);

        // Debug information (FPS)
        if (debugMode) {
            ctx.font = "24px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`FPS: ${fps}`, 10, 30);
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}

main();
