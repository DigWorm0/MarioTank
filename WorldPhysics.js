/**
 * Module Exports
 * @param {Object} io - Socket.io
 */
module.exports.load = function(io, worlds, blockConstructor)
{
    this.io = io;
    this.worlds = worlds;
    this.Block = blockConstructor;


    module.exports.blockInits = {
        "coin/coin-anim-1":(entity) => {
            _initAnim(entity, {
                "default":6
            }, 0.2);
            setTimeout(() => {
                io.emit("removeBlock", entity.world, entity.id)
                delete this.worlds[entity.world].blocks[entity.id];
            }, 400);
        },
        "question/block-1":(entity) => {
            _initAnim(entity, {
                "default":6,
                "used":1
            }, 0.12);
        },
        "entity/goomba-1":(entity) => {
            _initAnim(entity, {
                "default":2,
                "squash":1,
                "flip":1
            });
            entity.isPhysics = true;
            entity.isGravity = true;
        },
        "tank/bullet-1":(entity) => {
            setTimeout(() => {
                io.emit("removeBlock", entity.world, entity.id)
                delete this.worlds[entity.world].blocks[entity.id];
            }, 1000);
        },
        "power/fire-1":(entity) => {
            _initAnim(entity, {
                "default":4
            });
        },
        "brick/debris-1":(entity) => {
            var debrisA = new this.Block("brick/debrisl-1", entity.x, entity.y, entity.world, {isPhysics: true, isGravity:true, isSolid:false, xVel: -.2, yVel:-.35});
            var debrisB = new this.Block("brick/debrisl-1", entity.x, entity.y, entity.world, {isPhysics: true, isGravity:true, isSolid:false, xVel: -.2, yVel:-.15});
            var debrisC = new this.Block("brick/debrisr-1", entity.x, entity.y, entity.world, {isPhysics: true, isGravity:true, isSolid:false, xVel:  .2, yVel:-.35});
            var debrisD = new this.Block("brick/debrisr-1", entity.x, entity.y, entity.world, {isPhysics: true, isGravity:true, isSolid:false, xVel:  .2, yVel:-.15});
            worlds[entity.world].blocks[debrisA.id] = debrisA;
            worlds[entity.world].blocks[debrisB.id] = debrisB;
            worlds[entity.world].blocks[debrisC.id] = debrisC;
            worlds[entity.world].blocks[debrisD.id] = debrisD;
            this.io.emit("addBlock", entity.world, debrisA);
            this.io.emit("addBlock", entity.world, debrisC);
            this.io.emit("addBlock", entity.world, debrisD);
            this.io.emit("addBlock", entity.world, debrisB);
            var a = debrisA.id;
            var b = debrisB.id;
            var c = debrisC.id;
            var d = debrisD.id;
            var e = entity.id;
            var w = entity.world;
            setTimeout(() => {
                this.io.emit("removeBlock", w, a);
                this.io.emit("removeBlock", w, b);
                this.io.emit("removeBlock", w, c);
                this.io.emit("removeBlock", w, d);
                this.io.emit("removeBlock", w, e);
                delete this.worlds[w].blocks[a];
                delete this.worlds[w].blocks[b];
                delete this.worlds[w].blocks[c];
                delete this.worlds[w].blocks[d];
                delete this.worlds[w].blocks[e];
            }, 2000);
        }
    };
    module.exports.blockUpdates = {
        "coin/coin-anim-1":(entity) => {
            entity.y -= 0.2;
            this.io.emit("updateBlock", entity.world, entity.id, {"y":entity.y});
        },
        "entity/goomba-1":(entity) => {
            _bounceAround(entity, this.worlds[entity.world]);
        },
        "tank/bullet-1":(entity) => {
            if (entity.direction)
                entity.x -= 1;
            else
                entity.x += 1;
            this.io.emit("updateBlock", entity.world, entity.id, {"x":entity.x});
            var collider = _findCollision(entity.x, entity.y, entity, this.worlds[entity.world], entity.width, entity.height);
            if (collider)
            {
                var b = new this.Block('brick/debris-1',collider.x, collider.y, collider.world, {"isSolid":false});
                this.worlds[collider.world].blocks[b.id] = b;
                io.emit("addBlock", collider.world, b);

                io.emit("removeBlock", entity.world, entity.id)
                delete this.worlds[entity.world].blocks[entity.id];

                io.emit("removeBlock", collider.world, collider.id)
                delete this.worlds[collider.world].blocks[collider.id];
            }
        }
    };

    /**
     * Applys vectors to all applicable blocks in a world
     * @param {string} worldID - ID of the world
     * @param {Object} world - The world to apply vectors to
     */
    module.exports.updateWorld = function(worldID, world)
    {
        for (id in world.blocks)
        {
            if (world.blocks[id].isPhysics) {
                module.exports.updateBlock(world.blocks[id], world);
            }
            if ("update" in world.blocks[id])
            {
                world.blocks[id].update(world.blocks[id]);
            }
        }
    }

    /**
     * Applys velocity and gravity to applicable blocks
     * @param {Object} block - Block to apply vectors to
     * @param {Object} world - World the block exists in
     */
    module.exports.updateBlock = function(block, world)
    {
        if (block.isGravity)
            block.yVel += .025;
        block.y += block.yVel;
        if (block.isSolid)
            _correctYMovement(block, world);
        block.x += block.xVel;
        if (block.isSolid)
            _correctXMovement(block, world);
        block.xVel *= .9;
        block.yVel *= .999;

        this.io.emit("updateBlock", world.id, block.id, {x:block.x, y:block.y, xVel:block.xVel, yVel:block.yVel});
    }
}

