class PowerUp
{
    constructor(type, width, height, fire, props={})
    {
        this.type       = type;
        this.width      = width;
        this.height     = height;
        this.fire       = fire;
        this.props      = props;
        
        for (var property in props) {
            this[property] = properties[property];
        }
    }
}

var powerups = {
    "shroom":new PowerUp("shroom", 0.8, 2, () => {}),
    "fire":new PowerUp("fire", 0.8, 2, () => {}),
    "tank":new PowerUp("tank", 4, 2, () => {
        var offset = player.flip ? 0 : player.width;
        socket.emit("addBlock", world.id, "tank/bullet-1", player.x + offset, player.y + player.height * 0.21875, {
            "isSolid":false,
            "width":0.25,
            "height":0.25,
            "isRepeat":false,
            "direction":player.flip
        })
    })
};