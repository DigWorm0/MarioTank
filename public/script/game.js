/*
        Variables
*/
const Player = {
    x: 3*CELL_SIZE,
    y: 8*CELL_SIZE,
    width: 128, // 13
    height: 64, // 16
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
    if (Controls.up && !Player.jumped)
    {
        Player.yVel -= JUMP_FORCE
        Player.jumped = true;
    }
    Player.xVel += Controls.horizontal * PLAYER_SPEED;

    addMotion(Player);
}
function render()
{
    // Animations
    Player.animator.animState = (Math.abs(Player.xVel) > 0.2) ? "walk" : "default";
    Player.animator.animState = Player.jumped ? "jump" : Player.animator.animState;
    Player.animator.animMirror = Math.abs(Player.xVel) > 0.1 ? Player.xVel < 0 : Player.animator.animMirror;

    Player.animator.animState = "tank";

    autoscroll(Player.x + (Player.width / 2), CELL_WIDTH / 3);
    drawWorld(WORLD_DATA, Player.world);
    drawSpriteBySize(Player.animator.getSprite(), Player.x, Player.y, Player.width, Player.height);
    
    //drawText(Math.round(fps), cameraX + 10, cameraY + 20, 20, fps >= 60 ? "red" : "black");
    //drawLine(Player.x + 8, WORLD_DATA[DEFAULT_WORLD][5].y*16 - 8, WORLD_DATA[DEFAULT_WORLD][5].x*16 - 8, WORLD_DATA[DEFAULT_WORLD][5].y*16 - 8, "red")
    //drawLine(Player.x + 8, WORLD_DATA[DEFAULT_WORLD][5].y*16 - 8,Player.x + 8,Player.y + 8, "red")

}

/*
        Initialization
*/
function beginGame() {
    beginControls();
    beginDraw();
}