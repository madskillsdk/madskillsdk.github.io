var gulp = require('gulp');
var path = require('path');
var del = require('del');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var minimist = require('minimist');
var reload = browserSync.reload;

gulp.task('html', function () {
	return gulp.src(['site/**/*.html'])
		.pipe($.plumber())
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
	return gulp.src(['site/**/*.js'])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.if('*.js', $.ngAnnotate()))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp'))
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
	return gulp.src(['site/**/*.css', 'site/**/*.scss'])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.if('*.scss', $.sass({
			outputStyle: 'nested', // libsass doesn't support expanded yet
			precision: 10,
			includePaths: ['.'],
			onError: console.error.bind(console, 'Sass error:')
		})))
		.pipe($.postcss([
			require('autoprefixer-core')({ browsers: ['last 1 version'] })
		]))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp'))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('site/images/**/*')
		.pipe($.plumber())
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
	return gulp.src(['site/fonts/**/*'])
		.pipe($.plumber())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('cname', function () {
	return gulp.src(['site/CNAME'])
		.pipe($.plumber())
		.pipe(gulp.dest('dist/'));
	});

gulp.task('serve', ['build'], function () {
	browserSync({
		notify: false,
		ghostMode: false,
		port: 9000,
		server: {
			baseDir: ['.tmp', 'site']
		}
	})

    gulp
		.watch(['site/**/*.html', 'dist/**/*'])
		.on('change', showChange(".html"))
		.on('error', showError(".html"))
		.on('change', reload);

	// gulp
	// 	.watch(['bower_components/**/*'], ['deps'])
	// 	.on('error', showError("bower_components"))
	// 	.on('change', reload);

	gulp
		.watch(['site/**/*.js'], ['scripts'])
		.on('change', handleSourceFileDeleted)
		.on('change', showChange(".js"))
		.on('error', showError(".js"))
    	.on('change', reload);

	gulp
		.watch(['site/**/*.scss', 'site/**/*.css'], ['styles'])
		.on('change', handleSourceFileDeleted)
		.on('change', showChange(".scss/.css"))
		.on('error', showError(".scss/.css"));
    //.on('change', reload);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['html', 'scripts', 'styles', 'images', 'fonts', 'cname'], function () {
	return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

// handles the case where a source file has been deleted from some place in the app folder
// by deleting the correponding file in the .tmp folder - does some special handling for
// TypeScript and SCSS
function handleSourceFileDeleted(event) {
	if (event.type !== 'deleted') return;

	var sourceFilePath = path.relative(path.resolve('site'), event.path);

	console.log("path of deleted source file", sourceFilePath);

	//Concatenating the "build" absolute path used by gulp.dest in the scripts task
	var destinationFilePath = path.resolve('.tmp', sourceFilePath);
	var extension = path.extname(sourceFilePath);

	if (extension === '.ts') {
		destinationFilePath = path.join(path.dirname(destinationFilePath), path.basename(destinationFilePath, '.ts') + '.js');
	} else if (extension === '.scss') {
		destinationFilePath = path.join(path.dirname(destinationFilePath), path.basename(destinationFilePath, '.scss') + '.scss');
	}

	console.log("path of compiled file to be deleted", destinationFilePath);

	del(destinationFilePath);
}

function showChange(fileDescription) {
	return function (event) {
		console.log(' > ' + fileDescription + ' > ' + event.type + ' ' + event.path);
	};
}

function showError(origin) {
	return function (error) {
		$.gutil.beep();
		console.error('ERROR (' + origin + '): ' + error);
	};
}
