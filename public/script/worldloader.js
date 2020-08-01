/*
        Variables
*/
var WORLD_DATA = [];

/*
        Class
*/
class WorldObject
{
    constructor(type, x, y, options)
    {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 1;
        this.height = 1;
        this.solid = true;
        this.noRepeat = false;
        this.breakable = true;
        this.sprite = loadSprite("/sprites/" + type + ".png")
        this.frame = (obj) => {};

        for (var option in options)
        {
            this[option] = options[option];
        }
    }

    loadAnimations(animations, loadFlip)
    {
        this.animSprites = {};
        for (var sprite in animations)
        {
            this.animSprites[sprite] = [];
            if (loadFlip)
                this.animSprites[sprite + "_flip"] = [];
            for (var i = 0; i < animations[sprite]; i++)
            {
                this.animSprites[sprite].push(loadSprite("/sprites/" + this.type + "/" + sprite + (i + 1) + ".png"));
                if (loadFlip)
                    this.animSprites[sprite + "_flip"].push(loadSprite("/sprites/" + this.type + "/" + sprite + (i + 1) + "_flip.png"));
            }
        }
    }
}

/*
        Utility Functions
*/

function loadSprite(url)
{
    var sprite = new Image();
    sprite.src = url;
    return sprite;
}
function loadWorld(world)
{
    var start = new Date().getMilliseconds();
    $.getJSON('/worldData/' + world + '.json', function(data) {
        data.forEach(element => {
            WORLD_DATA.push(new WorldObject(element.type, element.x, element.y, element.properties));
        });
        WORLD_DATA.push(Player);
    });
    console.log("Loaded " + world + " in " + (new Date().getMilliseconds() - start) + "ms");
}