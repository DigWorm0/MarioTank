/*
        Variables
*/
// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

// Timing
var last = getTimestamp(); // Time since Last Frame
var dt = 0;

// FPS
var lastLoop = new Date();
var fps = 0;

// Colors
var backgroundColor = DEFAULT_BACKGROUND_COLOR;

// Camera
var cameraX = 0;
var cameraY = 0;

/*
        Loop Timing
*/
function frame()
{
    // FPS Counter
    var thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    
    // TIming
    var now = getTimestamp();
    
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > STEP) {
        dt = dt - STEP;
        update();
    }
    clearDraw();
    render();
    last = now;

    requestAnimationFrame(frame);
}
function getTimestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/*
        Basic Drawing
*/
function drawRect(x, y, width, height, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x - cameraX, y - cameraY, width, height)
}
function drawLine(x1, y1, x2, y2, color)
{
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1 - cameraX, y1 - cameraY);
    ctx.lineTo(x2 - cameraX, y2 - cameraY);
    ctx.stroke();
}

function drawText(text, x, y, size, color)
{
    ctx.fillStyle = color;
    ctx.font = size + "px Arial";
    ctx.fillText(text, x - cameraX, y - cameraY);
}

function drawSprite(sprite, x, y)
{
    ctx.drawImage(sprite, x - cameraX, y - cameraY)
}

function drawSpriteBySize(sprite, x, y, width, height)
{
    ctx.drawImage(sprite, x - cameraX, y - cameraY, width, height)
}

function clearDraw()
{
    drawRect(cameraX, cameraY, canvas.width + cameraX, canvas.height + cameraY, backgroundColor);
}

/*
        Block Drawing
*/
function drawBlock(block, x, y)
{
    drawSprite(block.getSprite(), (x*CELL_SIZE) - CELL_SIZE, (y*CELL_SIZE) - CELL_SIZE, CELL_SIZE,CELL_SIZE)
}

function drawBlocks(block)
{
    for (var xPos = 0; xPos < block.width; xPos++)
    {
        for (var yPos = 0; yPos < block.height; yPos++)
        {
            drawBlock(block, block.x + xPos, block.y + yPos)
        }
    }
}

function drawWorld(world, worldTitle)
{
    world[worldTitle].forEach(block => {
        if (block.noRepeat)
            drawBlock(block, block.x, block.y);
        else
            drawBlocks(block);
    });
}

/*
        Entity
*/
function autoscroll(x, range) // Range is from (Least Strict) 0 - 8 (Most Strict)
{
    if (x - cameraX > CELL_SIZE * (CELL_WIDTH - range))
    {
        var targetX = x - CELL_SIZE * (CELL_WIDTH - range);
        cameraX = (targetX - cameraX) * CAMERA_DAMPING + cameraX;
    }
    if (x - cameraX < CELL_SIZE * range)
    {
        var targetX = x - CELL_SIZE * range;
        cameraX = (targetX - cameraX) * CAMERA_DAMPING + cameraX;

        if (cameraX < 0)
            cameraX = 0;
    }
}

/*
        Entity Animation Manager
*/
class Animator
{
    constructor(sprites, options)
    {
        this.sprites = sprites;
        this.animMirror = false;
        this.animState = "default";
        this.animFrame = 0;
        this.animSpeed = 300;

        for (var option in options)
        {
            this[option] = options[option];
        }

        this.animInterval = setInterval(() => {
            this.animFrame++;
            var realAnimState = this.animMirror ? this.animState + "_flip" : this.animState;
            if (this.animFrame >= this.sprites[realAnimState].length)
                this.animFrame = 0;
        }, this.animSpeed);
    }

    getSprite()
    {
        var realAnimState = this.animMirror ? this.animState + "_flip" : this.animState;
        if (this.animFrame >= this.sprites[realAnimState].length)
            this.animFrame = 0;
        return this.sprites[realAnimState][this.animFrame];
    }
}

/*
        Initialization
*/
function beginDraw() {
    // Defaults
    ctx.imageSmoothingEnabled = false;

    // Loop
    requestAnimationFrame(frame);
}