var last = _getTimestamp();
var dt = 0;
var lastLoop = new Date();
var blackDisplay = false;
var timerInterval = -1;
var waitForWorld = true;

/**
 * Manages the speed of GraphicsLoop and PhysicsLoop
 * @private
 */
function _loop()
{
    var now = _getTimestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > STEP) {
        dt = dt - STEP;
        physicsLoop();
    }
    graphicsLoop();
    last = now;

    requestAnimationFrame(_loop);
}

/**
 * Runs physics updates
 */
function physicsLoop()
{
    applyPlayerVectors(player, world);
    player.update(player);
}

/**
 * Runs graphic updates
 */
function graphicsLoop()
{
    clearDraw();
    if (!(player))
        return;
    if (!blackDisplay)
    {
        if (world.autoScroll && ((player.x - CELL_WIDTH/2) * 16) - cameraX > 50)
            scrollTo(((player.x - CELL_WIDTH/2) * 16) - 50);
        if (world.autoScroll && ((player.x - CELL_WIDTH/2) * 16) - cameraX < -50)
            scrollTo(((player.x - CELL_WIDTH/2) * 16) + 50);
        drawWorld(world);
        drawPlayers(players);
    }
    else
    {
        drawText("WORLD " + world.displayName, 170, 100)
    }
    drawGUI(player, world);
}

/**
 * Runs at startup
 */
function start()
{
    resetWorld();
    requestAnimationFrame(_loop);
}

/**
 * @returns Current time in ms
 * @private
 */
function _getTimestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/**
 * Resets the World to Beginning
 */
function resetWorld()
{
    cameraX = 0;
    world.time = 400;
    bgColor = "black";
    blackDisplay = true;
    setTimeout(() => {
        bgColor = world.bgColor;
        blackDisplay = false;
        player.y = 1;
        if (timerInterval != -1)
            clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            world.time--;
        }, 1000);
    }, 1); // 2000
}