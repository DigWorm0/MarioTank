var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var sprites = {};
var coinAnim = {};
var cameraX = 0;
var cameraY = 0;
var bgColor = "black";

initAnim(coinAnim, {
    "default":8
}, 0.15);

/**
 * Draws a rectangle
 * @param {number} x
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color 
 */
function drawRect(x, y, width, height, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x*16 - cameraX, y*16 - cameraY, width*16, height*16)
}

/**
 * Draws a line from (x1, y1) to (x2, y2)
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {string} color 
 */
function drawLine(x1, y1, x2, y2, color)
{
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1*16 - cameraX, y1*16 - cameraY);
    ctx.lineTo(x2*16 - cameraX, y2*16 - cameraY);
    ctx.stroke();
}

/**
 * Draws Text at a Position
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {string} [font="8px PressStart2P"]
 * @param {string} [color="white"]
 */
function drawText(text, x, y, font="8px PressStart2P", color="white")
{
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x - cameraX, y - cameraY);
}

/**
 * Draws an image
 * @param {Object} sprite
 * @param {number} x
 * @param {number} y
 * @param {number} [width=1]
 * @param {number} [height=1]
 */
function drawSprite(sprite, x, y, width=1, height=1)
{
    try {
        if (width == 1 && height == 1)
            ctx.drawImage(sprite, x*16 - cameraX, y*16 - cameraY);
        else
            ctx.drawImage(sprite, x*16 - cameraX, y*16 - cameraY, width*16, height*16);
    }
    catch {}
}

/**
 * Gets the sprite of the given type
 * @param {string} type - Object type
 */
function getSprite(type)
{
    if (!(sprites[type]))
    {
        var sprite = new Image();
        sprite.src = "/sprites/" + type + ".png";
        sprites[type] = sprite;
    }
    return sprites[type];
}

/**
 * Draws a Block at (x,y)
 * @param {Object} block - Block to draw
 * @param {number} [x=block.x] - X position
 * @param {number} [y=block.y] - Y position
 * @param {boolean} [stretch=true] - Stretches the sprite across the width and height
 */
function drawBlock(block, x=block.x, y=block.y, stretch=true)
{
    var trueY = block.hop ? y - (1/8) : y;
    if (stretch)
    {
        if (block.useAnim)
            drawSprite(getSprite(block.type + getAnim(block)), x - 1, trueY - 1, block.width, block.height);
        else
            drawSprite(getSprite(block.type), x - 1, trueY - 1, block.width, block.height);
    }
    else
    {
        if (block.useAnim)
            drawSprite(getSprite(block.type + getAnim(block)), x - 1, trueY - 1);
        else
            drawSprite(getSprite(block.type), x - 1, trueY - 1);
    }
}

/**
 * Draws all the blocks in a world
 * @param {Object} world - World Data
 */
function drawWorld(world)
{
    for (id in world.blocks)
    {
        if (world.blocks[id].repeat)
        {
            for(var x = 0; x < world.blocks[id].width; x++)
            {
                for(var y = 0; y < world.blocks[id].height; y++)
                {
                    drawBlock(world.blocks[id], x + world.blocks[id].x, y + world.blocks[id].y, false);
                }
            }
        }
        else
        {
            drawBlock(world.blocks[id]);
        }
    }
}

/**
 * Draws all the players
 * @param {Object[]} players - Players to draw
 */
function drawPlayers(players)
{
    for (var id in players)
    {
        ctx.textAlign = 'center';
        if (id == player.id)
        {
            drawBlock(player, Math.round(player.x*16)/16, player.y, false);
            drawText(player.name, ((Math.round(player.x*16)/16) - 0.5)*16, (player.y - 1.2)*16)
        }
        else
        {
            drawBlock(players[id], Math.round(players[id].x*16)/16, players[id].y, false);
            drawText(players[id].name, ((Math.round(players[id].x*16)/16) - 0.5)*16, (players[id].y - 1.2)*16)
        }
    }
}

/**
 * Draws the GUI at the top of the screen
 * @param {Object} player - The Player
 * @param {Object} worldProperties - The World Properties
 */
function drawGUI(player, world)
{
    ctx.textAlign = 'left';
    // Score
    drawText(player.name, 10 + cameraX, 20, "8px PressStart2P", "white");
    drawText(pad(player.score, 6), 10 + cameraX, 30, "8px PressStart2P", "white");
    // Coins
    drawText("x" + pad(player.coins, 2), 100 + cameraX, 30, "8px PressStart2P", "white");
    drawSprite(getSprite("gui/coin-1" + getAnim(coinAnim)), (90/16) + (cameraX/16), 21/16);
    // World
    drawText("WORLD", 150 + cameraX, 20, "8px PressStart2P", "white");
    drawText(world.displayName, 158 + cameraX, 30, "8px PressStart2P", "white");
    // Time
    drawText("TIME", 220 + cameraX, 20, "8px PressStart2P", "white");
    drawText(pad(world.time, 3), 225 + cameraX, 30, "8px PressStart2P", "white");
}

/**
 * Converts an int to a string with 0s as padding
 * @param {number} num - Number to convert
 * @param {number} size - Length of the string
 * @returns {string} - Number represented as a string with 0s as a pad
 * @private
 */
function pad(num, size) {
    var s = num + "";
    while (s.length < size)
        s = "0" + s;
    return s;
}

/**
 * Clears the current canvas with bgColor
 * @param {string} [backgroundColor=bgColor] - Background Color
 */
function clearDraw(backgroundColor=bgColor)
{
    drawRect(cameraX / 16, cameraY / 16, CELL_WIDTH, CELL_HEIGHT, backgroundColor);
}


/**
 * Smoothly pans the camera to x, y
 * @param {number} x - Camera X Position
 * @param {number} y - Camera Y Position
 */
function scrollTo(x, y = 0)
{
    cameraX = Math.round((x - cameraX) * CAMERA_DAMPING + cameraX);
    cameraY = Math.round((y - cameraY) * CAMERA_DAMPING + cameraY);
    if (cameraX < 0)
        cameraX = 0;
}

/**
 * Enables Animations for a Block
 * @param {Object} block - Block to animate
 * @param {Object} animations - Block Animations
 * @param {number} speed - Speed of the Animation
 */
function initAnim(block, animations, speed=0.15)
{
    block.useAnim = true;
    block.animations = animations;
    block.flip = false;
    block.state = "default";
    block.power = "";
    block.frame = 1;
    block.speed = speed;
}

/**
 * Gets the directory of the current animation frame
 * @param {Object} block - Block to animate
 */
function getAnim(block)
{
    if (!(block.state in block.animations))
        return "";
    block.frame += block.speed;
    if (Math.floor(block.frame) > block.animations[block.state])
        block.frame = 1;

    var str = "/";
    if (block.power)
        str += block.power + "_";
    str += block.state + "-" + Math.floor(block.frame);
    if (block.flip)
        str += "_flip";
    return str;
}