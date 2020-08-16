/**
 * Applys controls, velocity, and gravity to player
 * @param {Object} player - Player to apply vectors to
 * @param {Object} world - World the block exists in
 */
function applyPlayerVectors(player, world)
{
    // Controls
    if (!(player))
        return;
    if (!(player.x) || !(player.y))
        return;
    UpdateControls();
    if (Controls.up && player.onground && !player.jumping)
    {
        player.jumped = true;
        player.jumping = true;
        player.onground = false;
        player.yVel -= JUMP_FORCE;

        setTimeout(function() {
            player.jumping = false;
        }, 100);
    }
    if (!Controls.up && player.jumping)
    {
        player.jumping = false;
    }
    if (player.jumping)
    {
        player.yVel -= CONTINUOUS_JUMP_FORCE
    }
    
    if (player.onground && Controls.sprint)
        player.xVel += Controls.horizontal * PLAYER_SPRINT_SPEED;
    else if (player.onground)
        player.xVel += Controls.horizontal * PLAYER_SPEED;
    else
        player.xVel += Controls.horizontal * PLAYER_AIR_SPEED;

    // Physics
    player.yVel += GRAVITY;
    player.x += player.xVel;
    _correctXMovement(player, world);
    player.y += player.yVel;
    _correctYMovement(player, world);
    player.xVel *= X_MOTION_DAMPING;
    player.yVel *= Y_MOTION_DAMPING;
    socket.emit('updatePlayer', player)
}

/**
 * Corrects movement in the Y axis
 * @param {Object} player - player to correct any invalid movements
 * @param {Object} world - World the player exists in
 * @private
 */
function _correctYMovement(player, world)
{
    for (var id in world.blocks)
    {
        if (_boxCollider(player.x, player.y, player.width, player.height, world.blocks[id].x, world.blocks[id].y, world.blocks[id].width, world.blocks[id].height))
        {
            if (player.collision(player, world.blocks[id]))
            {
                if ("onground" in player && player.yVel > 0)
                {
                    player.onground = true;
                    player.jumped = false;
                }

                var d1 = (world.blocks[id].y) - (player.y + player.height)-0.0001;
                var d2 = -((player.y) - (world.blocks[id].y + world.blocks[id].height))+0.0001;
                var d = Math.abs(d1) < Math.abs(d2) ? d1 : d2;
                player.y += d;
                player.yVel = 0;
            }
        }
    }
}

/**
 * Corrects movement in the X axis
 * @param {Object} player - player to correct any invalid movements
 * @param {Object} world - World the player exists in
 * @private
 */
function _correctXMovement(player, world)
{
    for (var id in world.blocks)
    {
        if (_boxCollider(player.x, player.y, player.width, player.height, world.blocks[id].x, world.blocks[id].y, world.blocks[id].width, world.blocks[id].height))
        {
            if (player.collision(player, world.blocks[id]))
            {
                var d1 = (world.blocks[id].x) - (player.x + player.width)-0.0001;
                var d2 = -((player.x) - (world.blocks[id].x + world.blocks[id].width))+0.0001;
                var d = Math.abs(d1) < Math.abs(d2) ? d1 : d2;
                player.x += d;
                player.xVel = 0;
            }
        }
    }
}

/**
 * Checks if there is a collision between (x1, y1, w1, h1) and (x2, y2, w2, h2)
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} w1 
 * @param {number} h1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} w2 
 * @param {number} h2 
 * @returns {boolean} - True if there is a collision, false otherwise
 */
