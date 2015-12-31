var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

//GET ARGUMENTS FOR BANNER SIZE
var argv = require('yargs').argv;

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var rename = require('gulp-rename');
var replace = require('gulp-replace-task');
var concat = require('gulp-concat');
var del = require('del');

// COMPILING
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var nano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var imageMinJpegTran = require('imagemin-jpegtran');
var imageMinPngQuant = require('imagemin-pngquant');

// ZIP UP DIST
var zip = require('gulp-zip');

var pkg = require('./package.json');

//DEFAULT SIZE TO 728x90
var vals = ["Banner",728,90];
var filename = (argv.banner) ? argv.banner : "Banner_728x90";
var newVals = ["Banner",728,90];
var newFilename = (argv.newBanner) ? argv.newBanner : "Banner_728x90";
var bannerType = "in-page";

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
    jade: dirs.src+'/'+filename+'.jade',
    coffee: dirs.src + '/'+filename+'.coffee',
    sass: dirs.src + '/'+filename+'.scss',
    img: filename + "/_img/**"
}


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    del([
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
        .pipe(nano())
        .pipe(rename(filename+".min.css"))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('zip', function () {
    return gulp.src([
            dirs.dist + "/**/*",
            '!' + dirs.dist + "/" + filename + ".zip",
            '!' + dirs.dist + "/" + filename + ".js",
            '!' + dirs.dist + "/" + filename + ".css"
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

/**
 * Compile and shrink a banner
 * --size = (banner size to compile) REQUIRED
 **/

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


// COPY BANNER

/**
 * Copy one banner size to a new size
 *
 * --banner (REQUIRED) = Banner to copy. Variables separated by *
 *      Prefix          REQUIRED
 *      Width           REQUIRED
 *      Height          REQUIRED
 *      Exp-Width       REQUIRED FOR EXPANDING AND FLOATING UNITS
 *      Exp-Height      REQUIRED FOR EXPANDING AND FLOATING UNITS
 *
 *      i.e. (--banner=Banner*728*90)
 *
 * --newBanner (REQUIRED) = New Banner. Variables separated by *
 *      Prefix          REQUIRED
 *      Width           REQUIRED
 *      Height          REQUIRED
 *      Exp-Width       REQUIRED FOR EXPANDING AND FLOATING UNITS
 *      Exp-Height      REQUIRED FOR EXPANDING AND FLOATING UNITS
 *
 *      i.e. (--newBanner=Banner*728*90*728*200*0*0)
 *
 * --type (REQUIRED) = in-page, expandable or floating [DEFAULT = in-page]
 *
 **/

gulp.task('copy-banner', function (done) {
    runSequence(
        "cb-move-files",
        "cb-rename",
        "cb-remove-temp",
        done);
});

gulp.task('cb-move-files', function () {

    vals = (argv.banner) ? argv.banner.split("*") : ["Banner","728","90","728","200"];
    newVals = (argv.newBanner) ? argv.newBanner.split("*") : ["Banner","300","250","300","600"];

    newVals[3] = newVals[3] ? newVals[3] : newVals[1]; // FOR EXPANDING AND FLOATING UNITS
    newVals[4] = newVals[4] ? newVals[4] : newVals[2]+100; // FOR EXPANDING AND FLOATING UNITS
    newVals[5] = newVals[5] ? newVals[5] : "0"; // FOR EXPANDING UNITS
    newVals[6] = newVals[6] ? newVals[6] : "0"; // FOR EXPANDING UNITS

    bannerType = (argv.type) ? argv.type : bannerType;

    filename = (bannerType=="in-page") ? vals[0]+"_"+vals[1]+"x"+vals[2] : vals[0]+"_"+vals[1]+"x"+vals[2]+"_exp_"+vals[3]+"x"+vals[4];
    newFilename = (bannerType=="in-page") ?  newVals[0]+"_"+newVals[1]+"x"+newVals[2] : newVals[0]+"_"+newVals[1]+"x"+newVals[2]+"_exp_"+newVals[3]+"x"+newVals[4];

    return gulp.src([
            filename + "/**/*",
            "!" + filename + "/dist/*"
        ])
        .pipe(gulp.dest(newFilename))
});

gulp.task('cb-rename', function () {
    return gulp.src(argv.newSize+"/_src/**/*")
        .pipe(replace({
            patterns: [
                {match: /filename/g,replacement: newFilename}
            ]
        }))
        .pipe(rename(function(path){
            path.basename = newFilename
        }))
        .pipe(gulp.dest(newFilename+"/_src/"))
});

gulp.task('cb-remove-temp', function () {
    return del([
        newFilename+"/_src/"+filename+".*"
    ])
});


// NEW BANNER

/**
 * Create a new banner
 *
 * --banner (REQUIRED) = Variables separated by *  [DEFAULT = Banner*728*90]
 *      Prefix          REQUIRED
 *      Width           REQUIRED
 *      Height          REQUIRED
 *      Exp-Width       REQUIRED FOR EXPANDING AND FLOATING UNITS
 *      Exp-Height      REQUIRED FOR EXPANDING AND FLOATING UNITS
 *      Offset-X        OPTIONAL FOR EXPANDING UNITS
 *      Offset-Y        OPTIONAL FOR EXPANDING UNITS
 *
 *      i.e. (--banner=Banner*728*90*728*200*0*0)
 *
 * --type (REQUIRED) = in-page, expandable or floating [DEFAULT = in-page]
 *
 **/

gulp.task('new-banner', function (done) {
    runSequence(
        "nb-move-files",
        "nb-rename",
        "nb-remove-temp",
        done);
});

gulp.task('nb-move-files', function () {

    vals = (argv.banner) ? argv.banner.split("*") : ["Banner","728","90","728","200","0","0"];
    vals[3] = vals[3] ? vals[3] : vals[1]; // FOR EXPANDING AND FLOATING UNITS
    vals[4] = vals[4] ? vals[4] : vals[2]+100; // FOR EXPANDING AND FLOATING UNITS
    vals[5] = vals[5] ? vals[5] : "0"; // FOR EXPANDING UNITS
    vals[6] = vals[6] ? vals[6] : "0"; // FOR EXPANDING UNITS

    bannerType = (argv.type) ? argv.type : bannerType;

    filename = (bannerType=="in-page") ? vals[0]+"_"+vals[1]+"x"+vals[2] : vals[0]+"_"+vals[1]+"x"+vals[2]+"_exp_"+vals[3]+"x"+vals[4];

    return gulp.src("_template/"+bannerType+"/**/*")
        .pipe(gulp.dest(filename))
});

gulp.task('nb-rename', function () {
    return gulp.src(filename+"/_src/**/*")
        .pipe(replace({
            patterns: [
                {match: /_PREFIX_/g,replacement: vals[0]},
                {match: /_WIDTH_/g,replacement: vals[1]},
                {match: /_HEIGHT_/g,replacement: vals[2]},
                {match: /_EXP_W_/g,replacement: vals[3]},
                {match: /_EXP_H_/g,replacement: vals[4]},
                {match: /_OFFSET-X_/g,replacement: vals[5]},
                {match: /_OFFSET-Y_/g,replacement: vals[6]}
            ]
        }))
        .pipe(rename(function(path){
            path.basename = filename
        }))
        .pipe(gulp.dest(filename+"/_src"))
});

gulp.task('nb-remove-temp', function () {
    return del(filename+"/_src/template.*")
});


gulp.task('default', ['build']);