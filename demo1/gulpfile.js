var gulp = require('gulp');
gulp.task('default', ['lint', 'tsc', 'tsc-tests']);
var tslint = require('gulp-tslint');
gulp.task('lint', function() {
 return gulp.src([
 './source/ts/**/**.ts', './test/**/**.test.ts'
 ]).pipe(tslint())
 .pipe(tslint.report('verbose'));
});

var ts = require('gulp-typescript');
var tsProject = ts.createProject({
 removeComments : true,
 noImplicitAny : true,
 target : 'ES3',
 module : 'commonjs',
 declarationFiles : false
});

gulp.task('tsc', function() {
return gulp.src('./source/ts/**/**.ts')
 .pipe(ts(tsProject))
 .js.pipe(gulp.dest('./temp/source/js'));
});

var tsTestProject = ts.createProject({
 removeComments : true,
 noImplicitAny : true,
 target : 'ES3',
 module : 'commonjs',
 declarationFiles : false
});

gulp.task('tsc-tests', function() {
 return gulp.src('./test/**/**.test.ts')
 .pipe(ts(tsTestProject ))
 .js.pipe(gulp.dest('./temp/test/'));
});

var browserify = require('browserify'),
 transform = require('vinyl-transform'),
 uglify = require('gulp-uglify'),
 sourcemaps = require('gulp-sourcemaps');
var browserified = transform(function(filename) {
 var b = browserify({ entries: filename, debug: true });
 return b.bundle();
});

gulp.task('bundle-js', function () {
 return gulp.src('./temp/source/js/main.js')
 .pipe(browserified)
 .pipe(sourcemaps.init({ loadMaps: true }))
 .pipe(uglify())
 .pipe(sourcemaps.write('./'))
 .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('bundle-test', function () {
 return gulp.src('./temp/test/**/**.test.js')
 .pipe(browserified)
 .pipe(gulp.dest('./dist/test/'));
});