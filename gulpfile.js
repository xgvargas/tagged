var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sh = require('shelljs');


var dst = 'tagged/';
var svgFile = 'icons.svg'
var svgValid = /icon[0-9]/;


gulp.task('default', ['sass', 'coffee', 'jade'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('jade/**/*.jade', ['jade']);
});

gulp.task('build', ['sass', 'coffee', 'jade', 'svg']);

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({ errLogToConsole: true })) .on('error', console.log)
        .pipe(gulp.dest(dst));
});

gulp.task('coffee', function() {
    return gulp.src('coffee/*.coffee')
        .pipe(coffee({ bare: false })) .on('error', console.log)
        .pipe(gulp.dest(dst));
});

gulp.task('jade', function() {
	var LOCALS = {};

    return gulp.src('jade/*.jade')
        .pipe(jade({
            locals: LOCALS,
            client: false,
            pretty: true,
        })) .on('error', console.log)
        .pipe(gulp.dest(dst));
});

gulp.task('svg', function(){
    var all = sh.exec('inkscape -z -S ' + svgFile, {silent: true}).output.trim();
    var name = /^([^\n,]+)/gm;
    var m;

    do{
        m = name.exec(all);
        if(m){
            if(svgValid.test(m[1])){
                console.log('Extracting: tagged/' + m[1] + '.png');
                sh.exec('inkscape -z -d 90 -e ' + dst + m[1] + '.png -j -i ' + m[1] + ' ' + svgFile, {silent: true});
            }
        }
    } while(m);
});
