var gulp = require('gulp');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var svgng = require('gulp-svg-ngmaterial');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var svgmin = require('gulp-svgmin');


var DEVMODE = true;
var DST = 'tagged/';


gulp.task('default', ['sass', 'coffee', 'jade', 'svg'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch('svg/single/**/*.svg', ['svg']);
});

gulp.task('dist', function(){
    DEVMODE = false;
    gulp.start('build');
});

gulp.task('build', ['sass', 'coffee', 'jade', 'svg', 'icon']);

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

gulp.task('icon', function(done){
    var files = sh.ls('svg/*.svg');
    console.log(files)
    svgAux({
        done: done,
        input: 'icons.svg',
        output: DST,
        valid: /icon[0-9]|teste/,
        cur: 0,
        cmd: '-e ',
        extension: '.png',
        color: ['#f2f2f2', 'none'],
    });
});

gulp.task('svg', function(){
    return gulp.src('svg/single/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: DEVMODE
            }
        }))
        .pipe(svgng({ filename: 'icons.svg' }))
        .pipe(gulp.dest(DST));
});

// gulp.task('break', function(done){
//     sh.mkdir('-p', 'svg/single/_tmp/');
//     sh.rm('svg/single/_tmp/*.svg');
//     svgAux({
//         done: done,
//         input: 'svg/mixed/beleuza.svg',
//         output: 'svg/single/_tmp/',
//         valid: /xx\w+/,
//         cut: 2,
//         cmd: '-l ',
//         extension: '.svg',
//         color: ['#f2f2f2', 'none'],
//     });
// });

function svgAux(ops){
    if(!sh.which('inkscape')){
        gutil.log('OOps! Inkscape must be in your path');
    }
    else{
        var tmp = Math.random().toString(36).substr(7) + '.svg'
        sh.cp(ops.input, tmp);
        if(ops.color){
            sh.sed('-i', ops.color[0], ops.color[1], tmp);
        }
        sh.exec('inkscape -z -S ' + tmp, {silent: true}, function(code, data){
            var name = /^([^\n,]+)/gm;
            var m;
            var count = 0;

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
