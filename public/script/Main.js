var last = GetTimestamp();
var dt = 0;
var lastLoop = new Date();

/**
 * Manages the speed of GraphicsLoop and PhysicsLoop
 * @private
 */
function Loop()
{
    var now = GetTimestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > STEP) {
        dt = dt - STEP;
        PhysicsLoop();
    }
    GraphicsLoop();
    last = now;

    requestAnimationFrame(Loop);
}

/**
 * Runs physics updates
 */
function PhysicsLoop()
{
    UpdateControls();

    player.xVel += Controls.horizontal * PLAYER_SPEED;
    player.yVel += Controls.vertical * PLAYER_SPEED;
    
    ApplyWorldVectors(worldData);
    ApplyVectors(player, worldData);
}

/**
 * Runs graphic updates
 */
function GraphicsLoop()
{
    if (worldProperties.autoScroll)
        ScrollTo((player.x - CELL_WIDTH/2) * 16);
    bgColor = worldProperties.bgColor;
    ClearDraw();
    if (selectedBlock)
        DrawRect(selectedBlock.x-1.05, selectedBlock.y-1.05, selectedBlock.width + 0.1, selectedBlock.height + 0.1, "red")
    DrawWorld(worldData);
    DrawPlayers(players);
    DrawGUI(player, worldProperties);
}

/**
 * Runs at startup
 */
function Start()
{
    LoadWorld("1-1")
    requestAnimationFrame(Loop);
}

/**
 * @returns Current time in ms
 * @private
 */
function GetTimestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}