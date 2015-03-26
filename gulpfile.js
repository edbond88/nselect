'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    opn = require('opn');

var path = {
    build: {
        all: 'build'
    },
    src: {
        html: 'src/*.html',
        js: 'src/*.js',
        style: 'src/*.sass'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/**/*.js',
        style: 'src/**/*.sass'
    },
    clean: './build'
};

var server = {
    host: 'localhost',
    port: '9000'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.all))
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(plumber())
        .pipe(gulp.dest(path.build.all))
        .pipe(rename(function (pth) {
            pth.basename += ".min";
        }))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(path.build.all))
        .pipe(connect.reload());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sass({
            indentedSyntax: true
        }))
        .pipe(prefixer('last 15 versions'))
        .pipe(gulp.dest(path.build.all))
        .pipe(connect.reload());
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build'
]);

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/build/demo.html');
});


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
