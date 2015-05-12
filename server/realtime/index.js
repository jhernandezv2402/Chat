var socketio = require('socket.io');
	

module.exports = function (server, mensaje) {
	var io = socketio(server);
	var usernames = {};
	var numUsers = 0;
	var addedUser = false;
	io.on('connection', onConnection);

	function onConnection (socket) {

		var socketId = socket.id;
		var client_ip_address = socket.request.connection._peername.address;

		console.log('a user connected->> ' + socketId + "===:===" + client_ip_address);

		socket.on('add user', function (user) {
			socket.username = user.user;
			socket.room = user.room;
			usernames[user.user] = user.user;
			++numUsers;
			addedUser = true;
			console.log('Usuario logged: ' + user.user + ' --- Con IP: ' + client_ip_address + ' in room: ' + socket.room);

			socket.join(socket.room);
			mensaje.find({})
			.exec(function (err, mensajes){
				if (!err) {

					console.log(mensajes)
					socket.emit('login', {
						numUsers : numUsers,
						usersNames : usernames,
						room : socket.room,
						messages: mensajes
					});

				};
			})
			
			socket.broadcast.to(socket.room).emit('user joined', {
				user : socket.username,
				numUsers : numUsers,
				usersNames : usernames,
				join : true
			});
		})

		socket.on('chat message', function (msg) {
			console.log('message: ' + msg + ' from: ' + client_ip_address);

			data = {
				user: socket.username,
				mensaje: msg,
				room: socket.room,
				date: new Date()
			}

			msj = new mensaje(data)

			msj.save(function (err, mensaje){
				if (!err) {
					io.in(socket.room).emit('chat message', {
						mensaje : msg,
						user    : socket.username,
						user_ip : client_ip_address
					});
				};
			})

		});

		socket.on('disconnect', function () {
			if(addedUser) {
				--numUsers;
				delete usernames[socket.username]
				console.log('user disconnected');

				socket.broadcast.emit('user left', {
					user : socket.username,
					usersNames : usernames,
					numUsers : numUsers,
					left : true
				});

				// socket.leave(socket.room)

	    	}

		});

	}
	// Socket.io

}