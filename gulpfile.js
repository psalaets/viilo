'use strict';
var gulp = require('gulp');//local
var sass = require('gulp-sass'); // Ruby sass
var autoprefix = require('gulp-autoprefixer'); // autoprefix
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

var paths = {
    styles: 'styles/main.scss',
    dist: 'public/'
};

gulp.task('sass', function () {
  gulp.src(paths.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: ['> 1%', 'last 2 versions', 'IE 10'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
    gulp.watch([paths.styles], ['sass']);
});

gulp.task('build', ['sass']);

gulp.task('default', ['serve']);

gulp.task('serve', ['watch'], function() {
    // give server a little time to come up before doing browser-sync stuff
    var delay = 750;

    nodemon({
        script: 'server.js',
        // extensions to watch
        ext: 'js hbs css'
    }).on('restart', function() {
        // refresh browsers any time server restarts
        setTimeout(function() {
            browserSync.reload();
        }, delay);
    }).once('start', function() {
        setTimeout(function() {
            browserSync.init({
                proxy: 'localhost:8080',
                open: false
            });
        }, delay);
    });
});
