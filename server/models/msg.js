var msgModel = function () {

	var mongoose = require('mongoose')
	var db_users= mongoose.createConnection('mongodb://chad:global321@ds029317.mongolab.com:29317/chad')

	var Schema = mongoose.Schema({
		user: String,
		mensaje: String,
		room: String,
		date: String
	})

	return db_users.model('msg_model', Schema)
}

module.exports = msgModel