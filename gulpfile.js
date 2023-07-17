const {src, dest, watch, parallel} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
}

function styles() {
    return src([
        // 'node_modules/magnific-popup/dist/magnific-popup.css',
        // 'node_modules/slick-carousel/slick/slick.css',
        'app/scss/style.scss',
        'app/scss/media.scss'
    ])
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        // 'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        // 'node_modules/slick-carousel/slick/slick.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify)
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/img'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/**/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.build = build;
exports.images = images;
exports.default = parallel(browsersync, watching);
