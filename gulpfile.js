var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('cordova-prepare-browser', function (done) {
	if(shell.exec('cordova prepare browser').code !== 0) {
		done(new Error('error while preparing browser platform'));
	} else {
		done();
	}
});

gulp.task('watch', function () {
	// Everytime you update your www/ folder
	// the 'cordova-prepare-browser' task is executed
	gulp.watch('www/{js,css}/**/*.{js,css}', ['cordova-prepare-browser']);
});

gulp.task('serve', ['cordova-prepare-browser', 'watch'], function () {
	require('./');
});