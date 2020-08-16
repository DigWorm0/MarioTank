// Graphics
const MAX_FPS = 60;
const CAMERA_DAMPING = 0.2;
const X_MOTION_DAMPING = .9;
const Y_MOTION_DAMPING = .999;
const CELL_SIZE = 32;

// Physics
const PLAYER_SPEED = .0125;
const PLAYER_SPRINT_SPEED = .0175;
const PLAYER_AIR_SPEED = .01;
const GRAVITY = .0125;
const JUMP_FORCE = .25; // .375
const CONTINUOUS_JUMP_FORCE = .023;
const BOUNCE_FORCE = .1;
const BOUNCE_SPEED = 0.03;

// Other
const DEFAULT_WORLD = "1-1";
const CONTROL_KEY_CODES = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    sprint: 16
};
const GAMEPAD_CODES = {
    up: 0,
    down: 13,
    left: 14,
    right: 15,
    sprint: 2
}
const DEBUG = false;
const STEP = 1/MAX_FPS;
const SPRITE_SCALE = CELL_SIZE / 16;
var CELL_HEIGHT = 15;
var CELL_WIDTH = 28;