/*
        Variables
*/
var Player = {};

/*
        Loops
*/
function update()
{
    if (!Player.freeze)
    {
        if (Controls.up && Player.onground && !Player.jumping)
        {
            Player.jumped = true;
            Player.jumping = true;
            setTimeout(function() {
                Player.jumping = false;
            }, 100);
            Player.yVel -= JUMP_FORCE;
        }
        if (!Controls.up && Player.jumping)
        {
            Player.jumping = false;
        }
        if (Player.jumping)
        {
            Player.yVel -= CONTINUOUS_JUMP_FORCE
        }
        
        if (Player.onground && Controls.sprint)
            Player.xVel += Controls.horizontal * PLAYER_SPRINT_SPEED;
        else if (Player.onground)
            Player.xVel += Controls.horizontal * PLAYER_SPEED;
        else
            Player.xVel += Controls.horizontal * PLAYER_AIR_SPEED;

        if ((time <= 0 || Player.y >= 15) && "die" in Player)
            Player.die();
    }
    if (!Player.freezeGrav) {
        addMotion(Player);
    }
    updateWorld(WORLD_DATA);
}
function render()
{
    //canvas.width = window.innerWidth / 4;
    if (!Player.blackScreen) {
        if (autoScroll)
            autoscroll((Player.x + (Player.width / 2)) * CELL_SIZE, CELL_WIDTH / 3);
        drawWorld(WORLD_DATA);
    }
    else
    {
        drawRect(0,0,CELL_WIDTH * 16,canvas.height, "black");
        backgroundColor = "black";
    }

    drawScores();
}

/*
        Initialization
*/
function beginGame() {
    beginControls();
    beginDraw();
    // Initialize Player
    Player = new WorldObject("entity/player-1", 3, 9, {
        onground: false,
        xVel: 0,
        yVel: 0,
        animSpeed: 0.2,
        width:0.8,
        score: 0,
        coins: 0,
        x:50,
        blackScreen:true,
        jumping: false,
        freeze:false,
        freezeGrav: false,
        noRepeat:true,
        power:""
    });
    Player.loadAnimations({
        "default":1,
        "jump":1,
        "walk":3,
        "climb":1,
        "tall_default":1,
        "tall_jump":1,
        "tall_walk":3,
        "tall_climb":1
    }, true);

    setTimeout(function() {
        // Initialize World
        loadWorld(currentWorld, "spawn/default");
        Player.blackScreen = false;
        Player.xVel = 0;
        Player.yVel = 0;
    }, 1500);
}

function restartGame()
{
    Player = new WorldObject("entity/player-1", 3, 9, {
        onground: false,
        xVel: 0,
        yVel: 0,
        animSpeed: 0.2,
        width:0.8,
        score: 0,
        coins: 0,
        x:50,
        blackScreen:true,
        jumping: false,
        freeze:false,
        freezeGrav: false,
        noRepeat:true,
        power:""
    });
    Player.loadAnimations({
        "default":1,
        "jump":1,
        "walk":3,
        "climb":1,
        "tall_default":1,
        "tall_jump":1,
        "tall_walk":3,
        "tall_climb":1
    }, true);

    time = 400;
    setTimeout(function() {
        // Initialize World
        loadWorld(currentWorld, "spawn/default");
        Player.blackScreen = false;
        Player.xVel = 0;
        Player.yVel = 0;
    }, 1500);
}