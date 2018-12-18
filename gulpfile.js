const gulp = require('gulp');
const sass = require('gulp-sass');
const server = require('gulp-webserver');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const minifyHTML = require('gulp-minify-html');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const del = require('del');
const eslint = require('gulp-eslint');
const sequence = require('run-sequence');

const CONFIG = {
    port: 8000,
    targetHtml: 'http://localhost:8000/src/index.html',
};

gulp.task('dev-eslint', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(eslint({configFile: './.eslintrc.js'}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('dev-sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css/'));
});

gulp.task('dev-watch', function () {
    gulp.watch('src/sass/*.scss', ['dev-sass']);
    gulp.watch('src/js/*.js', ['dev-eslint']);
});

gulp.task('dev-server', function () {
    return gulp.src('./')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            port: CONFIG.port,
            open: CONFIG.targetHtml,
        }));
});

gulp.task('build-uglify-js', function () {
    return gulp.src(['dist/assets/*.js', '!dist/assets/*.min.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('build-compress-image', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'));
});

// 更改版本名前先清除 dist 文件夹中的文件
gulp.task('build-clean', function () {
    return del(['dist/']);
});

gulp.task('build-rev', function () {
    return gulp.src(['src/css/*.css', 'src/js/*.js'])
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

gulp.task('build-rev-collector', function () {
    return gulp.src(['rev-manifest.json', 'src/**/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'assets',
                'js': 'assets'
            }
        }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['dev-server', 'dev-watch', 'dev-sass', 'dev-eslint']);
gulp.task('build', function () {
    sequence('build-clean', 'build-rev', 'build-rev-collector', ['build-uglify-js', 'build-compress-image']);
});
