module.exports = function (express) {
	var router = express.Router();
	var path = require('path');
	var __VIEWS = '../../app/www/views';
	// path.resolve(__VIEWS, './app/www/views');

	router.route('/')
		.get(function (req, res) {
			res.sendFile(path.join(__dirname, __VIEWS, '/app.html'));
		});
	router.route('/private')
		.get(function (req, res) {
			res.sendFile(path.join(__dirname, __VIEWS, '/private.html'));
		});
	router.route('*')
		.get(function (req, res) {
			// res.sendStatus(404);
			res.sendFile(path.join(__dirname, __VIEWS, '/404.html'));
		});

	return router;
}