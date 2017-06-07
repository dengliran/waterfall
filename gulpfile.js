var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	pkg = require('./package.json');

var banner = ['/*!',
	' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
	' * Developed by <%= pkg.author %> in June 2017',
	' */',
	''].join('\n');

gulp.task('js',function (){
	return gulp.src('./src/js/jquery-waterfall.js')
		.pipe(header(banner,{pkg:pkg}))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify({output:{comments:"/^!/"}}).on('error',function (e){
			console.error(e);
		}))
		.pipe(rename(function (path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('./dist'))
})

gulp.task('assets',function(){
	return gulp.src('./src/js/jquery-1.11.3.min.js')
				.pipe(gulp.dest('./dist'))
})

gulp.task('release',function (){
	return gulp.start('assets','js')
})

gulp.task('default',['release'],function(){
	gulp.watch('src/js/jquery-waterfall.js',['js']);
})