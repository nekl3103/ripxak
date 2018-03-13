var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync');

var path = {
    build: {
        html: 'build/',
        js: 'build/',
        css: 'build/',
        img: 'build/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/**/*.html',
        js: 'src/**/main.js',
        style: 'src/**/main.scss',
        img: 'src/**/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/**/*.js',
        style: 'src/**/*.scss',
        img: 'src/**/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
};

var config = {
    server: {
        baseDir: './build'
    },
    host: 'localhost',
    port: 9000,
    logPrefix: 'MKS'
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('image:build', function() {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'clear',
    'image:build'
]);

gulp.task('watch', function(){
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.style, ['style:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
});

gulp.task('default', ['build', 'webserver', 'watch']);
