/*
        Variables
*/
var freezePhysics = false;

/*
        Motion
*/
function addMotion(entity)
{
    // Gravity
    if (!freezePhysics)
        entity.yVel += GRAVITY;

    // Y Vector
    entity.y += entity.yVel;
    if (!verifyMovement(entity))
    {
        if (entity.yVel > 0) {
            entity.onground = true;
            entity.jumped = false;
        }
        entity.y -= entity.yVel;
        entity.yVel = 0;
    }
    else
    {
        entity.onground = false;
    }
    entity.yVel *= Y_MOTION_DAMPING;

    // X Vector
    entity.x += entity.xVel;
    if (!verifyMovement(entity) || entity.x <= 0)
    {
        entity.x -= entity.xVel;
        entity.xVel = 0;
    }
    entity.xVel *= X_MOTION_DAMPING;
}

/*
        Collision Detection
*/
function verifyMovement(entity)
{
    var collision = true;
    for (var i = 0; i < WORLD_DATA.length; i++) {
        const block = WORLD_DATA[i];
        var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x, block.y, block.width, block.height)
        if (block != entity && collides)
        {
            if (checkPlayerCollisions(block)) // Check if Player Approves of Collision
            {
                collision = false;
            }
        }
    }
    return collision;
}
function checkCollisions(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

/*
        World Update
*/
function updateWorld(world)
{
    if (!freezePhysics)
    {
        world.forEach((block, index) => {
            if (block.type in DefaultAI)
            {
                DefaultAI[block.type](block);
            }
        });
    }
    else
    {
        DefaultAI["entity/player-1"](Player);
    }
}

/*
        Freeze Physics
*/
function freeze() {
    freezePhysics = true;
    Player.xVel = 0;
    Player.yVel = 0;
}
function unfreeze() {
    freezePhysics = false;
    Player.xVel = 0;
    Player.yVel = 0;
}