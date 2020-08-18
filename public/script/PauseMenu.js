var paused = false;
var tpMenu = false;

function togglePause()
{
    paused = !paused;
    tpMenu = false;

    var menu = document.getElementById("pauseMenu");
    var tpmenu = document.getElementById("tpMenu");

    if (paused)
        menu.style.display = "unset";
    else
        menu.style.display = "none";
    
    tpmenu.style.display = "none";
}

function pauseTp()
{
    tpMenu = true;

    var menu = document.getElementById("pauseMenu");
    menu.style.display = "none";

    var tpmenu = document.getElementById("tpMenu");
    tpmenu.style.display = "unset";
    tpmenu.innerHTML = "<h1>Teleport</h1>";
    for (var id in players)
    {
        if (id == player.id)
            continue;
        tpmenu.innerHTML += '<a href="#" onclick="teleport(\'' + players[id].id + '\')">' + players[id].name + '</a><br /><br />';
    }
}

function teleport(id)
{
    if (id in players)
    {
        player.x = players[id].x;
        player.y = players[id].y;
        player.yVel = 0;
        player.xVel = 0;
        paused = true;
        togglePause();
    }
}

function resetWorldData()
{
    socket.emit('resetWorld', world.id);

    paused = true;
    togglePause();
}

function resetPlayer()
{
    player.die(true);

    paused = true;
    togglePause();
}