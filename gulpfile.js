var gulp       = require('gulp');
var coffee     = require('gulp-coffee');
var sass       = require('gulp-sass');
var sh         = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var gutil      = require('gulp-util');
var uglify     = require('gulp-uglify');
var yaml       = require('gulp-yaml');
var pug        = require('gulp-pug');
var dust       = require('gulp-dust');
var concat     = require('gulp-concat');


var DST    = 'tagged/';
var VENDOR = [
    './bower_components/dustjs-linkedin/dist/dust-core.min.js',
    './bower_components/elasticlunr.js/elasticlunr.min.js',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/Materialize/dist/js/materialize.min.js',
    './bower_components/Materialize/dist/css/materialize.min.css',
    './bower_components/Materialize/dist/font',
    './bower_components/materialize-tags/dist/js/materialize-tags.min.js',
    './bower_components/materialize-tags/dist/css/materialize-tags.min.css',
];


var DEVMODE = true;


gulp.task('default', ['sass', 'coffee', 'pug', 'yaml', 'dust'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
    gulp.watch('pug/**/*.pug', ['pug']);
    gulp.watch(['manifest.yaml', '_locales/**/*.yaml'], ['yaml']);
    gulp.watch('dust/*.dust', ['dust']);
});

gulp.task('dist', function(done){
    DEVMODE = false;
    gulp.start('build');
    done();
});

gulp.task('build', ['vendor', 'sass', 'coffee', 'pug', 'yaml', 'dust', 'png']);

gulp.task('vendor', function(done){
    sh.mkdir('-p', DST+'/lib/');
    for(var i=0; i < VENDOR.length; i++){
        sh.cp('-fr', VENDOR[i], DST+'/lib/');
    }
    done();
});

gulp.task('dust', function(){
    return gulp.src('dust/*.dust')
        .pipe(dust()) .on('error', dealWithError)
        .pipe(concat('templates.js'))
        .pipe(DEVMODE ? gutil.noop() : uglify()) .on('error', dealWithError)
        .pipe(gulp.dest(DST));
});

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: DEVMODE ? 'compact' : 'compressed'
        })) .on('error', dealWithError)
        .pipe(gulp.dest(DST));
});

gulp.task('coffee', function() {
    return gulp.src('coffee/*.coffee')
        .pipe(DEVMODE ? sourcemaps.init() : gutil.noop())
        .pipe(coffee({ bare: false })) .on('error', dealWithError)
        .pipe(DEVMODE ? sourcemaps.write() : gutil.noop())
        .pipe(DEVMODE ? gutil.noop() : uglify()) .on('error', dealWithError)
        .pipe(gulp.dest(DST));
});

gulp.task('pug', function() {
    return gulp.src('pug/*.pug')  //oops!
        .pipe(pug({
            locals: {},
            client: false,
            pretty: DEVMODE,
        })) .on('error', dealWithError)
        .pipe(gulp.dest(DST));
});

// gulp.task('template', function() {
//     return gulp.src('pug-cli/*.pug')  //oops!
//         .pipe(pug({
//             locals: {},
//             client: true,
//             compileDebug: false,
//             pretty: DEVMODE,
//         })) .on('error', dealWithError)
//         .pipe(concat('templates-pug.js'))
//         // .pipe(DEVMODE ? gutil.noop() : uglify()) .on('error', dealWithError)
//         .pipe(uglify()) .on('error', dealWithError)
//         .pipe(gulp.dest(DST));
// });

gulp.task('yaml', function(){
    return gulp.src(['manifest.yaml', '_locales/**/*.yaml'], {base: '.'})
        .pipe(yaml({
            space: DEVMODE ? 4 : 0
        }))
        .pipe(gulp.dest(DST));
});

gulp.task('png', function(done){
    var files = sh.ls('svg/2png/*.svg');
    var count = 0;
    var aux = function(){ if(!--count) done(); };
    for(var i = 0; i < files.length; i++){
        var dst = DST; //'www/img/' + (/([a-zA-Z_-]+)\.svg$/.exec(files[i]))[1] + '/';
        sh.mkdir('-p', dst);
        count++;
        svgAux({
            done      : aux,
            input     : files[i],
            output    : dst,
            valid     : /xx\w+/,
            cut       : 2,
            cmd       : '-e ',  //NOTE manter o espaco do final!
            extension : '.png',
            replace   : [{from: '#f2f2f2', to: 'none'}],
        });
    }
});


function svgAux(ops){
    if(!sh.which('inkscape')){
        gutil.log('OOps! Inkscape must be in your path');
    }
    else{
        var tmp = Math.random().toString(36).substr(7) + '.svg';
        sh.cp(ops.input, tmp);
        for(var i = 0; i < ops.replace.length; i++){
            sh.sed('-i', ops.replace[i].from, ops.replace[i].to, tmp);
        }
        sh.exec('inkscape -z -S ' + tmp, {silent: true}, function(code, data){
            var objId = /^([^\n,]+)/gm;
            var m, count = 0, total = 0, total2 = 0;

            var aux = function doit(obj){
                if(count >= 3){
                    setTimeout(function(){ doit(obj); }, 300);
                    return;
                }
                count++;
                var name = obj.substring(ops.cut);
                console.log('inkscape -z -d 90 ' + ops.cmd + ops.output + name + ops.extension + ' -j -i ' + obj + ' ' + tmp);
                sh.exec('inkscape -z -d 90 ' + ops.cmd + ops.output + name + ops.extension + ' -j -i ' +
                                                        obj + ' ' + tmp, {silent: true}, function(){
                    count--;
                    if(!--total){
                        gutil.log('Exportados ' + total2 + ' arquivos para: ' + ops.output);
                        sh.rm(tmp);
                        ops.done();
                    }
                });
            };

            do{
                m = objId.exec(data);
                if(m){
                    if(ops.valid.test(m[1])){
                        total++;
                        total2++;
                        aux(m[1]);
                    }
                }
            } while(m);

            if(!total){
                sh.rm(tmp);
                ops.done();
            }
        });
    }
}


function dealWithError(error){
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
}
