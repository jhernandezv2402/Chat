var express = require('express');
var app = express();
var http = require('http').Server(app);
var realtime = require('./server/realtime');
var routes = require('./server/routes')(express);
var port = process.env.PORT || 1850;

app.use(express.static(__dirname + '/app/www'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use('/chat', routes);

// Socket.io
realtime(http);


http.listen(port, function () {
	console.log('listening on *:', port);
});