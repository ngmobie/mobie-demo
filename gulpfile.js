var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('cordova-prepare-browser', function (done) {
	if(shell.exec('cordova prepare browser').code !== 0) {
		done(new Error('error while preparing browser platform'));
	} else {
		done();
	}
});
gulp.task('serve', ['cordova-prepare-browser'], function () {
	require('./');
}); 