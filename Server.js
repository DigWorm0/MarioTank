var worlds = {};

const request = require("request")
const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, {});
const phys = require('./WorldPhysics');
var port = process.env.PORT || 3000;

//var last = GetTimestamp();
//var dt = 0;

/* #region  Objects */
/**
 * Class representing a world
 */
class World {
    /**
     * Creates a world
     */
    constructor(id) {
        this.blocks = {};
        this.bgColor = "black";
        this.displayName = "";
        this.autoScroll = true;
        this.id = id;
    }

    /**
     * Downloads a world from json
     * @param {string} ID - World ID
     * @returns {Promise}
     */
    download() {
        var world = this;
        const promise = new Promise(function (resolve, reject) {
            var url = "http://localhost:8080/worldData/" + world.id + ".json"; // https://supermario.wtf/worldData/
            request({
                url: url,
                json: true
            }, function (error, response, data) {
                if (!error && response.statusCode === 200) {
                    data.blocks.forEach(block => {
                        var blockId = createID();
                        world.blocks[blockId] = new Block(block.type, block.x, block.y, world.id, block.properties);
                        world.blocks[blockId].id = blockId;
                    });

                    world.bgColor = data.bgColor;
                    world.displayName = data.displayName;
                    world.autoScroll = data.autoScroll;
                }
                resolve();
            });
        });
        return promise;
    }
}

/**
 * Class representing a block or object in the world
 */
class Block {
    /**
     * Creates a Block
     * @param {string} type - Type of block
     * @param {number} x - X position of the block
     * @param {number} y - Y position of the block
     * @param {Object} [properties={}] - Optional properties of the block 
     */
    constructor(type, x, y, world, properties = {}) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.world = world;

        // Defaults
        this.id = createID();
        this.prop = "";
        this.width = 1;
        this.height = 1;
        this.xVel = 0;
        this.yVel = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.isSolid = true;
        this.isRepeat = false;
        this.isGravity = false;
        this.isPhysics = false;

        /**
         * Initializes the Block
         * @param {Block} block
         */
        if (this.type in phys.blockInits) {
            this.init = phys.blockInits[this.type];
        }

        /**
         * Updates block each Frame
         * @param {Block} block
         */
        if (this.type in phys.blockUpdates) {
            this.update = phys.blockUpdates[this.type];
        }

        /**
         * Runs if there is a collision between block and collider
         * @param {Block} block - Current Block
         * @param {Block} collider - Block collided with
         * @returns - True if collision is valid, false otherwise
         */
        this.collision = (block, collider) => {
            return collider.isSolid;
        };

        // Properties
        for (var property in properties) {
            this[property] = properties[property];
        }

        // Init
        if ("init" in this)
            this.init(this);
    }
}
/* #endregion */

/* #region  Socket Communications */
/**
 * Runs on Socket Connection
 */
io.on('connection', socket => {
    /**
     * Gets the current world
     * @param {string} worldID - ID of the world to grab
     */
    socket.on('getWorld', (worldID) => {
        if (typeof worldID != 'string')
            return;
        if (worldID in worlds) {
            socket.emit("returnWorld", worlds[worldID])
        }
        else {
            worlds[worldID] = new World(worldID);
            worlds[worldID].download().then(function () {
                socket.emit("returnWorld", worlds[worldID])
            }, function () {
                socket.emit("returnWorld", worlds[worldID])
            });
        }
    });

    /**
     * Resets the current world
     * @param {string} worldID - ID of the world to reset
     */
    socket.on('resetWorld', (worldID) => {
        if (typeof worldID != 'string')
            return;
        if (!(worldID in worlds))
            return;
        delete worlds[worldID];
        worlds[worldID] = new World(worldID);
        worlds[worldID].download().then(function () {
            io.emit("resetWorld", worlds[worldID])
        }, function () {
            io.emit("resetWorld", worlds[worldID])
        });
    });

    /**
     * Adds a block into the world
     * @param {string} world - World ID of Block
     * @param {string} type - Type of block
     * @param {number} x - X Position of Block
     * @param {number} y - Y Position of Block
     * @param {Object} properties - Properties of Block (Ex: {"isPhysics":true, "x":3})
     */
    socket.on('addBlock', (world, type, x, y, properties) => {
        if (typeof world != 'string' || typeof type != 'string' || typeof x != 'number' || typeof y != 'number' || typeof properties != 'object')
            return;
        if (!(world in worlds))
            return;
        var blockId = createID();
        worlds[world].blocks[blockId] = new Block(type, x, y, world, properties);
        worlds[world].blocks[blockId].id = blockId;
        io.emit('addBlock', world, worlds[world].blocks[blockId])
    });

    /**
     * Updates a block
     * @param {string} world - World ID of the block
     * @param {string} block - Block ID
     * @param {Object} changes - Changes to the block (Ex: {"isPhysics":true, "x":3})
     */
    socket.on('updateBlock', (world, block, changes) => {
        if (typeof world != 'string' || typeof block != 'string' || typeof changes != 'object')
            return;
        for (var key in changes) {
            worlds[world].blocks[block][key] = changes[key];
        }
        io.emit('updateBlock', world, block, changes)
    });

    /**
     * Removes a block
     * @param {string} world - World ID of the block
     * @param {string} block - Block ID
     */
    socket.on('removeBlock', (world, block) => {
        if (typeof world != 'string' || typeof block != 'string')
            return;
        delete worlds[world].blocks[block];
        io.emit('removeBlock', world, block);
    });

    /**
     * Provides regular updates to player state and position
     * @param {Player} plr - Player to update
     */
    socket.on('updatePlayer', (plr) => {
        if (typeof plr != 'object')
            return;
        io.emit('updatePlayer', plr);
    });

    /**
     * Disconnects active player
     */
    socket.on('disconnect', () => {
        io.emit('disconnectPlayer', socket.id);
    });
});
/* #endregion */

/* #region  Utility Functions */
/**
 * Generates a unique id
 * @param {number} length - length of the id to generate
 * @returns {string} Unique ID
 */
function createID(length = 10) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Manages the loop speed
 * @private
 */
function _loopMgr()
{
    /*
    var now = GetTimestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > STEP) {
        dt = dt - STEP;
        loop();
    }
    last = now;
    _loopMgr();
    */
   setInterval(loop, 40);
}

/**
 * Main game loop run 25 times per second (40ms apart)
 */
function loop() {
    for (var key in worlds)
    {
        var world = worlds[key];
        phys.updateWorld(key, world);
    }
}

/**
 * Checks if variable exists
 */
function varExists(v)
{
    return typeof v !== 'undefined' || v === null;
}
/* #endregion */

/* #region  Http Server */
phys.load(io, worlds);

app.get('/', (req, res) => {
    if (req.query.name) {
        if (req.query.name.length <= 12)
            res.sendFile(__dirname + '/public/index.html');
        else
            res.sendFile(__dirname + '/public/start.html');
    }
    else
        res.sendFile(__dirname + '/public/start.html');
})
app.use(express.static('public'));

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
//_loopMgr();
/* #endregion */