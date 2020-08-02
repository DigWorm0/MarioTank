/*
        Variables
*/
var WORLD_DATA = [];
var backgroundColor = "black";
var displayName = "";
var currentWorld = DEFAULT_WORLD;
var autoScroll = true;

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
function loadWorld(world)
{
    var start = new Date().getMilliseconds();
    currentWorld = world;
    WORLD_DATA = [];
    $.getJSON('/worldData/' + world + '.json', function(data) {
        data.blocks.forEach(element => {
            WORLD_DATA.push(new WorldObject(element.type, element.x, element.y, element.properties));
        });
        backgroundColor = data.backgroundColor;
        displayName = data.displayName;
        autoScroll = data.autoScroll;
        document.getElementById("backgroundColor").value = backgroundColor;
        document.getElementById("displayName").value = displayName;
        document.getElementById("autoScroll").checked = autoScroll;
        document.getElementById("worldTitle").innerText = currentWorld;
        WORLD_DATA.push(Player);
    }).fail(function(d) {
        document.getElementById("worldTitle").innerText = currentWorld;
        WORLD_DATA.push(Player);
    });
    console.log("Loaded " + world + " in " + (new Date().getMilliseconds() - start) + "ms");
}