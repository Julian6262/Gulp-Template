let gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            browsers: ['last 8 versions']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function () {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function () {
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        // 'node_modules/magnific-popup/dist/magnific-popup.css',
        'node_modules/slick-carousel/slick/slick.css'
    ])
        .pipe(concat('_libs.scss'))
        .pipe(gulp.dest('app/scss'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        // 'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/slick-carousel/slick/slick.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch('app/*.html', gulp.parallel('html'))
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
});

gulp.task('build', async function () {
    del.sync('dist')

    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'));

    gulp.src('app/**/*.css')
        .pipe(gulp.dest('dist'));

    gulp.src('app/**/*.js')
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist'));

    gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));
