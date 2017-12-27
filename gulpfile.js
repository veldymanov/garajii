var gulp = require('gulp'),
gulpLoadPlugins = require('gulp-load-plugins'),
del = require('del'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
rev = require('gulp-rev'),
collect = require('gulp-rev-collector'),
revdel = require('gulp-rev-delete-original');

require('dotenv').config();

var $ = gulpLoadPlugins();

var dest = 'public/dist';
var paths = {
  scriptsVendor: [
    'node_modules/vanilla-text-mask/dist/vanillaTextMask.js',    
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/toastr/build/toastr.min.js',
  ],
  cssVendor: [
    'node_modules/toastr/build/toastr.min.css',
  ],
  fonts: [] 
};

gulp.task('clean', () => {
  return del(['public/dist/**', '!public/dist'], { force: true });
});

gulp.task('js:vendor', function () {
  return processJs(paths.scriptsVendor, 'vendor.js');
});

gulp.task('css:vendor', function() {
  return processCss(paths.cssVendor, 'vendor.css');
});

gulp.task('sass:app', function() {
  return processScss(['public/*.scss'], 'styles.css');
});

gulp.task('js:app', function() {
  return processJs(['public/*.js'], 'index.js');
});

gulp.task('html', () => {
  return gulp.src(['public/dist/rev-manifest.json', 'public/*.html'])
    .pipe(collect())
    .pipe(gulp.dest(dest))
});

gulp.task('config', function() {
  console.log('using ' + process.env.NODE_ENV + ' config...');       
  return gulp.src(['config/' + process.env.NODE_ENV + '.js'])
    .pipe(rename('config.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('web-config', function() {
  return gulp.src(['public/web.config'])
    .pipe(gulp.dest(dest));
});

gulp.task('default', ['clean'], () => {
  return gulp.start('compile');
});

gulp.task('watch', function() {
  gulp.watch(['public/assets/**', 'public/*.scss', 'public/*.js', 'public/*.html'], ['default']);
});

gulp.task('assets', () => {
  return gulp.src(['public/assets/**/*.*'])
    .pipe(gulp.dest('public/dist/assets'));
});

gulp.task('build', ['config', 'sass:app', 'js:vendor', 'css:vendor', 'js:app', 'assets'], () => {
  return gulp.src(['public/dist/**/*.js', 'public/dist/**/*.css'])
    .pipe(rev())
    .pipe(revdel())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(dest));
});

gulp.task('compile', ['build', 'web-config'], () => {
  gulp.start('html');
});


function processCss(srcGlob, destFileName, destFolder) {
  return gulp.src(srcGlob)
    .pipe($.concat(destFileName))
    .pipe(gulp.dest(destFolder ? destFolder : dest));
}

function processJs(srcGlob, destFileName, destFolder) {
  return gulp.src(srcGlob)
    .pipe($.concat(destFileName))
    .pipe(uglify())
    .pipe(gulp.dest(destFolder ? destFolder : dest));
}

function processScss(srcGlob, destFileName, destFolder) {
  return gulp.src(srcGlob)
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.minifyCss())
    .pipe(gulp.dest(destFolder ? destFolder : dest));
}