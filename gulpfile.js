var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
marked      = require('marked'),

gulp.task('default', ['sass', 'coffee', 'jade'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('jade/**/*.jade', ['jade']);
});

gulp.task('build', ['sass', 'coffee', 'jade']);

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({ errLogToConsole: true })) .on('error', console.log)
        .pipe(gulp.dest('tagged/'));
});

gulp.task('coffee', function() {
    return gulp.src('coffee/*.coffee')
        .pipe(coffee({ bare: false })) .on('error', console.log)
        .pipe(gulp.dest('tagged/'))
});

gulp.task('jade', function() {
	var LOCALS = {};

    gulp.src('jade/*.jade')
        .pipe(jade({
            locals: LOCALS,
            client: false,
            pretty: true,
        })) .on('error', console.log)
        .pipe(gulp.dest('tagged/'))
});
