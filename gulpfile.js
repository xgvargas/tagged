var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');


var devmode = true;
var dst = 'tagged/';
var svgFile = 'icons.svg';
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
    var stream = gulp.src('coffee/*.coffee');

    if(devmode) stream.pipe(sourcemaps.init());
    stream.pipe(coffee({ bare: false }))
        .on('error', console.log);
    if(devmode) stream.pipe(sourcemaps.write());

    return stream.pipe(gulp.dest(dst));
});

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade({
            locals: {},
            client: false,
            pretty: devmode,
        })) .on('error', console.log)
        .pipe(gulp.dest(dst));
});

gulp.task('svg', function(done){
    var all = sh.exec('inkscape -z -S ' + svgFile, {silent: true}).output.trim();
    var name = /^([^\n,]+)/gm;
    var m;

    do{
        m = name.exec(all);
        if(m){
            if(svgValid.test(m[1])){
                console.log('Extracting: ' + dst + m[1] + '.png');
                sh.exec('inkscape -z -d 90 -e ' + dst + m[1] + '.png -j -i ' + m[1] + ' ' + svgFile, {silent: true});
            }
        }
    } while(m);

    done();
});
