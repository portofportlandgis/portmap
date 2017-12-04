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
  gulp.watch(['index.htm', 'js/app.js', 'js/layer-tree.js', 'css/app.css', 'css/layer-tree.css']);
});

//minify js
gulp.task('scripts', function() {
  gulp.src(['node_modules/jquery/dist/jquery.min.js', 'js/jquery-ui-sortable/jquery-ui.min.js', 'js/layer-tree.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

//minify css
gulp.task('css', function() {
  gulp.src(['css/layer-tree.css'])
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});

//default task
gulp.task('default', ['webserver', 'watch']);

//build task
gulp.task('build', ['scripts', 'css']);
