var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var Server = require('karma').Server;
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv;

gulp.task('clean', gulp.series(function (cb) {
    return del(['tmp', 'dist'], cb);
}));

gulp.task('build-css', gulp.series('clean', function () {
    return gulp.src('./styles/*')
        .pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./dist'));
}));

gulp.task('build-tmp', gulp.series('build-css', function () {
    var builderStream = buildTemp('src/builder/', 'mwFormBuilder');
    var viewerStream = buildTemp('src/viewer/', 'mwFormViewer');
    var utilsStream = buildTemp('src/utils/', 'mwFormUtils');
    return merge(builderStream, viewerStream, utilsStream);
}));

gulp.task('default', gulp.series('build-tmp', function () {
    var i18n = gulp.src('i18n/**/*.json').pipe(plugins.jsonminify()).pipe(gulp.dest('dist/i18n/'));

    var builderStream = buildModuleStream('form-builder', 'mwFormBuilder');
    var viewerStream = buildModuleStream('form-viewer', 'mwFormViewer');
    var utilsStream = buildModuleStream('form-utils', 'mwFormUtils');
    return merge(builderStream, viewerStream, utilsStream, i18n);
}));

gulp.task('watch', gulp.series(function() {
    return gulp.watch(['i18n/**/*.json','./src/**/*.html', './styles/*.*css', 'src/**/*.js'], gulp.series('default'));
}));

function buildTemp(src, moduleName) {

    var tmpDir = 'tmp/'+moduleName;

    var copy = gulp.src(src + '**/*').pipe(gulp.dest(tmpDir));



    return merge(copy);
}

function buildTemplates(src, moduleName, dest, filePrefix){
    return gulp.src(src + '**/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(plugins.angularTemplatecache({
            module: moduleName,
            filename: filePrefix+'-tpls.min.js'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest));
}

function buildModuleStream(destPrefix, moduleName) {

    var tmpDir = 'tmp/'+moduleName;

    var bootstrapTemplates = buildTemplates(tmpDir+'/templates/bootstrap/', moduleName, 'dist', destPrefix+'-bootstrap');
    var materialTemplates = buildTemplates(tmpDir+'/templates/material/', moduleName, 'dist', destPrefix+'-material');

    var module =  gulp.src(tmpDir + '/**/*.js')
        .pipe(plugins.plumber({ errorHandler: onError }))
        .pipe(plugins.angularFilesort())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat(destPrefix+'.js'))
        .pipe(gulp.dest('dist'));
    var development = (argv.dev === undefined) ? false : true;
    if(!development){
        module.pipe(plugins.uglify())
            .pipe(plugins.stripDebug())
            .pipe(plugins.concat(destPrefix+'.min.js'))
            .pipe(gulp.dest('dist'));
    }



    return merge(module, bootstrapTemplates, materialTemplates);
}

gulp.task('test', gulp.series(function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    }).start();
}));

/**
 * Serve
*/

// error function for plumber
var onError = function (err) {
  console.log(err);
  this.emit('end');
};


var browserSyncInit = function(baseDir){
    browserSync.init({
        server: {
            baseDir: baseDir,
            index: "dang-ky-trung-bay.html",
            routes: {
                "/bower_components": "bower_components",
                "/vendor": "vendor",
                "/dist": "dist",
                "/i18n": "i18n"
            }
        },
        port: 8080,
        open: false, //'local',
        browser: ["chrome"]
    });
};

var gulpWatch = function(){
    gulp.watch(['i18n/**/*.json', './src/**/*.html', './styles/*.*css', 'src/**/*.js'], gulp.series('default-watch'));
};

gulp.task('default-watch', gulp.series('default', ()=>{ /*browserSync.reload()*/ }));

gulp.task('serve', gulp.series('default', ()=>{
    browserSyncInit("app-material");
    gulpWatch();
}));

gulp.task('serve-bootstrap', gulp.series('default', ()=>{
    browserSyncInit("app-bootstrap");
    gulpWatch();
}));
