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
    if (Controls.up && player.onground && !player.jumping)
    {
        player.jumped = true;
        player.jumping = true;
        player.yVel -= JUMP_FORCE;

        setTimeout(function() {
            player.jumping = false;
        }, 100);
    }
    if (!Controls.up && player.jumping)
    {
        player.jumping = false;
    }
    if (player.jumping)
    {
        player.yVel -= CONTINUOUS_JUMP_FORCE
    }
    
    if (player.onground && Controls.sprint)
        player.xVel += Controls.horizontal * PLAYER_SPRINT_SPEED;
    else if (player.onground)
        player.xVel += Controls.horizontal * PLAYER_SPEED;
    else
        player.xVel += Controls.horizontal * PLAYER_AIR_SPEED;
    
    ApplyWorldVectors(worldData);
    ApplyVectors(player, worldData);
}

/**
 * Runs graphic updates
 */
function GraphicsLoop()
{
    if (worldProperties.autoscroll)
        ScrollTo(player.x);
    ClearDraw();
    DrawWorld(worldData);
    DrawPlayers(players);
    DrawGUI(player, worldProperties);
}

/**
 * Runs at startup
 */
function Start()
{
    requestAnimationFrame(Loop);
}

/**
 * @returns Current time in ms
 * @private
 */
function GetTimestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}