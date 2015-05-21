var gulp         = require ('gulp');
var sass         = require ('gulp-sass');
var minifyCss    = require ('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var nodemon      = require ('gulp-nodemon');
var browserSync  = require('browser-sync').create();


// Tarea de sass
gulp.task('sass', function () {
	// Recurso a leer para la tarea
	gulp.src('./app/src/*.scss')
        // .pipe(sourcemaps.init())
		// Compila el SASS
		.pipe(sass({outputStyle: 'compressed', sourceComments: 'map'}))
        // .pipe(sourcemaps.write('.'))
		// Destino de compilación y minificación
		.pipe(gulp.dest('./app/www/css/'));
});

// Tarea estilos minifica los css después de compilar los sass
gulp.task('css', ['sass'], function () {
    return gulp.src('./app/www/css/**/*.css')
        // Agrega prefijos
        .pipe(autoprefixer())
		// Minífica CSS
		.pipe(minifyCss())
        .pipe(gulp.dest('./app/www/css/'));
})

gulp.task('watch', function () {
	gulp.watch('./app/src/*.scss',['css']);
});

// Tarea que controla el servidor. start y restart. Nodemon
gulp.task('serve', function (cb) {
	var inicio = false;

	return nodemon({
		script: 'server.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' },
		watch: ['server.js', 'gulpfile.js', 'server/**/*.*']
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
		proxy: 'http://localhost:5000/chat',
		port: 1200,
		files: ["./app/www/**/*.*"],
		ghostMode: true,
		browser: "google chrome"
	});
})
gulp.task('default', ['serve']);
gulp.task('dev', ['bsync','css','watch']);