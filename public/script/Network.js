var host = false;
var socket = {};
var room = (new URLSearchParams(window.location.search)).get('room');

/**
 * Broadcasts data to all client in the room
 * @param {string} title - Name of the broadcast
 * @param {Object} data - Data to broadcast
 */
function broadcast(title, data)
{
    socket.emit(title, data);
}

socket = io();

socket.on('addBlock', function(block) {
    worldData[block.id] = block;
});
socket.on('updateBlock', function(block) {
    worldData[block.id] = block;
});
socket.on('deleteBlock', function(id) {
    delete worldData[id]
});

socket.on('changeWorld', function(world) {
    worldData = world;
})

socket.on('connectPlayer', function(plr) {
    if (host)
        broadcast("changeWorld", worldData)
    plauers[plr.id] = plr;
});
socket.on('updatePlayer', function(plr) {
    players[plr.id] = plr;
});
socket.on('disconnectPlayer', function(id) {
    delete players[id]
});

socket.on('updateRoom', function(rm) {
    if (room)
    {
        socket.emit('updateRoom', room)
    }
    else
    {
        room = rm;
        console.log("localhost:8080?room=" + room)
    }
})