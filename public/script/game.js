/*
        Variables
*/
var Player = {};

/*
        Loops
*/
function update()
{
    if (Controls.up && Player.onground)
    {
        Player.jumped = true;
        Player.yVel -= JUMP_FORCE
    }
    if (Player.onground)
        Player.xVel += Controls.horizontal * PLAYER_SPEED;
    else
        Player.xVel += Controls.horizontal * PLAYER_AIR_SPEED;

    addMotion(Player);
    updateWorld(WORLD_DATA);
}
function render()
{
    autoscroll((Player.x + (Player.width / 2)) * CELL_SIZE, CELL_WIDTH / 3);
    drawWorld(WORLD_DATA);
    drawScores();
}

/*
        Initialization
*/
function beginGame() {
    // Initialize World
    loadWorld(currentWorld);

    // Initialize Player
    Player = new WorldObject("entity/player-1", 3, 9, {
        onground: false,
        xVel: 0,
        yVel: 0,
        animSpeed: 0.2,
        width:0.8,
        score: 0,
        coins: 0
    });
    Player.loadAnimations({
        "default":1,
        "jump":1,
        "walk":3
    }, true);

    // Initialize Other Modules
    beginControls();
    beginDraw();
}