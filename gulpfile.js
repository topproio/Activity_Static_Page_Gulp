// 引入gulp
var gulp = require("gulp"),
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
	eslint = require("gulp-eslint"); //引用eslint校验文件


	var config = {
		imgfrom:'img/*.{png,jpg,gif,ico}',
		imgto:'dist/img'
	};
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

gulp.task("uglify",function(){
	gulp.src("js/*.js")
		.pipe(uglify())
		.pipe(babel())
		.pipe(rename('app.js'))
		.pipe(gulp.dest("dist/js/"))
});
//img压缩
gulp.task('imagemin', function () {
    gulp.src(config.imgfrom)
        .pipe(imagemin({
			accurate:true,//高精度模式
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(config.imgto));
});
// 检测图片、有就进行压缩
gulp.task("watchImagemin", function() {
    gulp.watch(config.imgfrom, ['imagemin']);
});
// 更改版本名前先清除dist文件夹中的文件
gulp.task('clean', function () {
    del(['dist']);
});
//更改版本名  加MD5后缀
gulp.task('rev',function(){
	return gulp.src(['css/*.css'])
		.pipe(rev())
		.pipe(gulp.dest('dist/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./'));

});
//静态资源路径的替换
gulp.task("revCollector",function(){
	return gulp.src(['rev-manifest.json',"music.html"])
		.pipe(revCollector({
			replaceReved: true,
			dirReplacements: {
				'css': 'css/',
				'js': 'js/*.js'
			}
		}))
	// 	.pipe( minifyHTML({ //压缩html代码
	// 		empty:false,
	// 		spare:false
	// 	}) 
	// )
		.pipe( gulp.dest('dist/') 
	);
});
gulp.task("default",["clean","sass","server","rev","revCollector","uglify","imagemin","watchImagemin"]);