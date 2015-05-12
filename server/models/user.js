var usersModel = function () {
	
	var mongoose = require('mongoose')
	var db_users= mongoose.createConnection('mongodb://localhost:27017/ametro')

	var Schema = mongoose.Schema({
		nombre: String,
		email: String,
		password: String		
	})

	return db_users.model('users_model', Schema)
	console.log(users)
}

module.exports = usersModel