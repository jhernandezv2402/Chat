angular.module('chatApp', ['ngSanitize', 'truncate'])
	.controller('chatController', function ($scope, $window, $timeout, $filter) {
		$scope.users    = {};
		$scope.numUsr   = 0;
		$scope.messages = [];
		$scope.form     = {};
		$scope.form.msg = '';
		$scope.logged   = false;
		$scope.rooms    = [];
		$scope.room     = 'general';
		var socket      = io();

		$scope.init = function () {
			if($window.sessionStorage.user){
				$scope.login($window.sessionStorage.user, $scope.room);
			}
		}

		$scope.login = function (user, room) {
			if(user && room){
				$scope.currentUser = user;
				var usr = {user:user, room:room};
				socket.emit('add user', usr);
				$window.sessionStorage.setItem('user', user);
			}
		}

		$scope.scrollD = function () {
			var contentedor = document.getElementById("messages");
			contentedor.scrollTop = contentedor.scrollHeight-500;
		}

		socket.on('login', function (data) {
			$timeout(function () {
				$scope.logged = true;
				$scope.users = data.usersNames;
				$scope.numUsr = data.numUsers;
				console.log(data)
				$window.sessionStorage.setItem('room', data.room);
			},10);
		});

		socket.on('otro', function (data) {
			$timeout(function () {
				alert('otro')
			},10);
		});

		socket.on('user joined', function (data) {
			$timeout(function () {
				$scope.users = data.usersNames;
				$scope.messages.push(data);
				$scope.numUsr = data.numUsers;
				document.getElementById('ahu').play();
				$scope.scrollD;
			},10);
		});

		$scope.focus = function () {
			var campo = document.querySelector('#m');
			campo.focus();
		}

		$scope.im = function (message) {
			if (!$scope.logged) {
				$scope.noLogged = 'No puedes enviar mensajes hasta que inicies sesión.';
				return false;
			};
			if(message == 'clear') {
				$scope.messages = [];
				$scope.form.msg = '';
				return false;
			}else if(/^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,6})?([\.\-\w\/_]+)$/i.test(message)){
				message = '<a href="'+message+'" target="blank">'+message+'</a>';
			}else if (message== '') {
				return false;
			}
			socket.emit('chat message', message);
		}

		socket.on('chat message', function (data) {
			$timeout(function () {
				$scope.messages.push(data);
				$scope.form.msg = '';
				$scope.scrollD;
				document.getElementById('blop').play();
			},10);
		})

		socket.on('user left', function (data) {
			$timeout(function () {
				$scope.users = data.usersNames;
				$scope.numUsr = data.numUsers;
				$scope.messages.push(data);
				$scope.scrollD;
			}, 10)
		})



	});