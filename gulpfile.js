const autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const gulpSequence = require('gulp-sequence').use(gulp);
const shell = require('gulp-shell');
const plumber = require('gulp-plumber');

gulp.task('browserSync', () => {
	browserSync({
		server: {
			baseDir: "./app/"
		},
		options: {
			reloadDelay: 250
		},
		notify: false
	});
});

gulp.task('images', (tmp) => {
	gulp.src(['app/images/*.jpg', 'app/images/*.png'])
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('app/images'));
});

gulp.task('images-deploy', () => {
	gulp.src(['app/images/**/*', '!app/images/README'])
		.pipe(plumber())
		.pipe(gulp.dest('app/dist/images'));
});

gulp.task('scripts', () => {
	return gulp.src(['app/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(concat('app.js'))
		.on('error', console.error)
		.pipe(gulp.dest('app/dist/scripts'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts-deploy', () => {
	return gulp.src(['app/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/dist/scripts'));
});

gulp.task('styles', () => {
	return gulp.src('app/styles/main.scss')
		.pipe(plumber({
			errorHandler: (err) => {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sourceMaps.init())
		.pipe(sass({
			errLogToConsole: true,
			includePaths: [
				'app/styles/'
			]
		}))
		.pipe(autoprefixer({
			browsers: autoPrefixBrowserList,
			cascade: true
		}))
		.on('error', console.error)
		.pipe(concat('styles.css'))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('app/dist/styles'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-deploy', () => {
	return gulp.src('app/styles/init.scss')
		.pipe(plumber())
		.pipe(sass({
			includePaths: [
				'app/styles/',
			]
		}))
		.pipe(autoprefixer({
			cascade: true
		}))
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('app/dist/styles'));
});

gulp.task('html', () => {
	return gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(browserSync.reload({ stream: true }))
		.on('error', console.error);
});

gulp.task('html-deploy', () => {
	gulp.src('app/*')
		.pipe(plumber())
		.pipe(gulp.dest('app/dist'));

	gulp.src('app/.*')
		.pipe(plumber())
		.pipe(gulp.dest('app/dist'));

	gulp.src('app/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('app/dist/fonts'));

	gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
		.pipe(plumber())
		.pipe(gulp.dest('app/dist/styles'));
});

gulp.task('clean', () => {
	return shell.task([
		'rm -rf app/dist'
	]);
});

gulp.task('scaffold', () => {
	return shell.task([
		'mkdir app/dist',
		'mkdir app/dist/fonts',
		'mkdir app/dist/images',
		'mkdir app/dist/scripts',
		'mkdir app/dist/styles'
	]
	);
});

gulp.task('default', ['browserSync', 'scripts', 'styles'], () => {
	//a list of watchers, so it will watch all of the following files waiting for changes
	gulp.watch('app/scripts/src/**', ['scripts']);
	gulp.watch('app/styles/**', ['styles']);
	gulp.watch('app/images/**', ['images']);
	gulp.watch('app/*.html', ['html']);
});

gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));