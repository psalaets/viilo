'use strict';
var gulp = require('gulp');//local
var sass = require('gulp-sass'); // Ruby sass
var autoprefix = require('gulp-autoprefixer'); // autoprefix

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

gulp.task('default', ['watch']);
