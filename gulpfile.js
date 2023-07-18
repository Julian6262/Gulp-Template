const {src, dest, watch, parallel} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const del = require('del');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');

function styles() {
    return src([
        // 'node_modules/magnific-popup/dist/magnific-popup.css',
        // 'node_modules/swiper/swiper-bundle.css',
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
        // 'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify)
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function fonts() {
    return src('app/fonts/src/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))
}

function pages() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/src/*.*', '!app/img/src/*.svg')
        .pipe(newer('app/img'))
        .pipe(avif({quality: 50}))
        .pipe(src('app/img/src/*.*'))

        .pipe(newer('app/img'))
        .pipe(webp())
        .pipe(src('app/img/src/*.*'))

        .pipe(newer('app/img'))
        .pipe(imagemin())
        .pipe(dest('app/img'))
}

function sprite() {
    return src('app/img/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('app/img'))
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/img/src/*.*'], images);
    watch(['app/components/*.*', 'app/pages/*.*'], pages);
    watch(['app/js/**/*.js', '!app/js/**/main.min.js'], scripts);
}

function build() {
    del.sync('dist');
    images();
    return src([
        'app/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/fonts/*.*',
        'app/img/*.*',
        '!app/img/*.svg',
        'app/img/sprite.svg'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.watching = watching;
exports.scripts = scripts;
exports.build = build;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;
exports.default = parallel(styles, scripts, images, fonts, pages, watching);
