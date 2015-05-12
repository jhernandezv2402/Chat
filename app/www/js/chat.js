var socket = io();

$('#main').click(function() {
	$('#m').focus();
});

window.onload = function () {
	if(!sessionStorage.user){
		var user = prompt("Please enter your name");
		if (user != null) {
			sessionStorage.setItem('user', user);
			setUsername(user);
		}else {
			setUsername('Nabo');
		}
	}else {
		var user = sessionStorage.getItem('user');
		setUsername(user);
	}
}

$('form').submit(function(){
	var texto = $('#m').val();
	if(texto == 'clear'){
		$('#messages li').remove();
		$('#m').val('');
		return false;
	}else if(/https?/.test(texto)){
		texto = '<a href="'+texto+'" target="blank">'+texto+'</a>';
	}else if(texto == '' || texto == undefined || texto == null){
		return false;
	}

	socket.emit('chat message', texto);
	setUsername();
	$('#m').val('');
	return false;

});

function setUsername (user) {
	// If the username is valid
	if (user) {
		// Tell the server your username
		socket.emit('add user', user);
	}
}

socket.on('login', function (users) {
	console.log(users.numUsers)
	$('.users-num').text(users.numUsers);
	document.getElementById('ahu').play();
})

socket.on('chat message', function (msg) {
	var contenedor = $('#messages');
	var user;
	if(/172.19.0.150/.test(msg.user)) {
		user = 'Yisus';
	}else if(/172.19.0.15/.test(msg.user)) {
		user = 'Abelinho';
	}else if(/172.19.0.194/.test(msg.user)) {
		user = 'Joshua';
	}else if(/172.19.0.42/.test(msg.user)) {
		user = 'Pily';
	}else if(/172.19.0.98/.test(msg.user)) {
		user = 'Vri-Viri';
	}else if(/172.19.0.23/.test(msg.user)) {
		user = 'Dilbert-Jr.';
	}else if(/127.0/.test(msg.user) || /172.19.0.14/.test(msg.user)) {
		user = 'Master';
	}else {
		user = msg.user;
	}
	var prompt_sfx = '<span class="prompt-green">'+user+'@TB65</span> <span class="prompt-yellow">/c/xampp/</span> ';
	var li = $('<li>').html(prompt_sfx + msg.mensaje);

	li.insertBefore('form');
	contenedor.scrollTop(contenedor.prop("scrollHeight"));
	document.getElementById('blop').play();
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
	var prompt_sfx = '<span class="prompt-join">--== '+data.username+' SE UNIÓ ==-</span> ';
	var li = $('<li>').html(prompt_sfx);
	$('.users-num').text(data.numUsers);
	li.insertBefore('form');
});

socket.on('user left', function (data) {
	var prompt_sfx = '<span class="prompt-left"> <span class="skull">&#9760;</span> '+data.username+' MURIÓ <span class="skull">&#9760;</span> </span> ';
	var li = $('<li>').html(prompt_sfx);
	$('.users-num').text(data.numUsers);
	li.insertBefore('form');
})
