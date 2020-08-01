/*
        Settings
*/
// Graphics
const MAX_FPS = 60;
const CAMERA_DAMPING = 0.85;
const CELL_SIZE = 16;
const CELL_HEIGHT = 15;
const CELL_WIDTH = 28;

// Physics
const X_MOTION_DAMPING = .9;
const PLAYER_SPEED = .0125;
const GRAVITY = .0125;
const JUMP_FORCE = .375;
const BOUNCE_FORCE = .1;
const Y_MOTION_DAMPING = .9;

// Environment
const DEFAULT_WORLD = "1-1";

// Controls
const CONTROL_KEY_CODES = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
};

/*
        Setting Calculations
*/
const STEP = 1/MAX_FPS;