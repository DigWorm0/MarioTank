var isAnimating = false;
var animGravity = true;
var currentFrame = 0;
var frameFunc = () => {};
var endFunc = () => {};

var plrAnimations = {
    "downPipe":()=>{
        if (currentFrame <= 40)
        {
            player.y+=0.04;
        }
        return currentFrame >= 60;
    }
};

function startAnimation(animation, endFunc)
{
    this.endFunc = endFunc;
    this.frameFunc = plrAnimations[animation];
    isAnimating = true;
    currentFrame = 0;
    enableGravity = false;
    player.xVel = 0;
    player.yVel = 0;
}

function runAnimations()
{
    if (isAnimating)
    {
        currentFrame++;
        if (frameFunc())
        {
            stopAnimations();
        }
    }
}

function stopAnimations()
{
    enableGravity = true;
    isAnimating = false;
    currentFrame = 0;
    endFunc();
}
