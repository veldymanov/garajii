// Load Node Modules/Plugins
var gulp = require('gulp'),
gulpLoadPlugins = require('gulp-load-plugins'),
del = require('del'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename');

var $ = gulpLoadPlugins();

var dest = 'public/dist';
var paths = {
  scriptsVendor: [
    'node_modules/vanilla-text-mask/dist/vanillaTextMask.js',    
  ],
  cssVendor: [],
  fonts: [] 
};

// Remove existing dist build
gulp.task('clean', del.bind(null, ['dist']));

gulp.task('js:vendor', function () {
  return processJs(paths.scriptsVendor, 'vendor.js');
});

gulp.task('css:vendor', function() {
  return processCss(paths.cssVendor, 'vendor.css');
});

gulp.task('sass', function() {
  return gulp.src(['public/*.scss'])
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.minifyCss())
    .pipe(gulp.dest(dest));
});

gulp.task('js', function() {
  return processJs(['public/*.js'], 'index.js');
});

gulp.task('config', function() {
  var src = '';
  if (process.argv.indexOf('--prod') > -1) {
    console.log('using prod config...');
    src = 'config/prod.js';
  } else {
    console.log('using qa config...');       
    src = 'config/qa.js';        
  }
  return gulp.src([src])
    .pipe(rename('config.js'))
    .pipe(gulp.dest('public/dist'))
});

gulp.task('fonts', function() {
  return gulp.src(['public/fonts/**/*.*'])
    .pipe(gulp.dest('public/dist/fonts'));
});

// Watch tasks
gulp.task('watch', function() {
  gulp.start('config');
  gulp.start('fonts');
  gulp.watch('public/*.scss', ['sass']);
  gulp.watch('public/*.js', ['js']);
});

gulp.task('dist', ['sass', 'js:vendor', 'css:vendor', 'js', 'fonts']);

gulp.task('default', ['clean', 'config'], () => {
  gulp.start('dist');
});

function processCss(srcGlob, destFileName, destFolder) {
  return gulp.src(srcGlob)
    .pipe($.concat(destFileName))
    .pipe(gulp.dest(destFolder ? destFolder : dest));
}

function processJs(srcGlob, destFileName, destFolder) {
  return gulp.src(srcGlob)
    .pipe($.concat(destFileName))
    .pipe(gulp.dest(destFolder ? destFolder : dest));
}