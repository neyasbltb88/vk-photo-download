// Простой livereload
var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync')

// Для сборки модулей
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')
var browserSync = require('browser-sync')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var tap = require('gulp-tap')
var del = require('del')
var uglify = require('gulp-uglify')

/* --- Красивое отображение ошибок --- */
var gutil = require('gulp-util')
var chalk = require('chalk')

function map_error(err) {
    if (err.fileName) {
        // Ошибка в файле
        gutil.log(chalk.red(err.name) +
            ': ' +
            chalk.yellow(err.fileName.replace(__dirname + './app/scripts/', '')) +
            ': ' +
            'Line ' +
            chalk.magenta(err.lineNumber) +
            ' & ' +
            'Column ' +
            chalk.magenta(err.columnNumber || err.column) +
            ': ' +
            chalk.blue(err.description))
    } else {
        // Ошибка browserify
        gutil.log(chalk.red(err.name) +
            ': ' +
            chalk.yellow(err.message))
    }

    this.emit('end')
}
/* === Красивое отображение ошибок === */

/* Таск, который вызывается из вотчера */
gulp.task('js', function() {
    browserify_js_files.forEach(file => {
        let file_name = path.basename(file)
        let bundler = browserify(file, { debug: true })
            .transform(babelify, {
                presets: ["@babel/preset-env"]
            });
        bundle_js(bundler, file_name)
    })
})

// Функция, которая выполняет работу с файлами js после browserify
function bundle_js(bundler, name) {
    return bundler.bundle()
        .on('error', map_error)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(sourcemaps.init({ loadMaps: true })) // Захват sourcemaps из трансформации
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/scripts/'))

    .pipe(tap(file => {
            gutil.log(chalk.yellow(`Browserify: `) + chalk.white(file.path))
        }))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(livereload())
}

function bundle_js_build(bundler, name) {
    return bundler.bundle()
        .on('error', map_error)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(rename({ suffix: '.min', prefix: '' }))

    .pipe(uglify())
        // .pipe(obfuscator())
        // .pipe(uglify())

    .pipe(gulp.dest('dist'))
        .pipe(tap(file => {
            gutil.log(chalk.yellow(`Browserify: `) + chalk.white(file.path))
        }))
}


/* --- livereload --- */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        },
        cors: true,
        notify: false,
        open: false,
        reloadOnRestart: true
    });
});


gulp.task('livereload', function() {
        browserSync.reload({ stream: false })
        gulp.src('')
            .pipe(livereload())
    })
    /* === livereload === */

/* Файлы, которые надо обрабатывать с помощью browserify */
const browserify_js_files = [
    './app/scripts/vk-photo-download.js',
]

gulp.task('watch', ['js', 'browser-sync'], function() {
    livereload.listen()

    // Будем запускать таск js при изменении любого не минифицированного js
    gulp.watch(['app/**/*.js', '!app/**/*.min.js', '!app/scripts/maps/*.*'], ['js'])

    // При изменении html просто перезагружаем браузер
    gulp.watch(['app/**/*.html'], ['livereload'])
})


gulp.task('default', ['watch'])

gulp.task('removedist', function() {
    return del.sync('dist')
})

gulp.task('build', ['removedist'], function() {
    let file = './app/scripts/vk-photo-download.js'
    let file_name = 'vk-photo-download.min.js'
    let bundler = browserify(file, { debug: true })
        .transform(babelify, {
            presets: ["@babel/preset-env"]
        });

    bundle_js_build(bundler, file_name)
})