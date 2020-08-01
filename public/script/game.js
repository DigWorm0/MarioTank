/*
        Variables
*/
var Player = {};

/*
        Loops
*/
function update()
{
    Player.xVel += Controls.horizontal * PLAYER_SPEED;
    Player.yVel += Controls.vertical * PLAYER_SPEED;

    addMotion(Player);
    updateWorld(WORLD_DATA);
}
function render()
{
    if (selectedBlock != null)
    {
        drawRectOutline(selectedBlock.x*16-16, selectedBlock.y*16-16, selectedBlock.width*16, selectedBlock.height*16, "red")
    }
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
    Player = new WorldObject("entity/player-1", 3, 9, {
        jumped: false,
        xVel: 0,
        yVel: 0,
        animSpeed: 0.2,
        width:0.8
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