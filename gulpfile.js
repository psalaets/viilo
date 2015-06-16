'use strict';
var gulp = require('gulp');//local
var sass = require('gulp-sass'); // Ruby sass
var autoprefix = require('gulp-autoprefixer'); // autoprefix
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace')

var paths = {
    styles: 'styles/main.scss',
    dist: 'public/',
    js: 'client/**/*'
};

gulp.task('watchify', function() {
    return makeBundle('watch');
});

gulp.task('browserify', function() {
    return makeBundle();
});

function makeBundle(watch) {
    var b = browserify(watchify.args);

    if (watch) {
        b = watchify(b);
        b.on('update', rebundle);
    }

    b.add('client/app.jsx');
    b.transform('reactify');

    function rebundle() {
        return b.bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(paths.dist));
    }

    return rebundle();
}

gulp.task('sass', function () {
  gulp.src(paths.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: ['> 1%', 'last 2 versions', 'IE 10'],
            cascade: false
        }))
        .pipe(dataPrefixAttributeSelectors())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['watchify'], function() {
    gulp.watch([paths.styles], ['sass']);
});

gulp.task('build', ['sass', 'browserify']);

gulp.task('default', ['serve']);

gulp.task('serve', ['watch'], function() {
    // give server a little time to come up before doing browser-sync stuff
    var delay = 750;

    nodemon({
        script: 'server.js',
        watch: ['server.js', 'lib/', 'views/'],
        // extensions to watch
        ext: 'js hbs'
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

/**
* Creates stream that puts "data-" on the front of attribute selectors to make
* them work with react (it is assumed that the html already has data- prefixes.
*/
function dataPrefixAttributeSelectors() {
    return replace(/\[.+?\]/g, function(match) {
        // trim off square brackets
        var inside = match.slice(1, -1);

        if (needsDataPrefix(inside)) {
            return addDataPrefix(inside);
        } else {
            return match;
        }
    });
}

function needsDataPrefix(inside) {
    var attribute = inside;
    if (attribute.indexOf('=') !== -1) {
        // it has an operator, grab everything before operator
        attribute = inside.split(/[~|^$*]?=/)[0];
    }

    // needs data- prefix if it's not an html attribute and doesn't already have data- prefix
    return !isHtmlAttribute(attribute) && attribute.indexOf('data-') === -1;
}

function addDataPrefix(inside) {
    return '[data-' + inside + ']';
}

// From https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
function isHtmlAttribute(attribute) {
  return [
    "hidden",
    "high",
    "href",
    "hreflang",
    "http-equiv",
    "icon",
    "id",
    "ismap",
    "itemprop",
    "keytype",
    "kind",
    "label",
    "lang",
    "language",
    "list",
    "loop",
    "low",
    "manifest",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "multiple",
    "name",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "ping",
    "placeholder",
    "poster",
    "preload",
    "pubdate",
    "radiogroup",
    "readonly",
    "rel",
    "required",
    "reversed",
    "rows",
    "rowspan",
    "sandbox",
    "spellcheck",
    "scope",
    "scoped",
    "seamless",
    "selected",
    "shape",
    "size",
    "sizes",
    "span",
    "src",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "style",
    "summary",
    "tabindex",
    "target",
    "title",
    "type",
    "usemap",
    "value",
    "width",
    "wrap",
    "border",
    "buffered",
    "challenge",
    "charset",
    "checked",
    "cite",
    "class",
    "code",
    "codebase",
    "color",
    "cols",
    "colspan",
    "content",
    "contenteditable",
    "contextmenu",
    "controls",
    "coords",
    "data",
    "datetime",
    "default",
    "defer",
    "dir",
    "dirname",
    "disabled",
    "download",
    "draggable",
    "dropzone",
    "enctype",
    "for",
    "form",
    "formaction",
    "headers",
    "height",
    "accept",
    "accept-charset",
    "accesskey",
    "action",
    "align",
    "alt",
    "async",
    "autocomplete",
    "autofocus",
    "autoplay",
    "autosave",
    "bgcolor"
  ].indexOf(attribute) !== -1;
}