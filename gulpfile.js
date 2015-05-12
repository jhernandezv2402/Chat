var gulp        = require ('gulp');
var sass        = require ('gulp-sass');
var minifyCss   = require ('gulp-minify-css');
var nodemon     = require ('gulp-nodemon');
var browserSync = require('browser-sync').create();


// Tarea de estilos
gulp.task('sass', function () {
	// Recurso a leer para la tarea
	gulp.src('./app/src/*.scss')
		// Compila el SASS
		.pipe(sass({outputStyle: 'compressed', sourceComments: 'map'}))
		// Minífica CSS
		.pipe(minifyCss())
		// Destino de compilación y minificación
		.pipe(gulp.dest('./app/www/css/'));
});

gulp.task('watch', function () {
	gulp.watch('./app/src/*.scss',['sass']);
});

// Tarea que controla el servidor. start y restart. Nodemon
gulp.task('serve', function (cb) {
	var inicio = false;

	return nodemon({
		script: 'server.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' },
		watch: ['server.js', 'server/**/*.*']
	})
	.on('start', function onStart () {
		if(!inicio){
			cb();
		}

		inicio = true;
	})
	.on('restart', function onRestart () {
		setTimeout(function reload () {
			browserSync.reload({stream : false});
		}, 500);
	})

});

// Tarea de BrowserSync
gulp.task('bsync', ['serve'], function () {
	browserSync.init(null, {
		proxy: 'http://localhost:1850/chat',
		port: 1200,
		files: ["./app/www/**/*.*"],
		ghostMode: true
	});
})
gulp.task('default', ['serve']);
gulp.task('dev', ['bsync','sass','watch']);