const express = require('express')
const app = express()
const server = require('http').createServer(app);
const options = {};
const io = require('socket.io')(server, options);
const port = 8080;

// Socket
io.on('connection', socket => {
    var room = makeid(8);
    socket.join(room);
    io.to(socket.id).emit('updateRoom', room);

    socket.on('addBlock', (block) => {
        io.to(room).emit('addBlock', block)
    });
    socket.on('updateBlock', (block) => {
        io.to(room).emit('updateBlock', block)
    })
    socket.on('deleteBlock', (id) => {
        io.to(room).emit('deleteBlock', id)
    })

    socket.on('connectPlayer', (player) => {
        io.to(room).emit('connectPlayer', player)
    });
    socket.on('updatePlayer', (plr) => {
        io.to(room).emit('updatePlayer', plr);
    });
    socket.on('disconnect', () => {
        io.to(room).emit('disconnectPlayer', socket.id);
    });

    socket.on('updateRoom', (rm) => {
        room = rm;
        socket.join(room);
        io.to(room).emit('connectPlayer', player)
    });
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 

// HTTP Server
app.get('/', (req, res) => {
    if (req.param('name'))
        res.sendFile(__dirname + '/public/index.html')
    else
        res.sendFile(__dirname + '/public/start.html')
})
app.use(express.static('public'))

server.listen(port, () => console.log(`App listening at http://localhost:${port}`))