   	  // 引入gulp
const gulp = require("gulp"),
      //编译sass
      sass = require("gulp-sass"),
      //检测、运行本地web服务器
      server = require("gulp-webserver"),
      //压缩js
      uglify = require('gulp-uglify'),
      //重命名
      rename = require('gulp-rename'),
      //更改版本名  加MD5后缀
      rev = require('gulp-rev'),
      revCollector = require('gulp-rev-collector'), //进行静态资源路径的替换
      minifyHTML = require('gulp-minify-html'), //压缩HTML
      babel = require("gulp-babel"),//ES6转ES5
      imagemin = require("gulp-imagemin"),//压缩图片
      del = require("del"), //清除文件
      minifyCss = require('gulp-minify-css'),//压缩CSS为一行；
      jshint = require("gulp-jshint"),//用来检查js代码
      eslint = require("gulp-eslint"); //引用eslint校验文件
	   // 引用eslint校验文件
	  gulp.task('eslint',function(){
      return gulp.src(['js/*.js']) //指定的校验路径
            .pipe(eslint({configFle:"./eslint.js"})) //使用你的eslint校验文件
            .pipe(eslint.format())
	  });
	  //编译scss样式添加到css中
	  gulp.task("sass",function(){
      return gulp.src("sass/*.scss")
            .pipe(sass())
            .pipe(gulp.dest("css/"))
    });
	  //监测本地中的所有scss文件，有改变时就自动编译
    gulp.task("server",function(){
      gulp.watch("sass/*.scss",["sass"]);
      return gulp.src("./")
            .pipe(server({
              livereload:true,
              directoryListing:true,
              open:true
            }));
    });
    // 压缩js
    gulp.task("uglifys",function(){
      return gulp.src(["js/*.js","!js/*.min.js"])
            .pipe(babel({
              presets: ['es2015']
            }))
            .pipe(uglify())
            .pipe(gulp.dest("dist/js"))
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
    // 检查js代码
    gulp.task('jsLint', function () {
      gulp.src(["js/*.js","!js/*.min.js"])
      .pipe(jshint(".jshintrc"))
      .pipe(jshint.reporter()); // 输出检查结果
  });
  // 实时监控js的代码
    gulp.task("watch", function () {
      gulp.watch("js/*.js", ['jsLint']);
    });
    //更改版本名  加MD5后缀
    gulp.task('rev',function(){
      return gulp.src(['css/*.css'])
            .pipe(minifyCss())  
            .pipe(rev())
            .pipe(gulp.dest('dist/css'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./'));
    });
    //静态资源路径的替换
    gulp.task("revCollector",function(){
      return gulp.src(['rev-manifest.json',"*.html"])
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
    gulp.task("default",["sass","server","watch","jsLint"]);
    // 生产环境压缩、打包、拷贝
    gulp.task("bind",["clean","rev","uglifys","imagemin","copy","revCollector"]);