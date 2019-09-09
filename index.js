const express = require('express')
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;
const mjml2html = require('mjml');
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
server.listen(port);
app.use(cors());
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text({ type: 'text/html' }))
app.use(fileUpload());
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
    console.log(req.files);

    const {sender, recipient, subject, mjml} = JSON.parse(req.files.body.data.toString())
    const {authorization} = req.headers;
    console.log(req.files);
    console.log(authorization);
    // return;

    const data = await mjml2html(mjml);
    const html = data.html;
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: sender,
            pass: authorization
        },
        tls: {
            ciphers: 'SSLv3'
        }
    })

    let mailOptions = {
        from: sender,
        to: recipient,
        subject: subject,
        html: html,
        attachments:Object.entries(req.files)
        .filter(([key, file]) => key !== "body")
        .map(([key, file]) => ({
                filename: file.name,
                content: file.data
            })
        )
    };

    console.log(transporter, 'end of transporter');
    
    try {
        const mailed = await transporter.sendMail(mailOptions);
        console.log('Mailed', mailed)
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }

});

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
