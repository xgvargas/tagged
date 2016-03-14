var gulp       = require('gulp');
var coffee     = require('gulp-coffee');
var sass       = require('gulp-sass');
var jade       = require('gulp-jade');
var sh         = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var svgng      = require('gulp-svg-ngmaterial');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var svgmin     = require('gulp-svgmin');


var DEVMODE = true;
var DST     = 'tagged/';


gulp.task('default', ['sass', 'coffee', 'jade', 'icon'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch('svg/icons/**/*.svg', ['icon']);
});

gulp.task('dist', function(){
    DEVMODE = false;
    gulp.start('build');
});

gulp.task('build', ['sass', 'coffee', 'jade', 'png', 'icon']);

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({ errLogToConsole: true })) .on('error', gutil.log)
        .pipe(gulp.dest(DST));
});

gulp.task('coffee', function() {
    return gulp.src('coffee/*.coffee')
        .pipe(DEVMODE ? sourcemaps.init() : gutil.noop())
        .pipe(coffee({ bare: false })) .on('error', gutil.log)
        .pipe(DEVMODE ? sourcemaps.write() : gutil.noop())
        .pipe(ngAnnotate())
        .pipe(DEVMODE ? gutil.noop() : uglify()) .on('error', gutil.log)
        .pipe(gulp.dest(DST));
});

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade({
            locals: {},
            client: false,
            pretty: DEVMODE,
        })) .on('error', gutil.log)
        .pipe(gulp.dest(DST));
});

gulp.task('png', function(done){
    var files = sh.ls('svg/2png/*.svg');
    var count = 0;
    for(var i = 0; i < files.length; i++){
        count++;
        svgAux({
            done      : function(){ if(!--count) done(); },
            input     : files[i],
            output    : DST,
            valid     : /xx\w+/,
            cut       : 2,
            cmd       : '-e ',
            extension : '.png',
            replace   : [{from: '#f2f2f2', to: 'none'}],
        });
    }
});

gulp.task('icon', function(){
    return gulp.src('svg/icons/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: DEVMODE
            }
        }))
        .pipe(svgng({ filename: 'mdicons.svg' }))
        .pipe(gulp.dest(DST));
});

function svgAux(ops){
    if(!sh.which('inkscape')){
        gutil.log('OOps! Inkscape must be in your path');
    }
    else{
        var tmp = Math.random().toString(36).substr(7) + '.svg'
        sh.cp(ops.input, tmp);
        for(var i = 0; i < ops.replace.length; i++){
            sh.sed('-i', ops.replace[i].from, ops.replace[i].to, tmp);
        }
        sh.exec('inkscape -z -S ' + tmp, {silent: true}, function(code, data){
            var name = /^([^\n,]+)/gm;
            var m, count = 0;

            do{
                m = name.exec(data);
                if(m){
                    if(ops.valid.test(m[1])){
                        (function(name){
                            count++;
                            sh.exec('inkscape -z -d 90 ' + ops.cmd + ops.output + name + ops.extension + ' -j -i ' +
                                                                    m[1] + ' ' + tmp, {silent: true}, function(){
                                gutil.log('Extracted: ' + ops.output + name + ops.extension);
                                if(!--count){
                                    sh.rm(tmp);
                                    ops.done();
                                }
                            });
                        })(m[1].substring(ops.cut));
                    }
                }
            } while(m);

            if(!count){
                sh.rm(tmp);
                ops.done();
            }
        });
    }
}
