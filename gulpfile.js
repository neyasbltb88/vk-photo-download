var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: '.'
        },
        cors: true,
        notify: false,
        open: false,
        reloadOnRestart: true
    });
});

gulp.task('livereload', function() {
    browserSync.reload({ stream: false });
    gulp.src('')
        .pipe(livereload());
});

gulp.task('watch', ['browser-sync'], function() {
    livereload.listen();
    gulp.watch(['**/*.js', '**/*.html'], ['livereload']);
});


gulp.task('default', ['watch']);