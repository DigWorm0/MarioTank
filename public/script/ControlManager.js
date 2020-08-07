var Controls = {vertical:0,horizontal:0};
var GamepadControls = {};
var KeyboardControls = {};
var freezeControls = false;
var selectedBlock = null;

/**
 * Updates Controls with information from Gamepad and Keyboard
 */
function UpdateControls()
{
    if (freezeControls)
    {
        for (const control in KeyboardControls)
        {
            Controls[control] = false;
        }

        Controls.vertical = 0;
        Controls.horizontal = 0;
        return;
    }
    
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for (var i = 0; i < gamepads.length; i++) {
        var gp = gamepads[i];
        if (gp) {
            for (const control in GAMEPAD_CODES)
            {
                GamepadControls[control] = gamepads[i].buttons[GAMEPAD_CODES[control]].pressed;
            }
        }
    }

    for (const control in KeyboardControls)
    {
        Controls[control] = KeyboardControls[control] || GamepadControls[control];
    }

    Controls.vertical = 0;
    Controls.horizontal = 0;

    if (Controls.up)
        Controls.vertical -= 1;
    if (Controls.down)
        Controls.vertical += 1;
    if (Controls.left)
        Controls.horizontal -= 1;
    if (Controls.right)
        Controls.horizontal += 1;
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    for (const control in CONTROL_KEY_CODES)
    {
        if (event.keyCode == CONTROL_KEY_CODES[control])
        {
            KeyboardControls[control] = true;
            return;
        }
    }
});
document.addEventListener('keyup', function(event) {
    for (const control in CONTROL_KEY_CODES)
    {
        if (event.keyCode == CONTROL_KEY_CODES[control])
        {
            KeyboardControls[control] = false;
            return;
        }
    }
});

var xScale = document.getElementById("canvas").width/document.body.clientWidth;
var yScale = document.getElementById("canvas").height/document.body.clientHeight;
document.getElementById("canvas").addEventListener("click", function(event) {
    for (var key in worldData) {
        const block = worldData[key];
        var collides = BoxCollider(event.x*xScale + cameraX, event.y*yScale + cameraY, 0, 0, block.x * CELL_SIZE - CELL_SIZE, block.y * CELL_SIZE - CELL_SIZE, block.width * CELL_SIZE, block.height * CELL_SIZE)
        if (collides)
        {
            updateEditor(block);
        }
    }
});

function editBlock()
{
    if(selectedBlock != null)
    {
        selectedBlock.type = document.getElementById("blockType").value;
        selectedBlock.x = parseFloat(document.getElementById("blockX").value);
        selectedBlock.y = parseFloat(document.getElementById("blockY").value);
        selectedBlock.width = parseInt(document.getElementById("blockW").value);
        selectedBlock.height = parseInt(document.getElementById("blockH").value);
        selectedBlock.prop = document.getElementById("blockProp").value;
        selectedBlock.repeat = document.getElementById("blockRepeat").checked;
        selectedBlock.solid = document.getElementById("blockSolid").checked;

        selectedBlock.sprite = GetSprite(selectedBlock.type)

        document.getElementById("blockImg").src = "/sprites/" + selectedBlock.type + ".png";
    }
}

function updateEditor(block)
{
    document.getElementById("blockType").value = block.type;
    document.getElementById("blockX").value = block.x;
    document.getElementById("blockY").value = block.y;
    document.getElementById("blockH").value = block.height;
    document.getElementById("blockW").value = block.width;
    document.getElementById("blockProp").value = block.prop;
    document.getElementById("blockRepeat").checked = block.repeat;
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
}

function newBlock()
{
    var block = new Block(
        "block/question_1",
        Math.round(Player.x),
        Math.round(Player.y),
        {}
    );
    worldData[block.id] = block;
    updateEditor(block);
}

function delBlock()
{
    if (selectedBlock != null)
    {
        delete worldData[selectedBlock.id]
        selectedBlock = null;
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
        if (selectedBlock.repeat != false)
            prop.noRepeat = selectedBlock.noRepeat;
        if (selectedBlock.solid != true)
            prop.solid = selectedBlock.solid;
        if (selectedBlock.prop != "")
            prop.prop = selectedBlock.prop;
        var block = new Block(selectedBlock.type, selectedBlock.x + 1, selectedBlock.y, prop);
        worldData[block.id] = block;
        selectedBlock = worldData[block.id];
    }
}

function downloadMap()
{
    var json = {};
    json.displayName = worldProperties.displayName;
    json.autoScroll = worldProperties.autoScroll;
    json.bgColor = worldProperties.bgColor
    json.blocks = [];
    for (var key in worldData)
    {
        const block = worldData[key];

        if (block.type == "entity/player-1")
            continue;

        var prop = {};
        if (block.height != 1)
            prop.height = block.height;
        if (block.width != 1)
            prop.width = block.width;
        if (block.repeat != false)
            prop.repeat = block.repeat;
        if (block.solid != true)
            prop.solid = block.solid;
        if (block.prop != "")
            prop.prop = block.prop;
        
        json.blocks.push({
            type: block.type,
            x: block.x,
            y: block.y,
            properties: prop
        });
    }
    download(worldProperties.world + ".json", JSON.stringify(json));
}
function changeWorld()
{
    var world = prompt("Enter the World Number", worldProperties.world);
    if (world == null || world == "")
        return;
    selectedBlock = null;
    player.x = 3;
    player.y = 9;
    LoadWorld(world);
}

function editWorld()
{
    worldProperties.bgColor = document.getElementById("backgroundColor").value;
    bgColor = worldProperties.bgColor;
    worldProperties.displayName = document.getElementById("displayName").value;
    worldProperties.autoScroll = document.getElementById("autoScroll").checked;
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