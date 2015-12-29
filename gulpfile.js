var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var data = require('gulp-data');

//GET ARGUMENTS FOR BANNER SIZE
var argv = require('yargs').argv;

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var rename = require('gulp-rename');
var concat = require('gulp-concat');

// COMPILING
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var imageMinJpegTran = require('imagemin-jpegtran');
var imageMinPngQuant = require('imagemin-pngquant');

// ZIP UP DIST
var zip = require('gulp-zip');

var pkg = require('./package.json');

//DEFAULT SIZE TO 728x90
var filename = (argv.size) ? argv.size : "728x90";

var dirs = pkg['configs'].directories;

// PREFIX THE DIRECTORIES WITH THE SIZE
dirs.src = filename + "/" + dirs.src;
dirs.dist = filename + "/" + dirs.dist;

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;


// ---------------------------------------------------------------------
// | SRC FILES                                                         |
// ---------------------------------------------------------------------

var src = {
    jade: dirs.src+'/*.jade',
    coffee: dirs.src + '/js.coffee',
    sass: dirs.src + '/css.scss',
    img: filename + "/_img/**"
}


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ], done);
});

gulp.task('copy', [
    'copy:images'
]);

gulp.task('copy:images', function () {
    return gulp.src(src.img)
        .pipe(imagemin({
            progressive: true,
            use: [
                imageMinJpegTran({progessive: true}),
                imageMinPngQuant({quality: '65-80', speed: 4})
            ]
        }))
        .pipe(gulp.dest(dirs.dist + "/images"))
        .pipe(reload({stream: true}));
});

gulp.task('jade', function () {
    var YOUR_LOCALS = {
        size: filename
    };

    return gulp.src(src.jade)
        .pipe(jade({locals: YOUR_LOCALS,pretty:true}))
        .pipe(rename(filename+'.html'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('coffee', function () {
    return gulp.src([
            "_src/coffee/**",
            src.coffee
        ])
        .pipe(concat("concat.coffee"))
        .pipe(coffee({bare: true}))
        .pipe(rename(filename+'.js'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(plugins.uglify({ mangle:true }))
        .pipe(rename(filename+'.min.js'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    return gulp.src(src.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(filename+".css"))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('zip', function () {
    return gulp.src([
            dirs.dist + "/**/*",
            '!' + dirs.dist + "/" + filename + ".zip",
            '!' + dirs.dist + "/" + filename + ".js"
        ])
        .pipe(zip(filename+'.zip'))
        .pipe(gulp.dest(dirs.dist))
});

gulp.task('serve', function () {

    browserSync.init({
        proxy: 'http://localhost:63342/Chuze/'+dirs.dist+'/'+filename+'.html'
    });

    gulp.watch(src.coffee, ['coffee']);
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.img, ['copy:images']);
    gulp.watch(src.jade, ['jade']);

    gulp.watch([
        src.coffee,
        src.sass,
        src.img,
        src.jade
    ], ['zip'])

});


// MAIN FUNCTIONS

gulp.task('build', function (done) {
    runSequence(
        'clean',
        'coffee',
        'sass',
        'copy',
        'jade',
        'zip',
        'serve',
        done);
});

gulp.task('copy-banner', function () {
    return gulp.src([
        filename + "/**/*",
        "!" + filename + "/dist/**/*"
    ])
        .pipe(gulp.dest(argv.newSize))
});

gulp.task('new-banner', function () {
    return gulp.src("_template/**/*")
        .pipe(gulp.dest(filename))
});


gulp.task('default', ['build']);