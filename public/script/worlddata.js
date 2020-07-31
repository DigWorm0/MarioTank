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
        if ("animation" in options)
        {
            this.animator = new Animator(loadAnimSprites(type, options["animation"]), {})
        }
        else
        {
            this.sprite = loadSprite("/sprites/" + type + ".png")
        }

        // Defaults
        this.width = 1;
        this.height = 1;
        this.solid = true;
        this.noRepeat = false;
        this.breakable = true;
        this.frame = (obj) => {};

        for (var option in options)
        {
            this[option] = options[option];
        }
    }

    getSprite()
    {
        if ("sprite" in this)
        {
            return this.sprite;
        } else if ("animator" in this) {
            return this.animator.getSprite();
        }
    }
}

var WORLD_DATA = {
    /*
                                                    1-1
    */
    "1-1":[
        // Ground
        new WorldObject("block/brick_2", 1, 14, {
            "width":69,
            "height":2,
            "breakable": false
        }),
        new WorldObject("block/brick_2", 72, 14, {
            "width":15,
            "height":2,
            "breakable": false
        }),
        new WorldObject("block/brick_2", 90, 14, {
            "width":64,
            "height":2,
            "breakable": false
        }),
        new WorldObject("block/brick_2", 156, 14, {
            "width":64,
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
        }),
        new WorldObject("entity/goomba", 23, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 31.1, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 42, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            },
            
        }),
        new WorldObject("entity/goomba", 43.5, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("block/hill_2", 65, 12, {
            "solid":false
        }),
        new WorldObject("block/bush_1", 72, 13, {
            "solid":false
        }),
        new WorldObject("block/question_used_1", 65, 9, {
        }),
        new WorldObject("block/brick_1", 78, 10, {
        }),
        new WorldObject("block/question_1", 79, 10, {
        }),
        new WorldObject("block/brick_1", 80, 10, {
        }),
        new WorldObject("block/brick_1", 81, 6, {
            width:8
        }),
        new WorldObject("entity/goomba", 81, 5, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 83, 5, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            },
            
        }),
        new WorldObject("block/brick_1", 92, 6, {
            width:3
        }),
        new WorldObject("block/question_1", 95, 6, {
        }),
        new WorldObject("block/brick_1", 95, 10, {
        }),
        new WorldObject("block/bush_2", 90, 13, {
            "solid":false
        }),
        new WorldObject("block/hill_1", 97, 11, {
            "solid":false
        }),
        new WorldObject("block/brick_1", 101, 10, {
            "width":2
        }),
        new WorldObject("block/question_1", 107, 10, {
        }),
        new WorldObject("block/question_1", 110, 10, {
        }),
        new WorldObject("block/question_1", 113, 10, {
        }),
        new WorldObject("block/question_1", 110, 6, {
        }),
        new WorldObject("block/bush_3", 108, 13, {
            "solid":false  
        }),
        new WorldObject("block/hill_2", 113, 12, {
            "solid":false  
        }),
        new WorldObject("entity/goomba", 98, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 99.5, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 115, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 116.5, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("block/brick_1", 119, 10, {
        }),
        new WorldObject("block/brick_1", 122, 6, {
            "width":3
        }),
        new WorldObject("block/brick_1", 129, 6, {
        }),
        new WorldObject("block/question_1", 130, 6, {
            "width":2
        }),
        new WorldObject("block/brick_1", 132, 6, {
        }),
        new WorldObject("block/brick_1", 130, 10, {
            "width":2
        }),
        new WorldObject("block/bush_2", 138, 13, {
            "solid":false  
        }),
        new WorldObject("block/block_1", 135, 13, {
            "width":4
        }),
        new WorldObject("block/block_1", 136, 12, {
            "width":3
        }),
        new WorldObject("block/block_1", 137, 11, {
            "width":2
        }),
        new WorldObject("block/block_1", 138, 10, {
        }),
        new WorldObject("block/block_1", 141, 13, {
            "width":4
        }),
        new WorldObject("block/block_1", 141, 12, {
            "width":3
        }),
        new WorldObject("block/block_1", 141, 11, {
            "width":2
        }),
        new WorldObject("block/block_1", 141, 10, {
        }),
        new WorldObject("block/hill_1", 145, 11, {
            "solid":false  
        }),
        new WorldObject("block/block_1", 149, 13, {
            "width":5
        }),
        new WorldObject("block/block_1", 150, 12, {
            "width":4
        }),
        new WorldObject("block/block_1", 151, 11, {
            "width":3
        }),
        new WorldObject("block/block_1", 152, 10, {
            "width":2
        }),
        new WorldObject("block/bush_1", 158, 13, {
            "solid":false  
        }),
        new WorldObject("block/block_1", 156, 13, {
            "width":4
        }),
        new WorldObject("block/block_1", 156, 12, {
            "width":3
        }),
        new WorldObject("block/block_1", 156, 11, {
            "width":2
        }),
        new WorldObject("block/block_1", 156, 10, {
        }),
        new WorldObject("block/hill_2", 161, 12, {
            "solid":false
        }),
        new WorldObject("block/pipe_1", 164, 12, {
            "width":2,
            "height":2,
            "noRepeat":true
        }),
        new WorldObject("block/bush_1", 168, 13, {
            "solid":false
        }),
        new WorldObject("block/brick_1", 169, 10, {
            "width":2
        }),
        new WorldObject("block/brick_1", 172, 10, {
        }),
        new WorldObject("block/question_1", 171, 10, {
        }),
        new WorldObject("entity/goomba", 175, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("entity/goomba", 176.5, 13, {
            "animation": {
                "default":2
            },
            "frame": (obj) => {
                goombaAI(obj, "1-1");
            }
        }),
        new WorldObject("block/pipe_1", 180, 12, {
            "width":2,
            "height":2,
            "noRepeat":true
        }),
        new WorldObject("block/block_1", 182, 13, {
            "width":9
        }),
        new WorldObject("block/block_1", 183, 12, {
            "width":8
        }),
        new WorldObject("block/block_1", 184, 11, {
            "width":7
        }),
        new WorldObject("block/block_1", 185, 10, {
            "width":6
        }),
        new WorldObject("block/block_1", 186, 9, {
            "width":5
        }),
        new WorldObject("block/block_1", 187, 8, {
            "width":4
        }),
        new WorldObject("block/block_1", 188, 7, {
            "width":3
        }),
        new WorldObject("block/block_1", 189, 6, {
            "width":2
        }),
        new WorldObject("block/hill_1", 193, 11, {
            "solid":false
        }),
        new WorldObject("block/block_1", 199, 13, {
        }),
        new WorldObject("block/flag_pole_1", 199, 4, {
            "height":9,
            "solid":false
        }),
        new WorldObject("block/flag_top_1", 199, 3, {
            "solid":false
        })
    ]
}

