/*
        Settings
*/
// Graphics
const MAX_FPS = 60;
const DEFAULT_BACKGROUND_COLOR = "#5c94fc";
const CAMERA_DAMPING = 0.85;
const CELL_SIZE = 16;
const CELL_HEIGHT = 15;
const CELL_WIDTH = 28;
const DEBUG = false;

// Physics
const X_MOTION_DAMPING = .9;
const Y_MOTION_DAMPING = .999;
const PLAYER_SPEED = .0125;
const PLAYER_SPRINT_SPEED = .0175;
const PLAYER_AIR_SPEED = .01;
const GRAVITY = .0125;
const JUMP_FORCE = .25; // .375
const CONTINUOUS_JUMP_FORCE = .023;
const BOUNCE_FORCE = .1;

// Environment
const DEFAULT_WORLD = "1-1";

// Controls
const CONTROL_KEY_CODES = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    sprint: 16
};

/*
        Setting Calculations
*/
const STEP = 1/MAX_FPS;