/*
        Variables
*/
var Player = {};

/*
        Loops
*/
function update()
{
    if (Controls.up && !Player.jumped)
    {
        Player.yVel -= JUMP_FORCE
        Player.jumped = true;
    }
    Player.xVel += Controls.horizontal * PLAYER_SPEED;

    Player.state = (Math.abs(Player.xVel * CELL_SIZE) > 0.2) ? "walk" : "default";
    Player.state = Player.jumped ? "jump" : Player.state;
    Player.animFlip = Math.abs(Player.xVel) > 0.01 ? Player.xVel < 0 : Player.animFlip;

    addMotion(Player);
    updateWorld(WORLD_DATA);
}
function render()
{
    autoscroll((Player.x + (Player.width / 2)) * CELL_SIZE, CELL_WIDTH / 3);
    drawWorld(WORLD_DATA);
}

/*
        Initialization
*/
function beginGame() {
    // Initialize World
    loadWorld(DEFAULT_WORLD);

    // Initialize Player
    Player = new WorldObject("entity/player", 3, 9, {
        jumped: false,
        xVel: 0,
        yVel: 0,
        animSpeed: 0.16
    });
    Player.loadAnimations({
        "default":1,
        "jump":1,
        "tank":1,
        "walk":3
    }, true);

    // Initialize Other Modules
    beginControls();
    beginDraw();
}