/*
        Entity AI
*/

function goombaAI(entity, world)
{
    if (!("direction" in entity))
    {
        entity.direction = true;
        entity.speed = 0.03;
    }
    var collisions = 0;
    for (var i = 0; i < WORLD_DATA[world].length; i++) {
        const block = WORLD_DATA[world][i];
        if (block.solid && block != entity)
        {
            var collides = checkCollisions(entity.x, entity.y, entity.width, entity.height, block.x, block.y, block.width, block.height)
            if (collides)
            {
                collisions++;
            }
        }
    }
    if (collisions != 1)
        entity.direction = !entity.direction;
    if (entity.direction)
        entity.x += entity.speed;
    else
        entity.x -= entity.speed;
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
function loadAnimSprites(type, spriteCounts)
{
    var sprites = {};
    for (var sprite in spriteCounts)
    {
        sprites[sprite] = [];
        sprites[sprite + "_flip"] = [];
        for (var i = 0; i < spriteCounts[sprite]; i++)
        {
            sprites[sprite].push(loadSprite("/sprites/" + type + "/" + sprite + (i + 1) + ".png"));
            sprites[sprite + "_flip"].push(loadSprite("/sprites/" + type + "/" + sprite + (i + 1) + "_flip.png"));
        }
    }
    return sprites;
}
function checkCollisions(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}