var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var sprites = {};
var coinAnim = {};
var cameraX = 0;
var cameraY = 0;
var bgColor = "black";

/**
 * Draws a rectangle
 * @param {number} x
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color 
 */
function DrawRect(x, y, width, height, color)
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
function DrawLine(x1, y1, x2, y2, color)
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
function DrawText(text, x, y, font="8px PressStart2P", color="white")
{
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x*16 - cameraX, y*16 - cameraY);
}

/**
 * Draws an image
 * @param {Object} sprite
 * @param {number} x
 * @param {number} y
 * @param {number} [width=1]
 * @param {number} [height=1]
 */
function DrawSprite(sprite, x, y, width=1, height=1)
{
    try {
        if (width == 1 && height == 1)
            ctx.drawImage(sprite, x*16 - cameraX, y*16 - cameraY);
        else
        ctx.drawImage(sprite, x*16 - cameraX, y*16 - cameraY, width*16, height*16);
    }
    catch {
        try {
            ctx.drawImage(GetSprite("null"), x*16 - cameraX, y*16 - cameraY, width*16, height*16)
        }
        catch (e)
        {
            
        }
    }
}

/**
 * Gets the sprite of the given type
 * @param {string} type - Object type
 */
function GetSprite(type)
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
function DrawBlock(block, x=block.x, y=block.y, stretch=true)
{
    if (stretch)
    {
        if (block.useAnim)
            DrawSprite(GetSprite(block.type + GetAnim(block)), x - 1, y - 1, block.width, block.height);
        else
            DrawSprite(GetSprite(block.type), x - 1, y - 1, block.width, block.height);
    }
    else
    {
        if (block.useAnim)
            DrawSprite(GetSprite(block.type + GetAnim(block)), x - 1, y - 1);
        else
            DrawSprite(GetSprite(block.type), x - 1, y - 1);
    }
    
}

/**
 * Draws all the blocks in a world
 * @param {Object} world - World Data
 */
function DrawWorld(world)
{
    for (id in world)
    {
        if (world[id].repeat)
        {
            for(var x = 0; x < world[id].width; x++)
            {
                for(var y = 0; y < world[id].height; y++)
                {
                    DrawBlock(world[id], x + world[id].x, y + world[id].y, false);
                }
            }
        }
        else
        {
            DrawBlock(world[id]);
        }
    }
}

function DrawPlayers(players)
{
    for (var id in players)
    {
        DrawBlock(players[id]);
    }
}

/**
 * Draws the GUI at the top of the screen
 * @param {Object} player - The Player
 * @param {Object} worldProperties - The World Properties
 */
function DrawGUI(player, worldProperties)
{
    // Score
    DrawText(player.name, 10 + cameraX, 20, "8px PressStart2P", "white");
    DrawText(Pad(player.score, 6), 10 + cameraX, 30, "8px PressStart2P", "white");
    // Coins
    DrawText("x" + Pad(player.coins, 2), 100 + cameraX, 30, "8px PressStart2P", "white");
    //BounceAnimation(coinAnim);
    DrawSprite(coinAnim.sprite, 90 + cameraX, 21);
    // World
    DrawText("WORLD", 150 + cameraX, 20, "8px PressStart2P", "white");
    DrawText(worldProperties.displayName, 158 + cameraX, 30, "8px PressStart2P", "white");
    // Time
    DrawText("TIME", 220 + cameraX, 20, "8px PressStart2P", "white");
    DrawText(Pad(worldProperties.time, 3), 225 + cameraX, 30, "8px PressStart2P", "white");
}

/**
 * Converts an int to a string with 0s as padding
 * @param {number} num - Number to convert
 * @param {number} size - Length of the string
 * @returns {string} - Number represented as a string with 0s as a pad
 * @private
 */
function Pad(num, size) {
    var s = num + "";
    while (s.length < size)
        s = "0" + s;
    return s;
}

/**
 * Clears the current canvas with bgColor
 * @param {string} [backgroundColor=bgColor] - Background Color
 */
function ClearDraw(backgroundColor=bgColor)
{
    DrawRect(cameraX / 16, cameraY / 16, CELL_WIDTH, CELL_HEIGHT, backgroundColor);
}


/**
 * Smoothly pans the camera to x, y
 * @param {number} x - Camera X Position
 * @param {number} y - Camera Y Position
 */
function ScrollTo(x, y = 0)
{
    cameraX = (x - cameraX) * CAMERA_DAMPING + cameraX;
    cameraY = (y - cameraY) * CAMERA_DAMPING + cameraY;
    if (cameraX < 0)
        cameraX = 0;
}

/**
 * Enables Animations for a Block
 * @param {Object} block - Block to animate
 * @param {Object} animations - Block Animations
 * @param {number} speed - Speed of the Animation
 */
function InitAnim(block, animations, speed=0.15)
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
function GetAnim(block)
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