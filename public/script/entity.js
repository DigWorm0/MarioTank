/*
        Default AI
*/

var DefaultAI = {
    "entity/player-1":(entity, index) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.die = () => {
                //window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                WORLD_DATA = [];
            }
        }
        entity.state = (Math.abs(entity.xVel * CELL_SIZE) > 0.2) ? "walk" : "default";
        entity.state = entity.jumped ? "jump" : entity.state;
        entity.animFlip = Math.abs(entity.xVel) > 0.01 ? entity.xVel < 0 : entity.animFlip;
        runAnimation(entity);
    },
    "entity/goomba-1":(entity, index) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.flip = (index) => {
                entity.state = "flip";
                entity.speed = 0;
                var i = index;
                setTimeout(() => {
                    WORLD_DATA.splice(i, 1)
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
    "question/block-1":(entity, index) => {
        if (!(entity.init))
        {
            entity.init = true;
            entity.animSpeed = 0.1;
            entity.loadAnimations({
                "default":3,
                "used":1
            }, false);
        }
        bounceAnimation(entity);
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

    for (var i = 0; i < WORLD_DATA.length; i++) {
        const block = WORLD_DATA[i];
        if (block.solid && block != entity)
        {
            var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x, block.y, block.width, block.height)
            if (collides && "flip" in block)
            {
                block.flip(i);
            }
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
}