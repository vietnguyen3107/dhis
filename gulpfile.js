var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    notify = require('gulp-notify'),
    source = require('vinyl-source-stream');

var dirs = {
    SRC_DIR: './src/',
    DEST_DIR: './assets/js/',
};

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: 'Compile error',
        message: '<%= error.message %>'
    }).apply(this, args);

    this.emit('end');
}

function build(bundle) {
    bundle = bundle.bundle();
    bundle
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest(dirs.DEST_DIR))
        .pipe(notify('Compile completed'));
}

gulp.task('build', function() {
    var jsxFile = dirs.SRC_DIR + 'app.jsx',
        bundle = browserify(jsxFile, {
            extensions: ['.jsx'],
            transform: ['reactify'],
            cache: {},
            packageCache: {}
        });

    build(bundle);

    bundle = watchify(bundle);
    bundle.on('update', function() {
        build(bundle);
    });
});

gulp.task('default', ['build']);