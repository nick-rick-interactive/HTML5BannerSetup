var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');

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
var tap = require('gulp-tap');

// COMPILING
var plumber   = require( 'gulp-plumber' );
var beep      = require( 'beepbeep' );
var pug = require('gulp-pug');
var coffee = require('gulp-coffee');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');

// PostCSS
var postcss = require("gulp-postcss");
var nano = require('gulp-cssnano');
var prefix = require('autoprefixer');

// Image
var imagemin = require('gulp-imagemin');
var imageMinPngQuant = require('imagemin-pngquant');
var recompress = require('imagemin-jpeg-recompress');

var clean = require('gulp-clean');

//Plumber Hanlder
var onError = function (err) {
    beep([0, 0, 0]);
    gutil.log(gutil.colors.red(err));
};

// ZIP UP DIST
var zip = require('gulp-zip');

var pkg = require('./package.json');

//DEFAULT SIZE TO 728x90
var vals = ["Banner",728,90];
var filename = (argv.banner) ? argv.banner : "Banner_728x90";
var newVals = ["Banner",728,90];
var newFilename = (argv.newBanner) ? argv.newBanner : "Banner_728x90";
var bannerType = "in-page";
var bannerLang = "js";

var dirs = pkg['configs'].directories;

// PREFIX THE DIRECTORIES WITH THE SIZE
dirs.src = filename + "/" + dirs.src;
dirs.dist = filename + "/" + dirs.dist;

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;


//GIT RELEASE
var git = require('gulp-git');
var excludeGitignore = require('gulp-exclude-gitignore');


// ---------------------------------------------------------------------
// | SRC FILES                                                         |
// ---------------------------------------------------------------------

var directories;
var taskCount;
var src = {
    pug: dirs.src+'/'+filename+'.pug',
    coffee: dirs.src + '/'+filename+'.coffee',
    ts: dirs.src + '/'+filename+'.ts',
    sass: dirs.src + '/'+filename+'.scss',
    config: dirs.src + '/'+filename+'.json',
    img: filename + "/_img/**"
}
var config;
var varInjection;


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
    var qual = (config.quality) ? config.quality : 60;
    return gulp.src(src.img)
        .pipe(imagemin({
            progressive: true,
            use: [
                recompress({
                    loops:3,
                    min:qual,
                    max:qual
                }),
                imageMinPngQuant({quality: qual+'-'+qual, speed: 4})
            ]
        }))
        .pipe(gulp.dest(dirs.dist + ""))
        .pipe(reload({stream: true}));
});

