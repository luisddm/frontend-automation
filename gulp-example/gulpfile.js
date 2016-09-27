const gulp = require('gulp');

const sass         = require('gulp-sass');         // https://www.npmjs.com/package/gulp-sass
const sourcemaps   = require('gulp-sourcemaps');   // https://www.npmjs.com/package/gulp-sourcemaps
const autoprefixer = require('gulp-autoprefixer'); // https://www.npmjs.com/package/gulp-autoprefixer
const concat       = require('gulp-concat');       // https://www.npmjs.com/package/gulp-concat
const uglify       = require('gulp-uglify');       // https://www.npmjs.com/package/gulp-uglify
const htmlReplace  = require('gulp-html-replace'); // https://www.npmjs.com/package/gulp-html-replace
const babel        = require('gulp-babel');        // https://www.npmjs.com/package/gulp-babel
const tar          = require('gulp-tar');          // https://www.npmjs.com/package/gulp-tar
const gzip         = require('gulp-gzip');         // https://www.npmjs.com/package/gulp-gzip
const pug          = require('gulp-pug');          // https://www.npmjs.com/package/gulp-pug
const sizereport   = require('gulp-sizereport');   // https://www.npmjs.com/package/gulp-sizereport
const jshint       = require('gulp-jshint');       // https://www.npmjs.com/package/gulp-jshint
const sassLint     = require('gulp-sass-lint');    // https://www.npmjs.com/package/gulp-sass-lint
const notify       = require('gulp-notify');       // https://www.npmjs.com/package/gulp-notify

const del          = require('del');               // https://www.npmjs.com/package/del
const browserSync  = require('browser-sync');      // https://www.npmjs.com/package/browser-sync

const config = {
  bowerDir: 'bower_components',
};

gulp.task('scss', () =>
  gulp.src('src/scss/styles.scss')            // Take the main style file
    .pipe(sourcemaps.init())
    .pipe(sass({                              // Convert from SCSS to CSS
        outputStyle: 'compressed',            // Minify
        includePaths: [
          config.bowerDir + '/bootstrap-sass/assets/stylesheets/',
        ],                                    // Include the routes from where we can import additional SCSS files
      }).on('error', sass.logError))          // Output the possible errors
    .pipe(autoprefixer())                     // Add vendor prefixes
    .pipe(sourcemaps.write('../maps'))        // Write sourcemaps
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
  gulp.src('src/index.pug')     // Take index.pug
    .pipe(pug({                 // Convert pug files to HTML
      pretty: true,
    }))
    .pipe(htmlReplace({
      css: 'css/styles.css',    // Replace the stylesheet links section with the link to the new styleshet
      js: 'js/scripts.js',      // Replace the script links section with the link to the new script
    }))
    .pipe(gulp.dest('dist'))    // Copy to dist
);

gulp.task('compress', () =>
  gulp.src('dist/*')
    .pipe(tar('code.tar'))   // Pack all the files together
    .pipe(gzip())            // Compress the package using gzip
    .pipe(gulp.dest('.'))
    .pipe(notify('Compressed package generated!'))
);

gulp.task('size', () =>
  gulp.src('dist/**')     // Select all the files recursively in dist
    .pipe(sizereport({
      gzip: true,         // Show the plain size and the compressed size
    }))
);

gulp.task('jshint', () =>
  gulp.src('src/js/**/*.js')
    .pipe(jshint())                     // Lint all the JS files
    .pipe(jshint.reporter('default'))   // Report the possible errors
);

gulp.task('sasslint', () =>
  gulp.src('src/scss/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
);

gulp.task('clean', () =>
  del(['dist/**'])
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
