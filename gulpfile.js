'use strict';

var gulp = require('gulp'),
watch = require('gulp-watch'),
prefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
rigger = require('gulp-rigger'),
cleanCSS = require('gulp-clean-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
rimraf = require('rimraf'),
browserSync = require("browser-sync"),
reload = browserSync.reload;

var path = {
  build: {
      html: 'dist/',
      js: 'dist/js/',
      css: 'dist/css/',
      img: 'dist/img/',
      fonts: 'dist/fonts/',
      video: 'dist/video/',
  },
  src: {
      html: 'src/*.html',
      js: 'src/js/main.js',
      style: 'src/style/main.scss',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*',
      video: 'src/video/**/*.*'
  },
  watch: {
      html: 'src/**/*.html',
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*',
      video: 'src/video/**/*.*',
  },
  clean: './dist'
};

var config = {
  server: {
      baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

gulp.task('html', function () {
  gulp.src(path.src.html)
      .pipe(rigger())
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});

gulp.task('js', function () {
  gulp.src(path.src.js)
      .pipe(rigger())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({stream: true}));
});

gulp.task('style', function () {
  gulp.src(path.src.style)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({stream: true}));
});

gulp.task('image', function () {
  gulp.src(path.src.img)
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
          interlaced: true
      }))
      .pipe(gulp.dest(path.build.img))
      .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});

gulp.task('video', function() {
    gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
  });

gulp.task('build', [
  'html',
  'js',
  'style',
  'fonts',
  'image',
  'video'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
      gulp.start('html');
  });
  watch([path.watch.style], function(event, cb) {
      gulp.start('style');
  });
  watch([path.watch.js], function(event, cb) {
      gulp.start('js');
  });
  watch([path.watch.img], function(event, cb) {
      gulp.start('image');
  });
  watch([path.watch.fonts], function(event, cb) {
      gulp.start('fonts');
  });
  watch([path.watch.video], function(event, cb) {
    gulp.start('video');
});
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);