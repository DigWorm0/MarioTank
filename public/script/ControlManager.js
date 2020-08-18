var Controls = {vertical:0,horizontal:0};
var GamepadControls = {};
var KeyboardControls = {};
var freezeControls = false;
var selectedBlock = null;
var addedBlock = false;

for (const control in CONTROL_KEY_CODES)
{
    KeyboardControls[control] = false;
}

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

    if (event.keyCode == 27)
    {
        togglePause();
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
    for (var key in world.blocks) {
        const block = world.blocks[key];
        var collides = _boxCollider(event.x*xScale + cameraX, event.y*yScale + cameraY, 0, 0, block.x * CELL_SIZE - CELL_SIZE, block.y * CELL_SIZE - CELL_SIZE, block.width * CELL_SIZE, block.height * CELL_SIZE)
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
        socket.emit("updateBlock", world.id, selectedBlock.id, {
            "type":document.getElementById("blockType").value,
            "x":parseFloat(document.getElementById("blockX").value),
            "y":parseFloat(document.getElementById("blockY").value),
            "width":parseInt(document.getElementById("blockW").value),
            "height":parseInt(document.getElementById("blockH").value),
            "prop":document.getElementById("blockProp").value,
            "isRepeat":document.getElementById("blockRepeat").checked,
            "isSolid":document.getElementById("blockSolid").checked
        })
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
    document.getElementById("blockRepeat").checked = block.isRepeat;
    document.getElementById("blockSolid").checked = block.isSolid;

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
    socket.emit("addBlock", world.id, "block/question_1", Math.round(player.x), Math.round(player.y), {});
    addedBlock = true;
}

function delBlock()
{
    if (selectedBlock != null)
    {
        socket.emit("removeBlock", world.id, selectedBlock.id);
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
            prop.noRepeat = selectedBlock.isRepeat;
        if (selectedBlock.solid != true)
            prop.solid = selectedBlock.isSolid;
        if (selectedBlock.prop != "")
            prop.prop = selectedBlock.prop;
        addedBlock = true;
        socket.emit("addBlock", world.id, selectedBlock.type, selectedBlock.x+1, selectedBlock.y,prop);
    }
}

function downloadMap()
{
    var json = {};
    json.displayName = world.displayName;
    json.autoScroll = world.autoScroll;
    json.bgColor = world.bgColor
    json.blocks = [];
    for (var key in world.blocks)
    {
        const block = world.blocks[key];

        if (block.type == "entity/player-1")
            continue;

        var prop = {};
        if (block.height != 1)
            prop.height = block.height;
        if (block.width != 1)
            prop.width = block.width;
        if (block.isRepeat != false)
            prop.repeat = block.isRepeat;
        if (block.isSolid != true)
            prop.isSolid = block.isSolid;
        if (block.prop != "")
            prop.prop = block.prop;
        
        json.blocks.push({
            type: block.type,
            x: block.x,
            y: block.y,
            properties: prop
        });
    }
    download(world.id + ".json", JSON.stringify(json));
}
function changeWorld()
{
    var worldP = prompt("Enter the World Number", world.id);
    if (worldP == null || worldP == "")
        return;
    selectedBlock = null;
    player.x = 3;
    player.y = 9;
    socket.emit("getWorld", worldP);
}

function editWorld()
{
    world.bgColor = document.getElementById("backgroundColor").value;
    bgColor = world.bgColor;
    world.displayName = document.getElementById("displayName").value;
    world.autoScroll = document.getElementById("autoScroll").checked;
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