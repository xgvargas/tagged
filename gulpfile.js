var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');

gulp.task('default', ['sass', 'coffee'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.coffee', ['coffee']);
});

gulp.task('build', ['sass', 'coffee']);

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('tagged/'));
});

gulp.task('coffee', function() {
    return gulp.src('src/*.coffee')
        .pipe(coffee({bare: false}))
        .pipe(gulp.dest('tagged/'))
});
