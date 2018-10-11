const gulp = require('gulp');
const sass = require('gulp-sass');
const server = require('gulp-webserver');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const minifyHTML = require('gulp-minify-html');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const eslint = require('gulp-eslint');

gulp.task('eslint',function(){
  return gulp.src(['js/*.js'])
        .pipe(eslint({configFle:'./eslint.js'}))
        .pipe(eslint.format())
});

gulp.task('sass',function(){
  return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css/'))
});

// 样式热更新
gulp.task('server',function(){
  gulp.watch('sass/*.scss',['sass']);
    return gulp.src('./')
          .pipe(server({
            livereload:true,
            directoryListing:true,
            open:true
          }));
});

gulp.task('uglifyjs',function(){
  return gulp.src(['js/*.js','!js/*.min.js'])
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//img压缩
gulp.task('imagemin', function () {
  return gulp.src('img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
          accurate:true,//高精度模式
          optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
          progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
          interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
          multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy', function() {
  return gulp.src('js/*.min.js')
        .pipe(gulp.dest('dist/js'))
});

// 更改版本名前先清除dist文件夹中的文件
gulp.task('clean', function () {
  return del(['dist/']);
});

// 更改版本名，加MD5后缀
gulp.task('rev',function(){
  return gulp.src(['css/*.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))  
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

// 静态资源路径的替换
gulp.task('revCollector',function(){
  return gulp.src(['rev-manifest.json','*.html'])
        .pipe(revCollector({
          replaceReved: true,
          dirReplacements: {
            'css': 'css/',
            'js': 'js/'
          }
        }))
        .pipe(minifyHTML({ //压缩html代码
          empty:true,
          spare:true
        }) 
      )
    .pipe(gulp.dest('dist/') 
  );
});

// 开发环境实时监控、编译sass
gulp.task('default',['sass','server', 'eslint']);

// 生产环境压缩、打包、拷贝
gulp.task('bind',['clean','rev','uglifyjs','imagemin','copy','revCollector']);