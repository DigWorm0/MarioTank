/**
 * Applys velocity and gravity to applicable blocks
 * @param {Object} block - Block to apply vectors to
 * @param {Object} world - World the block exists in
 */
function ApplyVectors(block, world)
{
    //if (block.gravity)
    //    block.yVel += GRAVITY;
    block.x += block.xVel;
    //CorrectMovement(block, world, "x");
    block.y += block.yVel;
    //CorrectMovement(block, world, "y");
    block.xVel *= 0.9;
    block.yVel *= 0.9;
}

/**
 * Applys vectors to all applicable blocks in a world
 * @param {Object} world - The world to apply vectors to
 */
function ApplyWorldVectors(world)
{
    for (id in world)
    {
        if (world[id].physics) {
            ApplyVectors(world[id], world);
            if (host)
            {
                BlockUpdate(world[id]);
            }
        }
    }
}

/**
 * 
 * @param {Object} block - Block to correct any invalid movements
 * @param {Object} world - World the block exists in
 * @param {string} axis - The axis of change
 */
function CorrectMovement(block, world, axis)
{
    for (var id in world)
    {
        if (id != block.id && BoxCollider(block.x, block.y, block.width, block.height, world[id].x, world[id].y, world[id].width, world[id].height))
        {
            if (block.collision(block, world[id]))
            {
                var d1 = (world[id].y) - (block.y + block.height);
                var d2 = -((block.y) - (world[id].y + world[id].height));
                var d = d1 > d2 ? d1 : d2;
                block[axis] += d;
                block[axis + "Vel"] = 0;
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
 */
function BoxCollider(x1, y1, w1, h1, x2, y2, w2, h2)
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
 */
function FindCollision(x, y, block, width = 0, height = 0)
{
    for (var key in world)
    {
        if (world[key].solid && key != block.id && BoxCollider(x, y, width, height, world[key].x, world[key].y, world[key].width, world[key].height))
        {
            return world[key];
        }
    }
    return null;
}