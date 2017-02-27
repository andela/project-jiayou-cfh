var gulp = require('gulp');
var browserSync = require('browser-sync');
var coveralls = require('gulp-coveralls');
var jasmine = require('gulp-jasmine');
var cover = require('gulp-coverage');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var istanbul = require('gulp-istanbul');
require('dotenv').config();
// Configuration

gulp.task('watch', function () {
  gulp.watch(['public/css/common.scss',
    'public/css/views/articles.scss'
  ], ['sass']);

  gulp.watch(['public/js/**', 'app/**/*.js'], ['jshint'])
        .on('change', browserSync.reload);

  gulp.watch('public/views/**').on('change', browserSync.reload);

  gulp.watch('public/css/**', ['sass'])
        .on('change', browserSync.reload);

  gulp.watch('app/views/**', ['jade'])
        .on('change', browserSync.reload);
});

//setup jshint
gulp.task('jshint', function () {
  return gulp.src([
    'gulpfile.js',
    'app/**/*.js',
    'test/**/*.js',
    'public/js/**/*.js'
  ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

//setup nodemon
gulp.task('nodemon', function (done) {
  var started = false;
  return nodemon({
    script: 'server.js',
    ext: 'js',
  }).on('start', function () {
    if (!started) {
      done();
      started = true;
    }
  });
});

//setup server
gulp.task('server', ['nodemon'], function () {
  browserSync.init({
    proxy: 'http://localhost:' + process.env.PORT || 5000,
    port: 3000,
    ui: {
      port: 3001
    },
    reloadOnRestart: true
  });
});

gulp.task('coveralls', ['coverage'], function () {
    gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});


gulp.task('pre-test', function () {
    return gulp.src('./app/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());

});

gulp.task('coverage', ['pre-test'], function () {
  return gulp.src('test/**/*.js')
        .pipe(jasmine())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

//setup sass
gulp.task('sass', function () {
  return gulp.src('public/css/common.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

//install bower
gulp.task('install', function () {
  return bower('./bower_components')
        .pipe(gulp.dest('./public/lib'));
});

//Default task(s).
gulp.task('default', ['install', 'jshint', 'server', 'watch', 'sass'], function (done) {
  done();
});

gulp.task('test', ['coveralls'], function (done) {
  done();
});