/**
 * Corrects movement in the Y axis
 * @param {Object} block - Block to correct any invalid movements
 * @param {Object} world - World the block exists in
 * @private
 */
function _correctYMovement(block, world)
{
    for (var id in world.blocks)
    {
        if (id != block.id && _boxCollider(block.x, block.y, block.width, block.height, world.blocks[id].x, world.blocks[id].y, world.blocks[id].width, world.blocks[id].height))
        {
            if (block.collision(block, world.blocks[id]))
            {
                var d1 = (world.blocks[id].y) - (block.y + block.height)-0.0001;
                var d2 = -((block.y) - (world.blocks[id].y + world.blocks[id].height))+0.0001;
                var d = Math.abs(d1) < Math.abs(d2) ? d1 : d2;
                block.y += d;
                block.yVel = 0;
            }
        }
    }
}

/**
 * Corrects movement in the X axis
 * @param {Object} block - Block to correct any invalid movements
 * @param {Object} world - World the block exists in
 * @private
 */
function _correctXMovement(block, world)
{
    for (var id in world.blocks)
    {
        if (id != block.id && _boxCollider(block.x, block.y, block.width, block.height, world.blocks[id].x, world.blocks[id].y, world.blocks[id].width, world.blocks[id].height))
        {
            if (block.collision(block, world.blocks[id]))
            {
                var d1 = (world.blocks[id].x) - (block.x + block.width)-0.0001;
                var d2 = -((block.x) - (world.blocks[id].x + world.blocks[id].width))+0.0001;
                var d = Math.abs(d1) < Math.abs(d2) ? d1 : d2;
                block.x += d;
                block.xVel = 0;
            }
        }
    }
}

/**
 * Checks if there is a collision between (x1, y1, w1, h1) and (x2, y2, w2, h2)
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} w1 
 * @param {number} h1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} w2 
 * @param {number} h2 
 * @returns {boolean} - True if there is a collision, false otherwise
 * @private
 */
function _boxCollider(x1, y1, w1, h1, x2, y2, w2, h2)
{
    return !(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
}

/**
 * Checks if a specified point or box collides with any objects in the world
 * @param {number} x - X Position
 * @param {number} y - Y Position
 * @param {Object} block - Block to ignore during search
 * @param {number} [width=0] - Optional width
 * @param {number} [height=0] - Optional height
 * @private
 */
function _findCollision(x, y, block, world, width = 0, height = 0)
{
    for (var key in world.blocks)
    {
        if (world.blocks[key].isSolid && key != block.id && _boxCollider(x, y, width, height, world.blocks[key].x, world.blocks[key].y, world.blocks[key].width, world.blocks[key].height))
        {
            return world.blocks[key];
        }
    }
    return null;
}

/**
 * Bounces objects around the map
 * @param {Object} block - Block to bounce around
 * @private
 */
function _bounceAround(block, world)
{
    if (block.direction == undefined || block.direction == null)
        block.direction = false;
    if (block.direction)
        block.xVel = .08;
    else
        block.xVel = -.08;
    var xCheck = block.direction ? block.width + block.x + 0.1 : block.x - 0.1;
    if (_findCollision(xCheck, block.y, block, world))
        block.direction = !block.direction;
}

/**
 * Initialized Block Animations
 * @param {Block} block - Block to animate
 * @param {Object} animations - In state:frameCount format. Ex: {"default":2,"jump":6}
 * @param {number} [speed=0.15] - Animation speed
 * @private
 */
function _initAnim(block, animations, speed=0.15)
{
    block.useAnim = true;
    block.animations = animations;
    block.flip = false;
    block.state = "default";
    block.power = "";
    block.frame = 1;
    block.speed = speed;
}