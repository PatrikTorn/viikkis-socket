const express = require('express')
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;

server.listen(port);
const io = require('socket.io')(server);

sockets = {};
rooms = {};

io.on('connection', function (socket) {
    sockets[socket.id] = socket;
    console.log('connected', Object.keys(sockets).length);
    io.sockets.emit('get sockets', Object.keys(sockets));

    socket.on('leave room', () => {
        console.log('leave room');
        if (socket.room) {
            socket.leave(socket.room, () => {
                if (rooms[socket.room]) {
                    if (rooms[socket.room].sockets.length === 1) {
                        delete rooms[socket.room]
                    } else {
                        rooms[socket.room].sockets = rooms[socket.room].sockets
                            .filter(s => s !== socket.id);
                    }
                }
                io.sockets.emit('get rooms', rooms);
            })
        }
    })

    socket.on('join room', (article) => {
        console.log('join room');
        const id = article.id;
        socket.leave(socket.room, () => {
            socket.room = id;
            socket.join(id, () => {
                if (id in rooms) {
                    rooms[id].sockets = [...rooms[id].sockets, socket.id];
                    socket.emit('get text', rooms[id].text)
                } else {
                    rooms[id] = {
                        sockets: [socket.id],
                        text: article.text
                    }
                }
                io.sockets.emit('get rooms', rooms);
            });
        });
    });

    socket.on('get text', () => {
        console.log('get text');
        if (socket.room in rooms) {
            socket.emit('get text', rooms[socket.room].text);
        }
    });

    socket.on('set text', (newText) => {
        console.log('set text');
        if (socket.room in rooms) {
            rooms[socket.room].text = newText;
            socket.broadcast.to(socket.room).emit('get text', newText);
        }
    });

    socket.on('disconnect', () => {
        if (socket.room in rooms) {
            socket.leave(socket.room, () => {
                if (rooms[socket.room]) {
                    if (rooms[socket.room].sockets.length === 1) {
                        delete rooms[socket.room]
                    } else {
                        rooms[socket.room].sockets = rooms[socket.room].sockets
                            .filter(s => s !== socket.id);
                    }
                }
                io.sockets.emit('get rooms', rooms);
            })
        }
        if(socket.id in sockets) {
            delete sockets[socket.id];
        }

        io.sockets.emit('get sockets', Object.keys(sockets));
        console.log('disconnected', Object.keys(sockets).length)
    })

});
