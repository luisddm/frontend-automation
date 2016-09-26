const gulp        = require('gulp');

const sass        = require('gulp-sass');         // https://www.npmjs.com/package/gulp-sass
const concat      = require('gulp-concat');       // https://www.npmjs.com/package/gulp-concat
const cleanCss    = require('gulp-clean-css');    // https://www.npmjs.com/package/gulp-clean-css
const uglify      = require('gulp-uglify');       // https://www.npmjs.com/package/gulp-uglify
const imagemin    = require('gulp-imagemin');     // https://www.npmjs.com/package/gulp-imagemin
const htmlReplace = require('gulp-html-replace'); // https://www.npmjs.com/package/gulp-html-replace
const babel       = require('gulp-babel');        // https://www.npmjs.com/package/gulp-babel
const tar         = require('gulp-tar');          // https://www.npmjs.com/package/gulp-tar
const gzip        = require('gulp-gzip');         // https://www.npmjs.com/package/gulp-gzip
const pug         = require('gulp-pug');
const browserSync = require('browser-sync');      // https://www.npmjs.com/package/browser-sync

gulp.task('scss', () =>
  gulp.src('src/scss/styles.scss')            // Take the main style file
    .pipe(sass().on('error', sass.logError))  // Convert SCSS into CSS
    .pipe(cleanCss())                         // Minify
    .pipe(gulp.dest('dist/css'))              // Copy the result to dist
);

gulp.task('es6', () =>
  gulp.src('src/js/*.js')                   // Take all the scripts
    .pipe(concat('scripts.js'))             // Concat all scripts in one file
    .pipe(babel({ presets: ['es2015'] }))   // Transpile ES6+ into ES5
    .pipe(uglify())                         // Minify
    .pipe(gulp.dest('dist/js'))             // Copy to dist
);

gulp.task('html', () =>
  gulp.src('src/index.pug')    // Take index.html
    .pipe(pug({ pretty: true }))
    .pipe(htmlReplace({
      css: 'css/styles.css',    // Replace the stylesheet links section with the link to the new styleshet
      js: 'js/scripts.js',      // Replace the script links section with the link to the new script
    }))
    .pipe(gulp.dest('dist'))    // Copy to dist
);

gulp.task('img', () =>
  gulp.src('src/img/*')           // Take all the images
    .pipe(imagemin())             // Optimize the images
    .pipe(gulp.dest('dist/img'))  // Copy the images to dist
);

gulp.task('compress', () =>
  gulp.src('dist/*')
    .pipe(tar('code.tar'))   // Pack all the files together
    .pipe(gzip())            // Compress the package using gzip
    .pipe(gulp.dest('.'))
);

gulp.task('browser-sync', () => {
  browserSync.init(['dist/css/**.css', 'dist/js/**.js', 'dist/**.html'], {  // Look for changes in dist directories
    server: 'dist',  // Reload browser when any JS is modified or inject CSS when any stylesheet is modified
  });
});

gulp.task('watch', ['html', 'scss', 'es6', 'browser-sync'], () => {
  gulp.watch('src/scss/*.scss', ['scss']);
  gulp.watch('src/js/*.js', ['es6']);
  gulp.watch('src/*.pug', ['html']);
});

gulp.task('deploy', ['html', 'scss', 'es6', 'compress']);

gulp.task('default', ['html', 'scss', 'es6']);
