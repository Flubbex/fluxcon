var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
    return gulp.src('source/index.js')
        .pipe(browserify())
        .pipe(gulp.dest('dist'))
});

gulp.task('compress',['build'], function (cb) {
        return gulp.src('dist/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/ugly'))
});

gulp.task('publish',['compress'],function (cb) {
        return gulp.src('dist/ugly/*.js')
        .pipe(gulp.dest('docs/js'))
});
gulp.task('publish-nocompress',["build"],function (cb) {
        return gulp.src('dist/*.js')
        .pipe(gulp.dest('docs/js'))
});

gulp.task("package",["publish"]);

gulp.task("package-nocompress",["publish-nocompress"]);

gulp.task('watch',['package'],function () {
	return gulp.watch("source/**/*.js",["watch"]);
});

gulp.task('watch-nocompress',['package-nocompress'],function () {
	return gulp.watch("source/**/*.js",["watch-nocompress"]);
});


gulp.task('default', ['package']);

