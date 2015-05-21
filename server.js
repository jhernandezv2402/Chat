var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var realtime = require('./server/realtime');
var mensajes = require('./server/models/msg')();
var routes = require('./server/routes')(express);
// var port = process.env.PORT || 1850;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app/www'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use('/chat', routes);

// Socket.io
realtime(http, mensajes);


http.listen(app.get('port'), function () {
	console.log('listening on *:', app.get('port'));
});