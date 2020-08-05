/*
        Variables
*/
var Controls = {};
var GamepadControls = {};
var KeyboardControls = {};

/*
        Updates
*/
function updateControls()
{
    // Combine Keyboard and Gamepad Controls
    for (const control in KeyboardControls)
    {
        Controls[control] = KeyboardControls[control] || GamepadControls[control];
    }

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
        KeyboardControls[control] = false;
    }
    KeyboardControls.horizontal = 0;
    KeyboardControls.vertical = 0;

    // Document Listeners
    document.addEventListener('keydown', function(event) {
        for (const control in CONTROL_KEY_CODES)
        {
            if (event.keyCode == CONTROL_KEY_CODES[control])
            {
                KeyboardControls[control] = true;
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
                 KeyboardControls[control] = false;
                updateControls();
                return;
            }
        }
    });
}

/*
        Gamepad API
*/
function pollGamepads() {
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
    updateControls();
}