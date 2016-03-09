var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var svgng = require('gulp-svg-ngmaterial');


var DEVMODE = true;
var DST = 'tagged/';
var SVGFILE = 'icons.svg';
var SVGVALID = /icon[0-9]/;


gulp.task('default', ['sass', 'coffee', 'jade', 'svg'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch('svg/**/*.svg', ['svg']);
});

gulp.task('dist', function(){
    DEVMODE = false;
    gulp.start('build');
});

gulp.task('build', ['sass', 'coffee', 'jade', 'svg', 'icon']);

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({ errLogToConsole: true })) .on('error', console.log)
        .pipe(gulp.dest(DST));
});

gulp.task('coffee', function() {
    var stream = gulp.src('coffee/*.coffee');

    if(DEVMODE) stream.pipe(sourcemaps.init());
    stream.pipe(coffee({ bare: false }))
        .on('error', console.log);
    if(DEVMODE) stream.pipe(sourcemaps.write());

    return stream.pipe(gulp.dest(DST));
});

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade({
            locals: {},
            client: false,
            pretty: DEVMODE,
        })) .on('error', console.log)
        .pipe(gulp.dest(DST));
});

gulp.task('icon', function(done){
    var all = sh.exec('inkscape -z -S ' + SVGFILE, {silent: true}).output.trim();
    var name = /^([^\n,]+)/gm;
    var m;

    do{
        m = name.exec(all);
        if(m){
            if(SVGVALID.test(m[1])){
                console.log('Extracting: ' + DST + m[1] + '.png');
                sh.exec('inkscape -z -d 90 -e ' + DST + m[1] + '.png -j -i ' + m[1] + ' ' + SVGFILE, {async: true, silent: true});
            }
        }
    } while(m);

    done();
});

gulp.task('svg', function(){
    return gulp.src('svg/*.svg')
        .pipe(svgng({ filename: 'icons.svg' }))
        .pipe(gulp.dest(DST));
});
