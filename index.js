const express = require('express')
const path = require('path')
const app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var fs = require('fs')
app.use(express.static(path.join(__dirname, '/client/playground')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/client/playground/index.html'));
})



var text = fs.readFileSync('text.md','utf8');
console.log (text)

let sockets = {};
io.on('connection', function(socket) {
    sockets[socket.id] = socket;
    console.log('cconnected', Object.keys(sockets).length)

    socket.on('get text', function() {
        socket.emit('get text', text);
    });

    socket.on('set text', (newText) => {
        fs.writeFileSync('text.md', newText, 'utf8');
        text = newText;
        io.sockets.emit('get text', newText);
    })
    socket.on('disconnect', () => {
        delete sockets[socket.id];
    })

});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("Listening 5000"));