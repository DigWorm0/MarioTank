var players = {};
var player;

/**
 * Class representing a Player
 */
class Player extends Block {

    /**
     * Creates a Player
     * @param {string} id - Socket.io ID
     * @param {number} x - X Position
     * @param {number} y - Y Position
     * @param {string} [name=URLParameter] - Name of the Player
     * @param {Object} [properties={}] - Optional Properties
     */
    constructor(id, x, y, name=(new URLSearchParams(window.location.search)).get('name'), properties={})
    {   
        super("entity/player-1", x, y, {});
        
        InitAnim(this, {
            "default":1,
            "jump":1,
            "walk":3,
            "climb":1
        }, 0.2);

        this.width = 0.8;
        this.name = name;
        this.id = id;
        this.onground = false;
        this.jumping = false;
        this.coins = 0;
        this.score = 0; // TODO Save game

        // Properties
        for (var property in properties)
        {
            this[property] = properties[property];
        }
    }

    /**
     * Runs if there is a collision between block and collider
     * @param {Object} player - Current Block
     * @param {Object} collider - Block collided with
     * @returns - True if collision is valid, false otherwise
     */
    collision(player, collider)
    {
        // Coin
        if (collider.type.includes("coin/coin-") && collider.type != "coin/coin-anim-1")
        {
            player.coins++;
            DeleteBlock(collider);
            return false;
        }
        // Question Block
        else if (collider.type.includes("question/block-") &&  player.x + player.width - 0.1 > collider.x && player.x + 0.1 < collider.x + collider.width && player.yVel < 0 && collider.state != "used")
        {
            collider.state = "used";
            player.score += 200;
            ChangeBlock(collider);
            if (collider.prop == "powerup") {
                if (player.power == "")
                {
                    var prop = "power/shroom-1"
                    AddBlock(new WorldObject(prop, collider.x, collider.y - 1, {
                        "solid":false
                    }));
                }
                else
                {
                    var prop = "power/fire-1"
                    AddBlock(new WorldObject(prop, collider.x, collider.y - 1, {
                        "solid":false
                    }));
                }
            }
            else if (collider.prop != "")
            {
                AddBlock(new WorldObject(collider.prop, collider.x, collider.y - 1, {
                    "solid":false
                }));
                player.coins += 1;
            }
            return true;
        }
        // Bricks
        else if (collider.type.includes("brick/float-") && player.x + player.width - 0.1 > collider.x && player.x + 0.1 < collider.x + collider.width && player.yVel < 0 && !(collider.jumped)) {
            // TODO Block Hop
            return true;
        }
        // Goomba
        else if (collider.type == "entity/goomba-1")
        {
            if (player.yVel > 0.02) {
                var b = collider;
                setTimeout(() => {
                    DeleteBlock(b)
                }, 200);
            
                collider.speed = 0;
                collider.state = "squash";
                collider.solid = false;
                collider.y += 0.75;
                BlockUpdate(collider);

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
            if (collider.power == "") {
                player.power = "tall";
                player.y -= 1;
                player.height = 2;
            }
            DeleteBlock(collider);
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
            DeleteBlock(block);
            return false;
        }
        return block.solid;
    }

    /**
     * Runs when the Player Dies
     * @param {boolean} [force=false] - Player instantly dies regardless of power ups when true
     */
    die(force = false)
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
            // TODO Death
        }
    }

    /**
     * Updates player each Frame
     * @param {Object} block
     */
    update(player)
    {
        player.state = (Math.abs(player.xVel * 16) > 0.2) ? "walk" : "default";
        player.state = player.jumped ? "jump" : player.state;
        if (player.power != "" && player.power != undefined)
            player.state = player.power + "_" + player.state;
        player.flip = Math.abs(player.xVel) > 0.01 ? player.xVel < 0 : player.flip;   
    }
}  
player = new Player(socket.id, 1,1);
if (!(socket.id))
    player.id = "main"
players[player.id] = player;