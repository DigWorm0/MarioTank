var worldData = {};
var worldProperties = {};

/**
 * Adds a block to the World Data
 * @param {Block} block - The block to add
 */
function AddBlock(block)
{
    //worldData[block.id] = block;
    broadcast("addBlock", block)
}

/**
 * Deletes a block from the World Data
 * @param {Block} block - The block to delete
 */
function DeleteBlock(block)
{
    //delete worldData[block.id]
    broadcast("deleteBlock", block)
}

/**
 * Marks block as changed
 * @param {Block} block - The block to change
 */
function ChangeBlock(block)
{
    broadcast("updateBlock", block)
}

/**
 * Loads a world by id
 * @param {string} id - The id of the world
 */
function LoadWorld(id)
{
    var start = new Date().getMilliseconds();
    worldData = {};
    worldProperties.world = id;

    $.getJSON('/worldData/' + id + '.json', function(data) {
        data.blocks.forEach(block => {
            var block = new Block(block.type, block.x, block.y, block.properties);
            worldData[block.id] = block;
        });
        document.getElementById("backgroundColor").value = data.bgColor;
        document.getElementById("displayName").value = data.displayName;
        document.getElementById("autoScroll").checked = data.autoScroll;
        document.getElementById("worldTitle").innerText = id;
        worldProperties.bgColor = data.bgColor;
        worldProperties.displayName = data.displayName;
        worldProperties.autoScroll = data.autoScroll;
        cameraX = 0;
    }).fail(function(d) {
        document.getElementById("worldTitle").innerText = id;
    });

    if (DEBUG)
        console.log("Loaded world in " + (new Date().getMilliseconds() - start) + "ms");
}

/**
 * Generates a UUID for a block
 * @returns {string} - UUID
 */
function CreateUUID()
{
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/**
 * Pipes the player to the specified world
 * @param {string} world - World to travel to
 */
function Pipe(world)
{
    // TODO Multiplayer Pipe Transfer
    broadcast("pipe", world)
}

/**
 * Class representing a block or object in the world
 */
class Block
{
    /**
     * Creates a Block
     * @param {string} type - Type of block
     * @param {number} x - X position of the block
     * @param {number} y - Y position of the block
     * @param {Object} [properties={}] - Optional properties of the block 
     */
    constructor(type, x, y, properties = {})
    {
        this.type = type;
        this.x = x;
        this.y = y;

        // Defaults
        this.id = CreateUUID();
        this.width = 1;
        this.height = 1;
        this.solid = true;
        this.repeat = false;
        this.breakable = false;
        this.prop = "";
        this.gravity = false;
        this.physics = false;
        this.xVel = 0;
        this.yVel = 0;
        this.flip = false;

        /**
         * Initializes the Block
         * @param {Object} block
         */
        this.init = (block) => {};
        if (this.type in BlockInit)
            this.init = BlockInit[this.type];

        /**
         * Updates block each Frame
         * @param {Object} block
         */
        this.update = (block) => {};
        if (this.type in BlockUpdate)
            this.update = BlockUpdate[this.type];

        /**
         * Runs if there is a collision between block and collider
         * @param {Object} block - Current Block
         * @param {Object} collider - Block collided with
         * @returns - True if collision is valid, false otherwise
         */
        this.collision = (block, collider) => { return true; };

        // Properties
        for (var property in properties)
        {
            this[property] = properties[property];
        }

        // Init
        this.init(this);
    }
}