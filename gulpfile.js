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

function buildApp(bundle) {
    bundle = bundle.bundle();
    bundle
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest(dirs.DEST_DIR))
        .pipe(notify('Compile completed'));
}


gulp.task('buildApp', function() {
    var jsxFile = dirs.SRC_DIR + 'app.jsx',
        bundle = browserify(jsxFile, {
            extensions: ['.jsx'],
            transform: ['reactify'],
            cache: {},
            packageCache: {}
        });

    buildApp(bundle);

    bundle = watchify(bundle);
    bundle.on('update', function() {
        buildApp(bundle);
    });
});


function buildReception(bundle) {
    bundle = bundle.bundle();
    bundle
        .on('error', handleErrors)
        .pipe(source('reception.js'))
        .pipe(gulp.dest(dirs.DEST_DIR))
        .pipe(notify('Compile completed'));
}


gulp.task('buildReception', function() {
    var jsxFile = dirs.SRC_DIR + 'reception.jsx',
        bundle = browserify(jsxFile, {
            extensions: ['.jsx'],
            transform: ['reactify'],
            cache: {},
            packageCache: {}
        });

    buildReception(bundle);

    bundle = watchify(bundle);
    bundle.on('update', function() {
        buildReception(bundle);
    });
});

function buildRecension(bundle) {
    bundle = bundle.bundle();
    bundle
        .on('error', handleErrors)
        .pipe(source('recension.js'))
        .pipe(gulp.dest(dirs.DEST_DIR))
        .pipe(notify('Compile completed'));
}


gulp.task('buildRecension', function() {
    var jsxFile = dirs.SRC_DIR + 'recension.jsx',
        bundle = browserify(jsxFile, {
            extensions: ['.jsx'],
            transform: ['reactify'],
            cache: {},
            packageCache: {}
        });

    buildRecension(bundle);

    bundle = watchify(bundle);
    bundle.on('update', function() {
        buildRecension(bundle);
    });
});


gulp.task('build', ['buildApp', 'buildReception', 'buildRecension']);

gulp.task('default', ['build']);