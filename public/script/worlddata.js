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
        this.sprite = loadSprite("/sprites/" + type + ".png")

        // Defaults
        this.width = 1;
        this.height = 1;
        this.solid = true;
        this.noRepeat = false;
        this.breakable = true;
        this.frame = () => {};

        for (var option in options)
        {
            this[option] = options[option];
        }
    }
}

/*
        Data
*/
var WORLD_DATA = {
    "1-1":[
        new WorldObject("block/brick_2", 1, 14, {
            "width":69,
            "height":2,
            "breakable": false
        }),
        new WorldObject("block/hill_1", 1, 11, {
            "solid":false
        }),
        new WorldObject("block/bush_3", 12, 13, {
            "solid":false  
        }),
        new WorldObject("block/hill_2", 17, 12, {
            "solid":false
        }),
        new WorldObject("block/question_1", 17, 10, {
        }),
        new WorldObject("block/brick_1", 21, 10, {
        }),
        new WorldObject("block/question_1", 22, 10, {
        }),
        new WorldObject("block/brick_1", 23, 10, {
        }),
        new WorldObject("block/question_1", 24, 10, {
        }),
        new WorldObject("block/brick_1", 25, 10, {
        }),
        new WorldObject("block/question_1", 23, 6, {
        }),
        new WorldObject("block/bush_1", 24, 13, {
            "solid":false
        }),
        new WorldObject("block/pipe_1", 29, 12, {
            "width":2,
            "height":2,
            "noRepeat":true
        }),
        new WorldObject("block/pipe_1", 39, 11, {
            "width":2,
            "height":3,
            "noRepeat":true
        }),
        new WorldObject("block/pipe_stem_1", 39, 13, {
            "solid":false
        }),
        new WorldObject("block/bush_2", 42, 13, {
            "solid":false
        }),
        new WorldObject("block/pipe_1", 47, 10, {
            "width":2,
            "height":3,
            "noRepeat":true
        }),
        new WorldObject("block/pipe_stem_1", 47, 12, {
            "solid":false,
            "height":2
        }),
        new WorldObject("block/hill_1", 49, 11, {
            "solid":false
        }),
        new WorldObject("block/pipe_1", 58, 10, {
            "width":2,
            "height":3,
            "noRepeat":true
        }),
        new WorldObject("block/pipe_stem_1", 58, 12, {
            "solid":false,
            "height":2
        }),
        new WorldObject("block/bush_3", 60, 13, {
            "solid":false
        })
    ]
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
function loadEntitySprites(title, spriteCounts)
{
    var sprites = {};
    for (var sprite in spriteCounts)
    {
        sprites[sprite] = [];
        sprites[sprite + "_flip"] = [];
        for (var i = 0; i < spriteCounts[sprite]; i++)
        {
            sprites[sprite].push(loadSprite("/sprites/entity/" + title + "/" + sprite + (i + 1) + ".png"));
            sprites[sprite + "_flip"].push(loadSprite("/sprites/entity/" + title + "/" + sprite + (i + 1) + "_flip.png"));
        }
        
    }
    return sprites;
}