var pkg = require('./package.json');

// NPM Packages
var gulp = require('gulp');
// sass
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var sourcemaps = require('gulp-sourcemaps');
var pleeease = require('gulp-pleeease');
// js
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
var changed = require('gulp-changed');
// images
var imagemin  = require ('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// function
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

var dest = './build';
var src = './src';

// Sass Task Settings
gulp.task('sass', function(){
	gulp.src('src/scss/**/*.scss')
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(bulkSass())
  .pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'compressed',
		errLogToConsole: false,
		includePaths: [ 'src/' ],
	}))
  .pipe(sourcemaps.write())
	.pipe(pleeease())
	.pipe(gulp.dest('dist/assets/css/'))
	.pipe(notify('css task finished'));
});


// js Task Settings
gulp.task('js', function() {
	return gulp.src('src/js/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(changed('dist/assets/js'))
	.pipe(gulp.dest('dist/assets/js')) // file dir
	.pipe(notify('js task finished')); // message
});


//Image min Task Settings
gulp.task('imagemin', function(){
	gulp.src('src/images/**/*.{png,jpg,svg,webp}')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [
				{ removeViewBox: false },
				{ cleanupIDs: false }
			],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(notify('imagemin task finished')); // message
});


// video file copy
gulp.task('video', function() {
	gulp.src('src/video/**/*')
	.pipe(gulp.dest('dist/assets/video'));
});


// www file copy
gulp.task('copy', function() {
	gulp.src('src/www/**/*')
	.pipe(gulp.dest('dist'));
});

// Libraries js Task Settings
gulp.task('appjs', function() {
	return gulp.src('src/js/libs/*.js')
	.pipe(plumber())
	.pipe(concat('app.js'))  // file rename
	.pipe(uglify())
	// .pipe(rename({suffix: '.min'}))
	.pipe(changed('dist/assets/js'))
	.pipe(gulp.dest('dist/assets/js')) // file dir
	.pipe(notify('compile succeeded')); // message
});

// Libraries css Task Settings
gulp.task('appcss', function() {
	return gulp.src('src/js/libs/*.css')
	.pipe(concat('app.css'))
	.pipe(gulp.dest('dist/assets/css/'))
	.pipe(notify('app.css compile succeeded'));
});

// Gulp Watch Settings
gulp.task('default', function(){
	gulp.watch("src/scss/**/*.scss",["sass"]); //run sass
	gulp.watch("src/js/**/*.js",["js"]); //run js
	gulp.watch("src/www/**/*",["copy"]);
});
