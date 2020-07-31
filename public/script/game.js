/*
        Variables
*/
const Player = {
    x: 8*CELL_SIZE,
    y: 3*CELL_SIZE,
    width: 13,
    height: 16,
    xVel: 0,
    yVel: 0,
    jumped: false,
    animator: new Animator(loadAnimSprites("entity/player", {
        "default": 1,
        "jump": 1,
        "walk": 3,
        "tank": 1
    }), {}),
    world: DEFAULT_WORLD
}

/*
        Loops
*/
function update()
{
    Player.xVel += Controls.horizontal * PLAYER_SPEED;
    Player.yVel += Controls.vertical * PLAYER_SPEED;

    addMotion(Player);
}
function render()
{
    // Animations
    Player.animator.animState = (Math.abs(Player.xVel) > 0.2) ? "walk" : "default";
    Player.animator.animState = Player.jumped ? "jump" : Player.animator.animState;
    Player.animator.animMirror = Math.abs(Player.xVel) > 0.1 ? Player.xVel < 0 : Player.animator.animMirror;

    autoscroll(Player.x + (Player.width / 2), CELL_WIDTH / 3);
    drawWorld(WORLD_DATA, Player.world);
    drawSpriteBySize(Player.animator.getSprite(), Player.x, Player.y, Player.width, Player.height);
    if (selectedBlock != null)
    {
        drawRectOutline(selectedBlock.x*16-16, selectedBlock.y*16-16, selectedBlock.width*16, selectedBlock.height*16, "red")
    }
}

/*
        Initialization
*/
function beginGame() {
    beginControls();
    beginDraw();
}