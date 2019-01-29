const express = require('express')
// const path = require('path')
const app = express();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
// const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
// const axios = require('axios')

// app.use(express.static(path.join(__dirname, '/client/playground')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })) 

let sockets = {};
rooms = {};

io.on('connection', function(socket) {
    sockets[socket.id] = socket;
    console.log('connected', Object.keys(sockets).length)

    socket.on('leave room', () => {
        if(socket.room){
            socket.leave(socket.room, () => {
                if(rooms[socket.room]){
                    if(rooms[socket.room].sockets.length === 1){
                        delete rooms[socket.room]
                    }else{
                        rooms[socket.room].sockets = rooms[socket.room].sockets
                        .filter(s => s !== socket.id);
                    }
                }
                io.sockets.emit('get rooms', rooms);
            })
        }
    })

    socket.on('join room', (article) => {
        const id = article.id;
        socket.leave(socket.room, () => {
            socket.room = id;
            socket.join(id, () => {
                if(id in rooms){
                    rooms[id].sockets = [...rooms[id].sockets, socket.id];
                    socket.emit('get text', rooms[id].text)
                }else{
                    rooms[id] = {
                        sockets:[socket.id],
                        text:article.text
                    }
                }
                io.sockets.emit('get rooms', rooms);
            });
        });
    });

    socket.on('get text', () => {
        socket.emit('get text', rooms[socket.room].text);
    });

    socket.on('set text', (newText) => {
        rooms[socket.room].text = newText;
        socket.broadcast.to(socket.room).emit('get text', newText);
    });

    socket.on('disconnect', () => {
        if(socket.room){
            socket.leave(socket.room, () => {
                if(rooms[socket.room]){
                    if(rooms[socket.room].sockets.length === 1){
                        delete rooms[socket.room]
                    }else{
                        rooms[socket.room].sockets = rooms[socket.room].sockets
                        .filter(s => s !== socket.id);
                    }
                }
                io.sockets.emit('get rooms', rooms);
            })
        }
        delete sockets[socket.id];
        console.log('disconnected', Object.keys(sockets).length)
    })

});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("Listening 5000"));