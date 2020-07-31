/*
        Variables
*/
var Controls = {};

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
}