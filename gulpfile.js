const gulp = require('gulp');
const  plumber = require('gulp-plumber');
const  autoprefixer = require('gulp-autoprefixer');
const  rename = require('gulp-rename');
const  urlAdjuster = require('gulp-css-url-adjuster');
const  inline = require('gulp-inline');
const  htmlmin = require('gulp-htmlmin');
const  sass = require('gulp-sass');
const  cleanCSS = require('gulp-clean-css');
const  babel = require('gulp-babel');
const  uglify = require('gulp-uglify');
const  webp = require('gulp-webp');
const  imagemin = require('gulp-imagemin');
const  browserSync = require('browser-sync');
const  del = require('del');

const distFolder = 'docs'; // 'docs', 'public/dist'


/**
* CSS Tasks
*/
//run sass
gulp.task('sass', () =>
  gulp.src('src/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/'))
);

/**
* Picture tasks
*/
//pctures minimize to '*.opt.{png,jpg,gif,svg}' and '*.z.{png,jpg,gif,svg}'
gulp.task('pic:min', () =>
  gulp.src([
    'src/**/images/**/*.{png,jpg,gif,svg}',
    '!src/**/images/**/*.opt.{png,jpg,gif,svg}',
    '!src/**/images/**/*.z.{png,jpg,gif,svg}'
  ])
    .pipe(rename({suffix: '.opt'}))
    .pipe(imagemin())
    .pipe(gulp.dest('src/'))
    .pipe(rename(function(opt) {
        opt.basename = opt.basename.replace(/.opt/, '.z');
    }))
    .pipe(gulp.dest('src/'))
);

//create '*.z.webp' from '*.opt.{png,jpg}'
gulp.task('pic:webp', ['pic:min'], () =>
  gulp.src(['src/**/images/**/*.opt.{jpg,png}'])
    .pipe(rename(function(opt) {
        opt.basename = opt.basename.replace(/.opt/, '.z');
    }))
    .pipe(webp())
    .pipe(gulp.dest('src/'))
);

//remove all pictures exept 'src/images/**/*.z.{png,jpg,gif,svg}'
gulp.task('pic:remove', ['pic:webp'], () =>
  del.sync([
    'src/**/images/**/*.{png,jpg,gif,svg}',
    '!src/**/images/**/*.z.{png,jpg,gif,svg}'
  ])
);

gulp.task('pic', ['pic:remove']);

/**
* Build production version
*/
//clear out all files and folders from build folder
gulp.task('build:cleanfolder', () =>
  del.sync(`${distFolder}/**`)
);

//task to create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], () =>
  gulp.src('src/**/*/')
    .pipe(gulp.dest(`${distFolder}/`))
);

// change urls in css files
gulp.task('url:adjust', ['build:copy'], () =>
  gulp.src(`${distFolder}/styles/*.css`)
    .pipe(urlAdjuster({
      replace:  ['../',''], // for github pages: "replace:  ['../','']"
    }))
    .pipe(gulp.dest(`${distFolder}/styles/`))
);

//minify scripts
gulp.task('scripts:minify', ['url:adjust'], () =>
  gulp.src([`${distFolder}/**/*.js`, `!${distFolder}/**/chat-socket.js`])
  .pipe(plumber())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest(`${distFolder}/`))
);

// inline css, js, svg
gulp.task('inline', ['scripts:minify'], () =>
  gulp.src(`${distFolder}/*.html`)
  .pipe(inline({
    base: `${distFolder}`,
    // js: uglify,
    css: [cleanCSS],
    disabledTypes: ['img', 'svg'], // Only inline css, js files
    // ignore: ['./css/do-not-inline-me.css']
  }))
  .pipe(gulp.dest(`${distFolder}/`))
);

//minify html
gulp.task('html:minify', ['inline'], () =>
  gulp.src([`${distFolder}/**/*.html`])
  .pipe(plumber())
  .pipe(htmlmin({
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    html5: true,
    minifyCSS: false,
    minifyJS: false,
    processConditionalComments: true,
    minifyURLs: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true
  }))
  .pipe(gulp.dest(`${distFolder}/`))
);

//task to remove unwanted build files
gulp.task('build:remove', ['html:minify'], () =>
  del.sync([
    `${distFolder}/styles/**`, `${distFolder}/scripts/**`
  ])
);

gulp.task('build', ['build:remove']);

/**
* Browser-Sync Tasks
*/
gulp.task('serve', () =>
  browserSync({
    server: {
      baseDir: './src/'
    }
  })
);

//task to run build server
gulp.task('build:serve', () =>
  browserSync({
    server: {
      baseDir: `./${distFolder}/`
    }
  })
);

gulp.task('watch', () => {
  gulp.watch('src/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/**/*.scss', ['sass']).on('change', browserSync.reload);
  // gulp.watch('src/**/*.css', ['css']).on('change', browserSync.reload);
  gulp.watch('src/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', [
  'serve',
  'watch'
]);