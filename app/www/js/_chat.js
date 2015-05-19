angular.module('chatApp', ['ngSanitize', 'truncate', 'angularMoment', 'ngAnimate', 'ngMaterial', 'ngDragAndDrop'])
	.config( function ($mdThemingProvider) {
	    $mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.backgroundPalette('indigo',{
				'default' : '50',
				'hue-1'   : '100',
				'hue-2'   : '200',
				'hue-3'   : '300',
			});

		// $mdThemingProvider.theme('docs-dark')
	 //        .primaryPalette('yellow')
	 //        .backgroundPalette('gray')
	 //        .dark();
	})
	.controller('chatController', function ($scope, $window, $timeout, $filter, $mdBottomSheet) {
		$scope.image         = 'http://40.media.tumblr.com/0a049264fba0072a818f733a6c533578/tumblr_mr83y3JuP71qifdoco1_1280.png';
        $scope.imageFileName = ''
		$scope.users         = {};
		$scope.numUsr        = 0;
		$scope.messages      = [];
		$scope.form          = {};
		$scope.form.msg      = '';
		$scope.logged        = false;
		$scope.sound 	     = true;
		$scope.rooms         = [];
		$scope.room          = 'general';
		var socket           = io();

		// $scope.$watch(function () {
		// 	console.log($scope.imageFileName);
		// })
		$scope.init = function () {
			if($window.sessionStorage.user){
				$scope.login($window.sessionStorage.user, $window.sessionStorage.avatar, $scope.room);
			}
		}

		$scope.login = function (user, avatar, room) {
			if(user && room){
				$scope.image = avatar ? avatar : $scope.image;
				$scope.currentUser = user;
				var usr = {user:user, room:room, avatar:$scope.image};
				$window.sessionStorage.setItem('user', user);
				$window.sessionStorage.setItem('avatar', avatar);
				socket.emit('add user', usr);
			}
		}

		$scope.scrollD = function () {
			var contentedor = document.getElementById("messages");
			contentedor.scrollTop = contentedor.scrollHeight+500;
		}

		socket.on('login', function (data) {
			$timeout(function () {
				if(/172.19.0.150/.test(data.user_ip)) {
					alert();
				}
				$scope.logged = true;
				$scope.users = data.usersNames;
				$scope.numUsr = data.numUsers;
				$scope.messages = data.messages;
				console.log(data)
				$window.sessionStorage.setItem('room', data.room);
				$timeout(function(){$scope.scrollD();},10);
			},10);
		});

		socket.on('otro', function (data) {
			$timeout(function () {

			},10);
		});

		socket.on('user joined', function (data) {
			$timeout(function () {
				$scope.users = data.usersNames;
				$scope.numUsr = data.numUsers;
				data.date = new Date;
				$scope.messages.push(data);
				if($scope.sound) document.getElementById('ahu').play();
				$timeout(function(){$scope.scrollD();},10);
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
			}else if(/^"?<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)"?$/.test(message)){
				message = '';
			}else if(/^(ht|f)tps?:\/\/\w+([\.\-\w]+)?/.test(message)){
				message = '<a href="'+message+'" target="_blank">'+message+'</a>';
			}else if (message== '') {
				return false;
			}
			$scope.form.msg = '';
			socket.emit('chat message', message);
		}

		socket.on('chat message', function (data) {
			$timeout(function () {
				$scope.messages.push(data);
				$timeout(function(){$scope.scrollD();},10);
				if($scope.sound) document.getElementById('blop').play();
			},10);
		})

		socket.on('user left', function (data) {
			$timeout(function () {
				$scope.users = data.usersNames;
				$scope.numUsr = data.numUsers;
				data.date = new Date;
				$scope.messages.push(data);
				$timeout(function(){$scope.scrollD();},10);
			}, 10)
		})



	})
	.constant('angularMomentConfig', {
	    locale : 'es'
	});