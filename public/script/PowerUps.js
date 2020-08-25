class PowerUp
{
    constructor(type, width, height, xOffset, yOffset, fire, props={})
    {
        this.type       = type;
        this.width      = width;
        this.height     = height;
        this.fire       = fire;
        this.props      = props;
        this.speed      = DEFAULT_SPEED;
        this.xOffset    = xOffset;
        this.yOffset    = yOffset;
        
        for (var property in props) {
            this[property] = props[property];
        }
    }
}

var powerups = {
    "shroom":new PowerUp("shroom", 0.9, 2, 0, 0, () => {}),
    "fire":new PowerUp("fire", 0.9, 2, 0, 0, () => {}),
    "tank":new PowerUp("tank", 3.3125, 1.7, -0.25, -0.3125, () => {
        var offset = player.flip ? 0 : player.width;
        socket.emit("addBlock", world.id, "tank/bullet-1", player.x + offset, player.y + player.height * 0.08, {
            "isSolid":false,
            "width":0.25,
            "height":0.25,
            "isRepeat":false,
            "direction":player.flip
        })
    }, { "speed":0.005 }),
    "sanic":new PowerUp("sanic", 1.9, 1.9, 0, 0, () => {}, { "speed":0.02 }),
    "thomas":new PowerUp("thomas", 1.5, 0.9, -0.2, -0.1, () => {}, { "speed":0.015 })
};

function plrPowerup(power)
{
    player.power     = power.type;
    player.y        += player.height-power.height;
    player.height    = power.height;
    player.width     = power.width;
    player.moveSpeed = power.speed;
    player.xOffset   = power.xOffset;
    player.yOffset   = power.yOffset;
}