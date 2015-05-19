var usersModel = function () {
	
	var mongoose = require('mongoose')
	var db_users= mongoose.createConnection('mongodb://chad:global321@ds029317.mongolab.com:29317/chad')

	var Schema = mongoose.Schema({
		nombre: String,
		email: String,
		password: String		
	})

	return db_users.model('users_model', Schema)
	console.log(users)
}

module.exports = usersModel