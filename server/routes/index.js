module.exports = function (express) {
	var router = express.Router();
	var path = require('path');
	var __VIEWS = '../../app/www/views';
	// path.resolve(__VIEWS, './app/www/views');

	router.route('/a')
		.get(function (req, res) {
			res.sendFile(path.join(__dirname, __VIEWS, '/404.html'));
		});
	router.route('/')
		.get(function (req, res) {
			res.sendFile(path.join(__dirname, __VIEWS, '/app.html'));
		});
	router.route('/private')
		.get(function (req, res) {
			res.sendFile(path.join(__dirname, __VIEWS, '/private.html'));
		});

	return router;
}