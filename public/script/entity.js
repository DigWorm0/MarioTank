/*
        Default AI
*/

var DefaultAI = {
    "entity/player":(entity) => {
        entity.state = (Math.abs(entity.xVel * CELL_SIZE) > 0.2) ? "walk" : "default";
        entity.state = entity.jumped ? "jump" : entity.state;
        entity.animFlip = Math.abs(entity.xVel) > 0.01 ? entity.xVel < 0 : entity.animFlip;
        runAnimation(entity);
    },
    "entity/goomba":(entity) => {
        if (!(entity.init))
        {
            entity.direction = true;
            entity.speed = 0.03;
            entity.init = true;
            entity.animSpeed = 0.1;
            entity.loadAnimations({
                "default":2
            }, true);
        }
        var collisions = 0;
        for (var i = 0; i < WORLD_DATA.length; i++) {
            const block = WORLD_DATA[i];
            if (block.solid && block != entity)
            {
                var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x, block.y, block.width, block.height)
                if (collides)
                {
                    collisions++;
                }
            }
        }
        if (collisions != 1)
            entity.direction = !entity.direction;
        if (entity.direction)
            entity.x += entity.speed;
        else
            entity.x -= entity.speed;
        
        runAnimation(entity);
    }
}

function runAnimation(entity)
{
    if (!("animSprites" in entity) || !("animSpeed" in entity))
        return;
    if (!(entity.animInit))
    {
        entity.state = "default";
        entity.animFlip = false;
        entity.animFrame = 0;
        entity.animInit = true;
    }

    var realAnimState = entity.animFlip ? entity.state + "_flip" : entity.state;
    entity.animFrame += entity.animSpeed;
    if (entity.animFrame >= entity.animSprites[realAnimState].length)
        entity.animFrame = 0;
    entity.sprite = entity.animSprites[realAnimState][Math.floor(entity.animFrame)];
}