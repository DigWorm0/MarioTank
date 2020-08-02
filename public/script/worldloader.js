/*
        Variables
*/
var WORLD_DATA = [];
var backgroundColor = "black";
var currentWorld = DEFAULT_WORLD;

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
        this.prop = "";
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
                this.animSprites[sprite].push(loadSprite("/sprites/" + this.type + "/" + sprite + "-" + (i + 1) + ".png"));
                if (loadFlip)
                    this.animSprites[sprite + "_flip"].push(loadSprite("/sprites/" + this.type + "/" + sprite + "-" + (i + 1) + "_flip.png"));
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
function loadWorld(world, spawn)
{
    var start = new Date().getMilliseconds();
    currentWorld = world;
    WORLD_DATA = [];
    $.getJSON('/worldData/' + world + '.json', function(data) {
        data.blocks.forEach(element => {
            if (element.type == spawn)
            {
                Player.x = element.x;
                Player.y = element.y;
            }
            WORLD_DATA.push(new WorldObject(element.type, element.x, element.y, element.properties));
        });
        backgroundColor = data.backgroundColor;
        WORLD_DATA.push(Player);
    });
    console.log("Loaded " + world + " in " + (new Date().getMilliseconds() - start) + "ms");
}
function deleteFromWorld(block)
{
    for(var i = 0; i < WORLD_DATA.length; i++)
    {
        if (WORLD_DATA[i] == block)
        {
            WORLD_DATA.splice(i, 1);
        }
    }
}