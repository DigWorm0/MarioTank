/*
        Variables
*/
var Player = {};
var freezeControls = false;

/*
        Loops
*/
function update()
{
    // Controls
    if (!freezeControls)
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
    }

    // Check if Player Fell through the World
    if ((time <= 0 || Player.y >= 15) && "die" in Player)
        Player.die();
    addMotion(Player); // Add physics to the Player
    updateWorld(WORLD_DATA); // Add physics to the world
}
function render()
{
    //canvas.width = window.innerWidth / 4;
    if (autoScroll)
        autoscroll((Player.x + (Player.width / 2)) * CELL_SIZE, CELL_WIDTH / 3);
    drawWorld(WORLD_DATA);

    drawScores();
}

/*
        Initialization
*/
function beginGame() {
    beginControls();
    beginDraw();
    freeze();
    initPlayer();

    freezeControls = true;
    blackScreen = true;

    setTimeout(function() {
        // Initialize World
        loadWorld(currentWorld, "spawn/default");
        unfreeze();
        freezeControls = false;
        blackScreen = false;
    }, 1500);
}

function restartGame()
{
    initPlayer();
    freeze();
    blackScreen = true;
    freezeControls = true;

    time = 400;
    setTimeout(function() {
        // Initialize World
        loadWorld(currentWorld, "spawn/default");
        unfreeze();
        freezeControls = false;
        blackScreen = false;
    }, 1500);
}

function initPlayer()
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
        jumping: false,
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
}