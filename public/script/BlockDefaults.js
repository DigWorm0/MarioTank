/**
 * Default initializations for each block
 */
var BlockInit = {
    "entity/goomba-1":(goomba) => {
        InitAnim(goomba, {
            "default":2,
            "squash":1,
            "flip":1
        }, 0.1)

        goomba.gravity = true;
        goomba.physics = true;
    },
    "question/block-1":(block) => {
        InitAnim(block, {
            "default":4,
            "used":1
        }, 0.1)
    },
    "coin/coin-anim-1":(coin) => {
        InitAnim(coin, {
            "default":4
        }, 0.2);
        setTimeout(() => {
            DeleteBlock(coin);
        }, 500);
    },
    "power/fire-1":(shroom) => {
        InitAnim(coin, {
            "default":4
        }, 0.1);
    }
};

/**
 * Default updates for each block
 */
var BlockUpdate = {
    "entity/goomba-1":(goomba) => {
        BounceAround(goomba)
    },
    "coin/coin-anim-1":(coin) => {
        coin.y -= 0.1;
    },
    "power/shroom-1":(shroom) => {
        BounceAround(shroom)
    },
    "pipe/left-1":(pipe) => {
        if (Controls.right && FindCollision(pipe.x - 0.1, pipe.y + (pipe.height / 2), entity))
        {
            Pipe(pipe.prop)
        }
    },
    "pipe/up-1":(pipe) => {
        if (Controls.down && FindCollision(pipe.x + (pipe.width / 2), pipe.y - 0.1, entity))
        {
            Pipe(pipe.prop)
        }
    }
};

/**
 * Bounces objects around the map
 * @param {Object} block - Block to bounce around
 */
function BounceAround(block)
{
    if (entity.direction == undefined || entity.direction == null)
        entity.direction = false;
    if (entity.direction)
        entity.x += BOUNCE_SPEED;
    else
        entity.x -= BOUNCE_SPEED;
    var xCheck = entity.direction ? entity.width + entity.x - 0.1 : entity.x + 0.1;
    if (FindCollision(xCheck, block.y, block))
        block.direction = !block.direction;
}