angular.module('privateApp', ['ngSanitize', 'truncate', 'privateRoutes'])
	.controller('privateController', function ($scope, $window, $timeout, $routeParams) {
		$scope.users    = {};
		$scope.numUsr   = 0;
		$scope.messages = [];
		$scope.form     = {};
		$scope.form.msg = '';
		$scope.logged   = false;
		$scope.room	    = $routeParams.id;
		var socket      = io();


		$scope.init = function () {
			if($window.sessionStorage.user){
				$scope.login($window.sessionStorage.user, $scope.room);
				console.log($scope.room)
			} else {
				$window.location = '/chat/';
			}
		}

		$scope.login = function (user, room) {
			if(user && room){
				var usr = {user:user, room:room};
				socket.emit('add user', usr);
				$scope.logged = true;
				$window.sessionStorage.setItem('user', user);
			}
		}

		socket.on('login', function (data) {
			$timeout(function () {
				$scope.numUsr = data.numUsers;
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
				console.log(data.usersNames)
				$scope.messages.push(data);
				$scope.numUsr = data.numUsers;
				document.getElementById('ahu').play();
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
				var contentedor = document.getElementById("messages");
				$scope.messages.push(data);
				$scope.form.msg = '';
				contentedor.scrollTop = contentedor.offsetHeight+100;
				document.getElementById('blop').play();
			},10);
		})

		socket.on('user left', function (data) {
			$timeout(function () {
				$scope.numUsr = data.numUsers;
				$scope.messages.push(data);
			}, 10)
		})

	});