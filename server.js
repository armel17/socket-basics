var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

// Save users' information for further use if data not passed in given callback function
var clientInfo = {};

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');
    var timestampMoment = moment.utc().local();
    
    socket.on('joinRoom', function (req) {
        // built-in random id generator
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });
    
    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);
        
        message.timestamp = moment().valueOf();
        // Sends to everybody but the person who sends it (if sender included: io.emit)
        // socket.broadcast.emit('message', message);
        io.to(clientInfo[socket.id].room).emit('message', message);
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat application!',
        timestamp: moment().valueOf()
    })
});

http.listen(PORT, function () {
    console.log('Server started!');
});