var Controls = {vertical:0,horizontal:0};
var GamepadControls = {};
var KeyboardControls = {};
var freezeControls = false;

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
        }
    }
});
document.addEventListener('keyup', function(event) {
    for (const control in CONTROL_KEY_CODES)
    {
        if (event.keyCode == CONTROL_KEY_CODES[control])
        {
            KeyboardControls[control] = false;
        }
    }
});