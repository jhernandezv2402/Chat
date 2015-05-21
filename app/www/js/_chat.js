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

		// $scope.$watch('sound', function () {
		// 	console.log($scope.sound);
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
				$scope.dataCurrentLogin = new Date();
				console.log(data)
				$window.sessionStorage.setItem('room', data.room);
				$timeout(function(){$scope.scrollD();},1000);
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
				console.log(data);
				$scope.messages.push(data);
				if($scope.sound) document.getElementById('ahu').play();
				$timeout(function(){$scope.scrollD();},100);
			},10);
		});

		$scope.focus = function () {
			var campo = document.querySelector('#m');
			campo.focus();
		}

		$scope.checkMessage = function (msg) {
			if(msg == 'clear') {
				$scope.messages = [];
				$scope.form.msg = '';
				return false;
			}else if (msg== '') {
				return false;
			}else if(/[\"|\']*\<[\\|\/]*([a-zA-Z0-9\s\=\"\'\:\\\/\.\,]*)*\>(.*)/gm.test(msg)){
				msg = '';
			}else if(/(ht|f)tps?:\/\/\w+([\.\-\w]+)/.test(msg)){
				var cadena = msg.split(" "),
					re = /^((ht|f)tps?:)?\/\/\w+([\.\-\w\:]+)([\/\w\.-]*)*((\/)?(\?|\#\!|\#|\+|\.|\@|\$|\%)?([a-z\d\w\-]*\=)*([a-zA-A\d\w\-]*[\&]?[a-zA-A\d\w\-]*))*/,
					mensaje = '',
					thumbs = '',
					vid = '',
					youtubeID = '',
					rgexYT = [
						/watch\?v\=([A-Za-z0-9_-]+)/,
						/youtu\.be\/([A-Za-z0-9_-]+)/,
						/youtube\.com\/vi\/([A-Za-z0-9_-]+)/
					];
				for (var i = 0; i < cadena.length; i++) {
					if(re.test(cadena[i])){
						if(rgexYT[0].test(cadena[i])){
							vid = rgexYT[0].exec(cadena[i]).pop();
							youtubeID = vid.substring(0,11);
							thumbs += '<p><a href="'+cadena[i]+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="vid-th"/></a></p>';
						}else if(rgexYT[1].test(cadena[i])){
							vid = rgexYT[1].exec(cadena[i]).pop();
							youtubeID = vid.substring(0,11);
							thumbs += '<p><a href="'+cadena[i]+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="vid-th"/></a></p>';
						}else if(rgexYT[2].test(cadena[i])){
							vid = rgexYT[2].exec(cadena[i]).pop();
							youtubeID = vid.substring(0,11);
							thumbs += '<p><a href="'+cadena[i]+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="vid-th"/></a></p>';
						}
						mensaje += '<a href="'+cadena[i]+'" target="_blank">'+cadena[i]+'</a> ';
					}else{
						mensaje += cadena[i]+' ';
					}
				};
				msg = thumbs + mensaje;
			}

			return msg;
		}

		$scope.im = function (message) {
			if (!$scope.logged) {
				$scope.noLogged = 'No puedes enviar mensajes hasta que inicies sesión.';
				return false;
			};
			message = $scope.checkMessage(message);
			if(!message) return false;
			$scope.form.msg = '';
			socket.emit('chat message', message);
		}

		socket.on('chat message', function (data) {
			$timeout(function () {
				$scope.messages.push(data);
				$timeout(function(){$scope.scrollD();},500);
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
	})
