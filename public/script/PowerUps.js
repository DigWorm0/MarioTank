var powerups = {
    "tall":new PowerUp("tall", 0.8, 2, () => {}, () => {})
};

class PowerUp
{
    constructor(type, width, height, powerup, fire, props={})
    {
        this.type       = type;
        this.width      = width;
        this.height     = height;
        this.powerup    = powerup;
        this.fire       = fire;
        this.props      = props;
        
        for (var property in prop) {
            this[property] = properties[property];
        }
    }
}