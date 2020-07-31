/*
        Motion
*/
function addMotion(entity)
{
    entity.yVel += GRAVITY;

    entity.y += entity.yVel;

    if (!verifyMovement(entity))
    {
        entity.y -= entity.yVel;

        if (entity.yVel > 0)
            entity.jumped = false;
        
        entity.yVel = 0;
    }

    entity.x += entity.xVel;

    if (!verifyMovement(entity) || entity.x <= 0)
    {
        entity.x -= entity.xVel;

        entity.xVel = 0;
    }

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
                if (block.breakable)
                {
                    //entity.xVel=0;
                    //WORLD_DATA[entity.world].splice(i, 1);
                }
                return false;
            }
        }
    }
    return true;
}

function checkCollisions(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}