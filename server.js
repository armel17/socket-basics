var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

// Save users' information for further use if data not passed in given callback function
var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers(socket){
    var userData = clientInfo[socket.id];
    var users = [];
    
    if(typeof userData === 'undefined'){
        return;
    }
    
    Object.keys(clientInfo).forEach(function(socketId){
        var info = clientInfo[socketId];
        if(info.room === userData.room){
            users.push(info.name);
        }
    });
    
    // Sends to requesting socket only
    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');
    
    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });
    
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
        
        // Allow for special commands
        if(message.text === '@currentUsers'){
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            // Sends to everybody but the person who sends it (if sender included: io.emit)
            // socket.broadcast.emit('message', message);
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
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