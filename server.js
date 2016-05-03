var http = require('http'),
    fs = require('fs');
 
//var port = Number(process.env.PORT || 8080);
var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;
var address =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; 
var app = http.createServer(function (request, response) {
    fs.readFile("index.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(port);
 
var io = require('socket.io').listen(app);
var usernames = {};

var rooms = [];


io.sockets.on('connection', function(socket) {

    socket.on('message_to_server', function(data) {
    	var room = data.room;
        socket.broadcast.to(socket.room).emit("message_to_client", {message:data.message, username: data.username, room: data.room});
    });

    socket.on('adduser', function(data) {
        socket.room = data.rn;
        socket.username = data.mn;
        socket.join(socket.room);
        //socket.emit('message_to_client', 'SERVER', 'you have connected to Lobby');
        socket.broadcast.to(socket.room).emit('message_to_client', {message: socket.username + ' has connected to this room', username: 'SERVER', room: data.rn});
        //socket.emit('updaterooms', rooms, 'Lobby');
    });
});





  