const e = require("express");

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

        if (entity.yVel > 0) {
            entity.onground = true;
            entity.jumped = false;
        }
        
        entity.yVel = 0;
    }
    else
    {
        entity.onground = false;
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
    var collision = true;
    for (var i = 0; i < WORLD_DATA.length; i++) {
        const block = WORLD_DATA[i];
        if (block.solid && block != entity)
        {
            var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x, block.y, block.width, block.height)
            if (collides)
            {
                if (block.type == "question/block-1" && (entity.x + entity.width - 0.1) > block.x && (entity.x + 0.1) < block.x + block.width && entity.yVel < 0 && block.state != "used") {
                    block.state="used";
                    if (block.prop != "")
                        WORLD_DATA.push(new WorldObject(block.prop, block.x, block.y - 1, {
                            "solid":false
                        }))
                    Player.score += 200;
                    Player.coins += 1;
                    hop(block);
                }
                if (block.type == "brick/float-1" && (entity.x + entity.width - 0.1) > block.x && (entity.x + 0.1) < block.x + block.width && entity.yVel < 0 && !(block.jumped)) {
                    hop(block);
                }
                if (block.type == "entity/goomba-1") {
                    if (entity.yVel > 0.02) {
                        var index = i;
                        setTimeout(() => {
                            WORLD_DATA.splice(index, 1)
                        }, 200);
                    
                        block.speed = 0;
                        block.state = "squash";
                        block.solid = false;
                        block.y += 0.75;

                        Player.score += 100;

                        if (Controls.up) {
                            entity.yVel = -BOUNCE_FORCE * 2;
                            entity.jumped = true
                        }
                        else
                            entity.yVel = -BOUNCE_FORCE;
                    }
                    else
                    {
                        entity.die();
                    }
                }
                else
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
    world.forEach((block, index) => {
        if (block.type in DefaultAI)
        {
            DefaultAI[block.type](block, index);
        }
    });
}