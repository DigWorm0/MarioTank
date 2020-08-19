var socket = io();
var players = {};
var player;
var world;

/**
 * Runs on socket connection
 */
socket.on('connect', () => {
    player = new Player(socket.id, 1, 1);
    if (blackDisplay) {
        socket.emit('getWorld', world.id);
        resetWorld();
    }

    /**
     * Adds a block into the world
     * @param {Block} block - Block to add
     */
    socket.on('addBlock', function(worldID, block) {
        if (worldID == world.id)
        {
            world.blocks[block.id] = block;
        }
    });

    /**
     * Updates a block
     * @param {string} worldID - World ID of the block
     * @param {string} block - Block ID
     * @param {Object} changes - Changes to the block (Ex: {"isPhysics":true, "x":3})
     */
    socket.on('updateBlock', (worldID, block, changes) => {
        if (world)
        {
            if (world.id == worldID && block in world.blocks)
            {
                for (var key in changes) {
                    world.blocks[block][key] = changes[key];
                }
            }
        }
    });

    /**
     * Removes a block
     * @param {string} worldID - World ID of the block
     * @param {string} block - Block ID
     */
    socket.on('removeBlock', (worldID, block) => {
        if (world.id == worldID)
        {
            delete world.blocks[block];
        }
    });
    
    /**
     * Returns a World
     * @param {World} world - World to load
     */
    socket.on('returnWorld', function(worldData) {
        if (world)
        {
            for (var key in worldData.blocks)
            {
                var block = worldData.blocks[key];
                if (block.type == "spawn/" + world.id)
                {
                    player.x = block.x;
                    player.y = block.y - player.height;
                    console.log("spawn/" + world.id)
                }
            }
        }
        world = worldData;
        player.world = world.id;
        cameraX = 0;
        if (!blackDisplay)
            bgColor = world.bgColor;
        if (waitForWorld) {
            waitForWorld = false;
            start();
        }
        console.log("Loaded world " + worldData.id)
    });

    /**
     * Returns a World
     * @param {World} world - World to load
     */
    socket.on('resetWorld', function(worldData) {
        if (worldData.id == world.id)
        {
            world = worldData;
            if (!blackDisplay)
                bgColor = world.bgColor;
            resetWorld();
            console.log("Reset world " + worldData.id)
        }
    });
    
    /**
     * Updates the data from a player
     * @param {Player} plr - Player to update
     */
    socket.on('updatePlayer', function(plr) {
        players[plr.id] = plr;
    });

    /**
     * Disconnects a player
     * @param {number} id - ID of the player to disconnect
     */
    socket.on('disconnectPlayer', function(id) {
        delete players[id];
    });

    socket.on('disconnect', function() {
        stallMsg("Disconnected...");
        players = {};
    });
});