function _boxCollider(x1, y1, w1, h1, x2, y2, w2, h2)
{
    return !(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
}

/**
 * Class representing a Player
 */
class Player {

    /**
     * Creates a Player
     * @param {string} id - Socket.io ID
     * @param {number} x - X Position
     * @param {number} y - Y Position
     * @param {string} [name=URLParameter] - Name of the Player
     * @param {Object} [properties={}] - Optional Properties
     */
    constructor(id, x, y)
    {   
        initAnim(this, {
            "default":1,
            "jump":1,
            "walk":3,
            "climb":1
        }, 0.2);
        
        this.type       = "entity/player-1";
        this.x          = null;
        this.y          = null;
        this.xVel       = 0;
        this.yVel       = 0;
        this.height     = 1;
        this.width      = 0.8;
        this.coins      = 0;
        this.score      = 0; // TODO Save game
        this.name       = (new URLSearchParams(window.location.search)).get('name');
        this.id         = id;
        this.onground   = false;
        this.jumping    = false;
        this.jumped     = false;
        this.hop        = false

        /**
        * Runs if there is a collision between player and collider
        * @param {Object} player - Current Player
        * @param {Object} collider - Block collided with
        * @returns - True if collision is valid, false otherwise
        */
       this.collision = function(player, collider)
       {
           // Coin
           if (collider.type.includes("coin/coin-") && collider.type != "coin/coin-anim-1")
           {
                player.coins++;
                socket.emit('deleteBlock', world.id, collider.id);
                return false;
           }
           // Question Block
           else if (collider.type.includes("question/block-") &&  player.x + player.width - 0.1 > collider.x && player.x + 0.1 < collider.x + collider.width && player.yVel < 0 && collider.state != "used")
           {
                collider.state = "used";
                socket.emit('updateBlock', world.id, collider.id, {"state":"used"})
                player.score += 200;
                // TODO Hop Block
                if (collider.prop == "powerup") {
                    if (player.power == "")
                    {
                        var prop = "power/shroom-1";
                        socket.emit('addBlock', world.id, prop, collider.x, collider.y-1, {"isSolid":false});
                    }
                    else
                    {
                        var prop = "power/fire-1";
                        socket.emit('addBlock', world.id, prop, collider.x, collider.y-1, {"isSolid":false});
                    }
                }
                else if (collider.prop != "")
                {
                    socket.emit('addBlock', world.id, collider.prop, collider.x, collider.y-1, {"isSolid":false});
                    player.coins += 1;
                }

                // Hop
                socket.emit('updateBlock', world.id, collider.id, {"hop":true})
                collider.hop = true;
                var c = collider.id;
                setTimeout(() => {
                    socket.emit('updateBlock', world.id, c, {"hop":false})
                    collider.hop = false;
                }, 100);
                return true;
           }
           // Bricks
           else if (collider.type.includes("brick/float-") && player.x + player.width - 0.1 > collider.x && player.x + 0.1 < collider.x + collider.width && player.yVel < 0 && !(collider.jumped)) {
                socket.emit('updateBlock', world.id, collider.id, {"hop":true})
                collider.hop = true;
                var c = collider.id;
                setTimeout(() => {
                    socket.emit('updateBlock', world.id, c, {"hop":false})
                    collider.hop = false;
                }, 100);
                return true;
           }
           // Goomba
           else if (collider.type == "entity/goomba-1")
           {
               if (player.yVel > 0.02) {
                   var b = collider;
                   setTimeout(() => {
                       socket.emit('removeBlock', world.id, b.id);
                   }, 200);
               
                   socket.emit('updateBlock', world.id, collider.id, {
                       "speed":0,
                       "state":"squash",
                       "isSolid":false,
                       "y":collider.y + 0.75,
                       "isPhysics":false,
                       "isGravity":false,
                       "repeat":false,
                       "height":(1/3)
                   });
   
                   player.score += 100;
   
                   if (Controls.up) {
                       player.yVel = -BOUNCE_FORCE * 2;
                       player.jumped = true
                   }
                   else
                       player.yVel = -BOUNCE_FORCE;
                   player.y += player.yVel;
               }
               else
               {
                   player.die();
               }
               return false;
           }
           // Shroom
           else if (collider.type == "power/shroom-1")
           {
               if (player.power == "") {
                   player.power = "tall";
                   player.y -= 1;
                   player.height = 2;
               }
               socket.emit('removeBlock', world.id, collider.id);
               return false;
           }
           // Fire Power
           else if (collider.type == "power/fire-1")
           {
               if (player.power == "") {
                   player.power = "fire";
                   player.y -= 1;
                   player.height = 2;
               }
               else if (player.power == "tall")
               {
                   player.power = "fire";
               }
               socket.emit('removeBlock', world.id, collider.id);
               return false;
           }
           return collider.isSolid;
       }

        /**
         * Runs when the Player Dies
         * @param {boolean} [force=false] - Player instantly dies regardless of power ups when true
         */
        this.die = function(force = false)
        {
            if (this.power != "" && !force)
            {
                this.power = "";
                this.height = 1;
                this.invinsible = true;
                setTimeout(() => {
                    this.invinsible = false;
                }, 5000)
                // TODO De-Power Up Animation
            }
            else if (!this.invinsible || force)
            {
                this.power = "";
                resetWorld()
            }
        }

        /**
         * Updates player each Frame
         * @param {Object} block
         */
        this.update = function(player)
        {
            player.state = (Math.abs(player.xVel * CELL_SIZE) > 0.2) ? "walk" : "default";
            player.state = player.jumped ? "jump" : player.state;
            player.flip = Math.abs(player.xVel) > 0.01 ? player.xVel < 0 : player.flip;
        }
    }
}