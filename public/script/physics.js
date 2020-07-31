/*
        Motion
*/
function addMotion(entity)
{
    //entity.yVel += GRAVITY;

    entity.y += entity.yVel;

    /*
    if (!verifyMovement(entity))
    {
        entity.y -= entity.yVel;

        if (entity.yVel > 0)
            entity.jumped = false;
        
        entity.yVel = 0;
    }
    */

    entity.x += entity.xVel;

    /*if (!verifyMovement(entity) || entity.x <= 0)
    {
        entity.x -= entity.xVel;

        entity.xVel = 0;
    }*/

    entity.xVel *= X_MOTION_DAMPING;
    entity.yVel *= Y_MOTION_DAMPING;
}

/*
        Collision Detection
*/
function verifyMovement(entity)
{
    for (var i = 0; i < WORLD_DATA[entity.world].length; i++) {
        const block = WORLD_DATA[entity.world][i];
        if (block.solid)
        {
            var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x * CELL_SIZE - CELL_SIZE, block.y * CELL_SIZE - CELL_SIZE, block.width * CELL_SIZE, block.height * CELL_SIZE)
            if (collides)
            {
                return false;
            }
        }
    }
    return true;
}