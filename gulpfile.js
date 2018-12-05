'use strict';

const autoPrefixBrowserList = [
	'last 2 version',
	'safari 5',
	'ie 8',
	'ie 9',
	'opera 12.1',
	'ios 6',
	'android 4'
];

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const plumber = require('gulp-plumber');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');

gulp.task('browserSync', () => {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('images', () => {
	return gulp
		.src(['src/images/**/*', '!src/images/README'])
		.pipe(plumber())
		.pipe(gulp.dest('dist/images/'));
});

gulp.task('images-deploy', tmp => {
	return gulp
		.src(['src/images/**/*'])
		.pipe(plumber())
		.pipe(
			imagemin({
				optimizationLevel: 5,
				progressive: true,
				interlaced: true
			})
		)
		.pipe(gulp.dest('dist/images/'));
});

gulp.task('scripts', () => {
	return browserify(['src/js/app.js'])
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(plumber())
		.on('error', console.error)
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts-deploy', () => {
	return browserify(['src/js/app.js'])
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(plumber())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-deploy-babel', () => {
	return gulp
		.src('dist/js/bundle.js')
		.pipe(
			babel({
				presets: ['env']
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest(file => file.base));
});

gulp.task('styles', () => {
	return gulp
		.src('src/sass/main.scss')
		.pipe(
			plumber({
				errorHandler: err => {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(sourceMaps.init())
		.pipe(
			sass({
				errLogToConsole: true,
				includePaths: ['src/sass/']
			})
		)
		.pipe(
			autoprefixer({
				browsers: autoPrefixBrowserList,
				cascade: true
			})
		)
		.on('error', console.error)
		.pipe(concat('styles.css'))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-deploy', () => {
	return gulp
		.src('src/sass/main.scss')
		.pipe(plumber())
		.pipe(
			sass({
				includePaths: ['src/sass/']
			})
		)
		.pipe(
			autoprefixer({
				cascade: true
			})
		)
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('html', () => {
	return gulp
		.src(['*.html', 'src/*.html'])
		.pipe(plumber())
		.pipe(browserSync.reload({ stream: true }))
		.on('error', console.error)
		.pipe(gulp.dest('dist'));
});

gulp.task(
	'html-deploy',
	gulp.series(done => {
		gulp.src(['*.html', 'src/*.html'])
			.pipe(plumber())
			.pipe(gulp.dest('dist'));

		gulp.src('manifest.json')
			.pipe(plumber())
			.pipe(gulp.dest('dist'));

		gulp.src('src/fonts/**/*')
			.pipe(plumber())
			.pipe(gulp.dest('dist/fonts'));

		gulp.src(['src/styles/*.css', '!src/styles/styles.css'])
			.pipe(plumber())
			.pipe(gulp.dest('dist/styles'));

		done();
	})
);

gulp.task('clean', shell.task(['rm -rf ./dist']));

gulp.task(
	'scaffold',
	shell.task([
		'mkdir ./dist',
		'mkdir ./dist/fonts',
		'mkdir ./dist/images',
		'mkdir ./dist/js',
		'mkdir ./dist/css'
	])
);

gulp.task(
	'default',
	gulp.series(
		'clean',
		'scaffold',
		gulp.parallel('browserSync', 'images', 'html', 'scripts', 'styles')
	),
	() => {
		gulp.watch('src/scripts/**', gulp.series('scripts'));
		gulp.watch('src/styles/**', gulp.series('styles'));
		gulp.watch('src/images/**', gulp.series('images'));
		gulp.watch('src/*.html', gulp.series('html'));
	}
);

gulp.task(
	'deploy',
	gulp.series(
		[
			'clean',
			'scaffold',
			'scripts-deploy',
			'scripts-deploy-babel',
			'styles-deploy',
			'images-deploy',
			'html-deploy'
		],
		done => {
			done();
		}
	)
);
