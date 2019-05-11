const express = require('express')
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;
const mjml2html = require('mjml');
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const nodemailer = require('nodemailer');
server.listen(port);
app.use(cors());
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text({ type: 'text/html' }))
sockets = {};
rooms = {};

app.post('/mjml2html', async (req, res) => {
    try {
        const response = await mjml2html(req.body);
        if (response.errors.length > 0)
            res.status(404).json(response);
        else
            res.send(response);
    } catch (e) {
        res.status(400).json("error");
    }
});

app.post('/send_email', async (req, res) => {
    console.log("Here");
    try {
        const data = await mjml2html(req.body);
        if(data.errors.length > 0)
            res.sendStatus(404);
        else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'kokelastorn@gmail.com',
                    pass: 'Kalezaya11'
                }
            });
        
            let mailOptions = {
                from: 'kokelastorn@gmail.com',
                to: 'kokelastorn@gmail.com',
                subject: 'Sending Email using Node.js',
                // html
                text: 'That was easy!'
            };

            console.log(transporter);
        
            transporter.sendMail(mailOptions, function (error, info) {
                console.log({error, info});
            });
            res.sendStatus(200);
        }

    }catch(e) {
        console.log('error', e);
        res.sendStatus(404);
    }

})

async function sendEmail(html) {
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'patrik.torn@outlook.com',
            pass: 'Kalezaya11'
        }
    });

    let mailOptions = {
        from: 'patrik.torn@outlook.com',
        to: 'patrik.torn@outlook.com',
        subject: 'Sending Email using Node.js',
        html
        // text: 'That was easy!'
    };

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if(error) {
                console.log(error);
                throw new Error(error);
            } else {
                console.log(info)
            }
        });
    } catch(e) {
        console.log(e);
        throw new Error(e);
    }

}

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
        if (socket.id in sockets) {
            delete sockets[socket.id];
        }

        io.sockets.emit('get sockets', Object.keys(sockets));
        console.log('disconnected', Object.keys(sockets).length)
    })

});
