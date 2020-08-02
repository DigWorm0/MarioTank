/*
        Default AI
*/

var DefaultAI = {
    "entity/player-1":(entity) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.die = () => {
                //window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                WORLD_DATA = [];
                restartGame();
            }
        }
        entity.state = (Math.abs(entity.xVel * CELL_SIZE) > 0.2) ? "walk" : "default";
        entity.state = entity.jumped ? "jump" : entity.state;
        entity.animFlip = Math.abs(entity.xVel) > 0.01 ? entity.xVel < 0 : entity.animFlip;
        runAnimation(entity);
    },
    "entity/goomba-1":(entity) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.flip = () => {
                entity.state = "flip";
                entity.speed = 0;
                var i = entity.index;
                console.log(i);
                setTimeout(() => {
                    deleteFromWorld(entity)
                }, 200);
            };
            entity.loadAnimations({
                "default":2,
                "squash":1,
                "flip":1
            }, false);
        }
        bounce(entity);
        runAnimation(entity);
    },
    "question/block-1":(entity) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.animSpeed = 0.1;
            entity.loadAnimations({
                "default":4,
                "used":1
            }, false);
        }
        bounceAnimation(entity);
    },
    "coin/coin-anim-1":(entity) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.loadAnimations({
                "default":4
            }, false);
            entity.animSpeed = 0.2;
            setTimeout(() => {
                deleteFromWorld(entity)
            }, 500);
        }
        entity.y -= 0.1;
        runAnimation(entity);
    }
}

/*
        Animations
*/

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

function bounceAnimation(entity)
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
    if (entity.animFrame >= entity.animSprites[realAnimState].length || entity.animFrame <= 0) {
        entity.animSpeed *= -1;
        entity.animFrame += entity.animSpeed * 10;
    }
    if (entity.animFrame >= entity.animSprites[realAnimState].length || entity.animFrame <= 0) {
        entity.animFrame = 0;
    }
    entity.sprite = entity.animSprites[realAnimState][Math.floor(entity.animFrame)];
}

/*
        Universal AI
*/
function hop(entity)
{
    entity.y -= 0.2;
    entity.jumped = true;
    setTimeout(() => {
        entity.y += 0.2;
        entity.jumped = false;
    }, 100);

    var e = checkPoint(entity.x + entity.width / 2, entity.y - entity.height / 2, entity);
    if (e)
    {
        if ("flip" in e)
        {
            e.flip();
        }
    }
}
function bounce(entity)
{
    if (!(entity.initBounce))
    {
        entity.direction = true;
        entity.speed = 0.03;
        entity.initBounce = true;
        entity.animSpeed = 0.1;
    }
    if (entity.direction)
        entity.x += entity.speed;
    else
        entity.x -= entity.speed;
    var x = entity.direction ? entity.width + entity.x - 0.1 : entity.x + 0.1;
    if (checkPoint(x, entity.y + entity.height / 2, entity) || !checkPoint(entity.x + entity.width / 2, entity.y + entity.height, entity))
        entity.direction = !entity.direction;
}
function checkPoint(x, y, entity)
{
    for (var i = 0; i < WORLD_DATA.length; i++) {
        const block = WORLD_DATA[i];
        if (block.solid && block != entity)
        {
            if (checkCollisions(x, y, 0, 0, block.x, block.y, block.width, block.height))
            {
                return block;
            }
        }
    }
    return false;
}