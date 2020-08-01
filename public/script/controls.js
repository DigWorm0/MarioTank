/*
        Variables
*/
var Controls = {};

var selectedBlock = null;
var selectedIndex = -1;

/*
        Updates
*/
function updateControls()
{
    // Defaults
    Controls.vertical = 0;
    Controls.horizontal = 0;

    // Check Directions
    if (Controls.up)
        Controls.vertical -= 1;
    if (Controls.down)
        Controls.vertical += 1;
    if (Controls.left)
        Controls.horizontal -= 1;
    if (Controls.right)
        Controls.horizontal += 1;
}

/*
        Initialization
*/
function beginControls()
{
    // Defaults
    for (const control in CONTROL_KEY_CODES)
    {
        Controls[control] = false;
    }
    Controls.horizontal = 0;
    Controls.vertical = 0;

    // Document Listeners
    document.addEventListener('keydown', function(event) {
        for (const control in CONTROL_KEY_CODES)
        {
            if (event.keyCode == CONTROL_KEY_CODES[control])
            {
                Controls[control] = true;
                updateControls();
                return;
            }
        }
    });
    document.addEventListener('keyup', function(event) {
        for (const control in CONTROL_KEY_CODES)
        {
            if (event.keyCode == CONTROL_KEY_CODES[control])
            {
                Controls[control] = false;
                updateControls();
                return;
            }
        }
    });
    var xScale = document.getElementById("canvas").width/document.body.clientWidth;
    var yScale = document.getElementById("canvas").height/document.body.clientHeight;

    document.getElementById("canvas").addEventListener("click", function(event) {
        for (var i = 0; i < WORLD_DATA.length; i++) {
            const block = WORLD_DATA[i];
            var collides = checkCollisions(event.x*xScale + cameraX, event.y*yScale + cameraY, 0, 0, block.x * CELL_SIZE - CELL_SIZE, block.y * CELL_SIZE - CELL_SIZE, block.width * CELL_SIZE, block.height * CELL_SIZE)
            if (collides)
            {
                updateEditor(block, i);
            }
        }
    });
}

/*
        World Edit
*/

function editBlock()
{
    if(selectedBlock != null)
    {
        selectedBlock.type = document.getElementById("blockType").value;
        selectedBlock.x = parseFloat(document.getElementById("blockX").value);
        selectedBlock.y = parseFloat(document.getElementById("blockY").value);
        selectedBlock.width = parseInt(document.getElementById("blockW").value);
        selectedBlock.height = parseInt(document.getElementById("blockH").value);
        selectedBlock.noRepeat = document.getElementById("blockRepeat").checked;
        selectedBlock.solid = document.getElementById("blockSolid").checked;

        selectedBlock.sprite = loadSprite("/sprites/" + selectedBlock.type + ".png")

        document.getElementById("blockImg").src = "/sprites/" + selectedBlock.type + ".png";
    }
}

function updateEditor(block, index)
{
    document.getElementById("blockType").value = block.type;
    document.getElementById("blockX").value = block.x;
    document.getElementById("blockY").value = block.y;
    document.getElementById("blockH").value = block.height;
    document.getElementById("blockW").value = block.width;
    document.getElementById("blockRepeat").checked = block.noRepeat;
    document.getElementById("blockSolid").checked = block.solid;

    document.getElementById("blockImg").src = "/sprites/" + block.type + ".png"
    if (block.width == 1 && block.height == 1) {
        document.getElementById("blockImg").height = ((block.height / block.width) * 300.0);
    }
    else
    {
        document.getElementById("blockImg").height = 300;
    }
    selectedBlock = block;
    selectedIndex = index;
}

function newBlock()
{
    WORLD_DATA.push(new WorldObject(
        "block/question_1",
        Math.round(Player.x),
        Math.round(Player.y),
        {}
    ));
    updateEditor(WORLD_DATA[WORLD_DATA.length - 1], WORLD_DATA.length - 1);
}

function delBlock()
{
    if (selectedBlock != null)
    {
        WORLD_DATA.splice(selectedIndex, 1);
        selectedBlock = null;
        selectedIndex = -1;
    }
}

function dupBlock()
{
    if (selectedBlock != null)
    {
        var prop = {};
        if (selectedBlock.height != 1)
            prop.height = selectedBlock.height;
        if (selectedBlock.width != 1)
            prop.width = selectedBlock.width;
        if (selectedBlock.noRepeat != false)
            prop.noRepeat = selectedBlock.noRepeat;
        if (selectedBlock.solid != true)
            prop.solid = selectedBlock.solid;
        WORLD_DATA.push(new WorldObject(selectedBlock.type, selectedBlock.x + 1, selectedBlock.y, prop))
        selectedBlock = WORLD_DATA[WORLD_DATA.length - 1];
        selectedIndex = WORLD_DATA.length - 1;
    }
}

function downloadMap()
{
    var json = {};
    json.backgroundColor = backgroundColor;
    json.blocks = [];
    for (var i = 0; i < WORLD_DATA.length; i++)
    {
        const block = WORLD_DATA[i];

        if (block.type == "entity/player")
            continue;

        var prop = {};
        if (block.height != 1)
            prop.height = block.height;
        if (block.width != 1)
            prop.width = block.width;
        if (block.noRepeat != false)
            prop.noRepeat = block.noRepeat;
        if (block.solid != true)
            prop.solid = block.solid;
        
        json.blocks.push({
            type: block.type,
            x: block.x,
            y: block.y,
            properties: prop
        });
    }
    download(currentWorld + ".json", JSON.stringify(json));
}
function changeWorld()
{
    var world = prompt("Enter the World Number", currentWorld);
    if (world == null || world == "")
        return;
    selectedBlock = null;
    selectedIndex = -1;
    Player.x = 3;
    Player.y = 9;
    loadWorld(world);
}

function editWorld()
{
    backgroundColor = document.getElementById("backgroundColor").value;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}