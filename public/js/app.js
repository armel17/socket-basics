var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' wants to join ' + room);

// Update room name
$('.room-title').text(room);

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
    // Connect to a specific sockets.io room by emitting the information to the server
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var timestampMoment = moment.utc(message.timestamp);
    var $message = jQuery('.messages');
        
    console.log('New message:');
    console.log(message.text);
    
    $message.append('<p><strong>' + message.name + ' ' + timestampMoment.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
    event.preventDefault(); // Prevent the default behaviour of submit to reloading the whole page
    
    var $message = $form.find('input[name=message]');
    
    socket.emit('message', {
        name: name,
        text: $message.val()
    });
    
    $message.val('');
});