gulp.task('pug', function () {
    var img1 = new RegExp("images/","g");
    var img2 = new RegExp("_img/","g");

    return gulp.src(src.pug)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(pug({locals: varInjection,pretty:true}))
        .pipe(replace({
            patterns: [
                {match: img1,replacement: ""},
                {match: img2,replacement: ""}
            ]
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('ts', function () {
    var tsProject = ts.createProject('tsconfig.json');
    config = require("./"+src.config);
    varInjection = {
        config: config,
        info: pkg,
        size: filename
    };
    var bannerClass;
    if(config['type']=="adwords"){
        bannerClass = (config['lang']=="js") ? "banner_aw" : "banner_aw_canvas";
    }else{
        bannerClass = (config['lang']=="js") ? "banner" : "banner_canvas";
        bannerClass = (config['lang']=="canvas_sf") ? "banner_canvas_sf" : bannerClass;
    }
    var tsResult = gulp.src([
        "_src/ts/"+bannerClass+".ts",
        src.ts
    ])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat("concat.ts"))
        .pipe(tsProject())
    return tsResult.js
        .pipe(rename(filename+'.js'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(plugins.uglify({ mangle:true }))
        .pipe(rename(filename+'.min.js'))
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    var img1 = new RegExp("images/","g");
    var img2 = new RegExp("_img/","g");
    var inject = new RegExp("//w_h_inject","g");
    var plugs = [
        prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }),
        require('cssgrace')
    ]
    return gulp.src(src.sass)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(replace({
            patterns: [
                {match: inject,replacement: "$width:"+config.width+"px; $height:"+config.height+"px; $prefix:"+config.prefix+";"}
            ]
        }))
        .pipe(sass({
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(postcss(plugs))
        .pipe(replace({
            patterns: [
                {match: img1,replacement: ""},
                {match: img2,replacement: ""}
            ]
        }))
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
        .pipe(gulp.dest("zipped"))
});

gulp.task('includes', function () {
    return gulp.src('./includes/*.js')
        .pipe(gulp.dest(dirs.dist))
});

gulp.task('serve', function () {

    console.log(path.basename(path.dirname()));
    browserSync.init({
        proxy: 'http://localhost:63342/'+path.basename(__dirname)+'/'+dirs.dist+'/index.html'
    });

    gulp.watch("./_src/ts/**", ['ts']);
    gulp.watch(src.ts, ['ts']);
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.img, ['copy:images']);
    gulp.watch(src.pug, ['pug']);

    gulp.watch([
        src.ts,
        src.sass,
        src.img,
        src.pug
    ], ['zip'])

});


// MAIN FUNCTIONS

/**
 * Compile and shrink a banner then see on Browser Sync
 *
 * --banner (REQUIRED) = Banner to compile. Folder name
 *
 *   i.e. (--banner=Banner_728x90)
 *
 **/

gulp.task('build', function (done) {

    runSequence(
        'clean',
        'ts',
        'sass',
        'copy',
        'pug',
        'includes',
        'zip',
        'serve',
        done);
});


// MAIN FUNCTIONS

/**
 * Compile, shrink and package all banners
 *
 * --prefix (REQUIRED) = Prefix for all banners to be compiled
 *
 *   i.e. (--prefix=Banner)
 *
 **/

gulp.task('package', function () {

    taskCount = 0;
    directories = [];

    function runTasks(){
        taskCount++;
        if(taskCount!=directories.length+1){

            filename = directories[taskCount-1];

            dirs.src = filename + "/_src";
            dirs.dist = filename + "/dist";

            src = {
                pug: dirs.src+'/'+filename+'.pug',
                ts: dirs.src + '/'+filename+'.ts',
                sass: dirs.src + '/'+filename+'.scss',
                img: filename + "/_img/**",
                config: dirs.src + '/'+filename+'.json'
            }

            config = require("./"+src.config);
            varInjection = {
                config: config,
                info: pkg,
                size: filename
            };


            runSequence(
                'clean',
                'ts',
                'sass',
                'copy',
                'pug',
                'includes',
                'zip',
                runTasks);
        }else{
            runSequence(
                'zipAll'
            )
        }
    }

    runSequence(
        'getDirectories',
        'eraseZips',
        runTasks
    )
});

gulp.task('getDirectories',function(){
    return gulp.src([argv.prefix+"_*","!"+argv.prefix+"_*.zip"])
        .pipe(tap(function(file,t){
            directories.push(path.basename((file.path)))
        }));
})

gulp.task('eraseZips',function(){
    return gulp.src("./zipped")
        .pipe(clean())
})

gulp.task('zipAll',function(){
    console.log('zipping all');
    return gulp.src("./zipped/*")
        .pipe(zip("./"+argv.prefix+'.zip'))
        .pipe(gulp.dest("./"))
})


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
        "cb-json",
        "cb-remove-temp",
        done);
});

gulp.task('cb-move-files', function () {

    vals = (argv.banner) ? argv.banner.split("*") : ["Banner","728","90","728","200"];
    newVals = (argv.newBanner) ? argv.newBanner.split("*") : ["Banner","300","250","300","600"];

    newVals[3] = newVals[3] ? newVals[3] : newVals[1]; // FOR EXPANDING AND FLOATING UNITS
    newVals[4] = newVals[4] ? newVals[4] : Number(newVals[2])+100; // FOR EXPANDING AND FLOATING UNITS
    newVals[5] = newVals[5] ? newVals[5] : "0"; // FOR EXPANDING UNITS
    newVals[6] = newVals[6] ? newVals[6] : "0"; // FOR EXPANDING UNITS

    bannerType = (argv.type) ? argv.type : bannerType;
    bannerLang = (argv.lang) ? argv.lang : bannerLang;

    filename = (bannerType=="in-page") ? vals[0]+"_"+vals[1]+"x"+vals[2] : vals[0]+"_"+vals[1]+"x"+vals[2]+"_exp_"+vals[3]+"x"+vals[4];
    newFilename = (bannerType=="in-page") ?  newVals[0]+"_"+newVals[1]+"x"+newVals[2] : newVals[0]+"_"+newVals[1]+"x"+newVals[2]+"_exp_"+newVals[3]+"x"+newVals[4];

    return gulp.src([
        filename + "/**/*",
        "!" + filename + "/dist/**/*"
    ])
        .pipe(gulp.dest(newFilename))
});

gulp.task('cb-rename', function () {
    var re = new RegExp(filename,"g");
    var reX = new RegExp(vals[1]+"x"+vals[2],"g");
    var reC = new RegExp(vals[1]+", "+vals[2],"g");
    return gulp.src([newFilename+"/_src/**/*"])
        .pipe(replace({
            patterns: [
                {match: re,replacement: newFilename},
                {match: reX,replacement: newVals[1]+"x"+newVals[2]},
                {match: reC,replacement: newVals[1]+", "+newVals[2]}
            ]
        }))
        .pipe(rename(function(path){
            path.basename = newFilename
        }))
        .pipe(gulp.dest(newFilename+"/_src/"));
});

gulp.task('cb-json', function () {
    var reP = new RegExp(vals[0],"g");
    var reW = new RegExp(vals[1],"g");
    var reH = new RegExp(vals[2],"g");
    return gulp.src(newFilename+"/_src/*.json")
        .pipe(replace({
            patterns: [
                {match: reP,replacement: newVals[0]},
                {match: reW,replacement: newVals[1]},
                {match: reH,replacement: newVals[2]}
            ]
        }))
        .pipe(rename(function(path){
            path.basename = newFilename
        }))
        .pipe(gulp.dest(newFilename+"/_src/"));
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
 * --type (REQUIRED) = adwords, in-page, expandable or floating [DEFAULT = in-page]
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
    vals[4] = vals[4] ? vals[4] : Number(vals[2])+100; // FOR EXPANDING AND FLOATING UNITS
    vals[5] = vals[5] ? vals[5] : "0"; // FOR EXPANDING UNITS
    vals[6] = vals[6] ? vals[6] : "0"; // FOR EXPANDING UNITS

    bannerType = (argv.type) ? argv.type : bannerType;
    bannerLang = (argv.lang) ? argv.lang : bannerLang;

    filename = (bannerType=="in-page") ? vals[0]+"_"+vals[1]+"x"+vals[2] : vals[0]+"_"+vals[1]+"x"+vals[2]+"_exp_"+vals[3]+"x"+vals[4];

    return gulp.src("_template/"+bannerLang+"/"+bannerType+"/**/*")
        .pipe(gulp.dest(filename))
});

gulp.task('nb-rename', function () {
    var reX = new RegExp(vals[1]+"x"+vals[2],"g");
    var reC = new RegExp(vals[1]+", "+vals[2],"g");
    return gulp.src(filename+"/_src/**/*")
        .pipe(replace({
            patterns: [
                {match: /_PREFIX_/g,replacement: vals[0]},
                {match: /_WIDTH_/g,replacement: vals[1]},
                {match: /_HEIGHT_/g,replacement: vals[2]},
                {match: /_EXP_W_/g,replacement: vals[3]},
                {match: /_EXP_H_/g,replacement: vals[4]},
                {match: /_OFFSET-X_/g,replacement: vals[5]},
                {match: /_OFFSET-Y_/g,replacement: vals[6]},
                {match: /_TYPE_/g,replacement: bannerType},
                {match: /_LANG_/g,replacement: bannerLang},
                {match: reX,replacement: newVals[1]+"x"+newVals[2]},
                {match: reC,replacement: newVals[1]+", "+newVals[2]}
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


gulp.task('deploy', function(done) {
    runSequence(
        "git-commit",
        "git-push",
        done);
});
gulp.task('git-commit', function() {
    return gulp.src('./*')
        .pipe(excludeGitignore())
        .pipe(git.commit('gulp auto commit'));
});
gulp.task('git-push', function() {
    git.push('origin', 'master')
});


gulp.task('default', ['build']);