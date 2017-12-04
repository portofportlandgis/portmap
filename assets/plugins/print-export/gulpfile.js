var gulp      = require('gulp');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

//local webserver
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      fallback: 'index.html',
      directoryListing: false,
      livereload: true,
      open: true
    }));
});

//watch task
gulp.task('watch', function(){
  gulp.watch(['index.html', 'js/app.js', 'js/print.js', 'css/app.css', 'css/print.css']);
});

//minify js
gulp.task('scripts', function() {
  gulp.src(['node_modules/blueimp-canvas-to-blob/js/canvas-to-blob.min.js', 'node_modules/jspdf/dist/jspdf.min.js', 'node_modules/pdfjs-dist/build/pdf.combined.js', 'node_modules/filesaver.js/FileSaver.min.js', 'node_modules/html2canvas/dist/html2canvas.min.js', 'node_modules/cropper/dist/cropper.min.js', 'js/print.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

//minify css
gulp.task('css', function() {
  gulp.src(['node_modules/cropper/dist/cropper.min.css'])
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});

//default task
gulp.task('default', ['webserver', 'watch']);

//build task
gulp.task('build', ['scripts', 'css']);
