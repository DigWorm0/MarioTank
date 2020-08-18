var last = _getTimestamp();
var dt = 0;
var lastLoop = new Date();
var blackDisplay = false;
var timerInterval = -1;
var countdownInterval = -1;
var waitForWorld = true;
var msg = "";

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
    playerUpdate()
    if (player.y>18 || world.time<1) {
        player.die(true);
    }
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
        if (player.x && player.y) {
            if (world.autoScroll && ((player.x - CELL_WIDTH/2) * CELL_SIZE) - cameraX > 50)
                scrollTo(((player.x - CELL_WIDTH/2) * CELL_SIZE) - 50);
            if (world.autoScroll && ((player.x - CELL_WIDTH/2) * CELL_SIZE) - cameraX < -50)
                scrollTo(((player.x - CELL_WIDTH/2) * CELL_SIZE) + 50);
        }
        drawWorld(world);
        drawPlayers(players);
    }
    else
    {
        ctx.textAlign = 'center';
        drawText(this.msg, canvas.width / 2, 6.25*CELL_SIZE)
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
    stallMsg("WORLD " + world.displayName);
    if (countdownInterval != -1)
        clearInterval(countdownInterval);
    countdownInterval = setTimeout(() => {
        exitStall();
    }, 2000);
}

function stallMsg(msg)
{
    cameraX = 0;
    world.time = 400;
    bgColor = "black";
    blackDisplay = true;
    player.x = null;
    player.y = null;
    this.msg = msg;
    clearInterval(timerInterval);
}

function exitStall()
{
    bgColor = world.bgColor;
    blackDisplay = false;
    world.time = 400;
    player.y = 2;
    player.x = 2;
    player.xVel = 0;
    player.yVel = 0;
    if (timerInterval != -1)
        clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (world.time)
            world.time--;
        else
            world.time = 400;
    }, 1000);
    for (var key in world.blocks)
    {
        if (world.blocks[key].type == "spawn/default")
        {
            player.x = world.blocks[key].x;
            player.y = world.blocks[key].y - player.height;
        }
    }
}