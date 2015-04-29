var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();

app.use('/sources',express.static(__dirname + '/sources'));
app.use('/chat', router);

router.route('/')
	.get(function (req, res) {
  		res.sendFile(__dirname+'/index.html');
	});

io.on('connection', function (socket) {
	var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
	var client_ip_address = socket.request.connection.remoteAddress;
  console.log('a user connected->> ' + socketId + "===:===" + client_ip_address);
   socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg + ' from: ' + client_ip_address);
    io.emit('chat message', {mensaje : msg, user : client_ip_address});
  });
});

http.listen(1850, function () {
  console.log('listening on *:1850');
});