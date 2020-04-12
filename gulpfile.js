var gulp = require('gulp');
    autoprefixer = require('gulp-autoprefixer');
    browserSync = require('browser-sync').create();
    sass = require('gulp-sass');
    cleanCSS = require('gulp-clean-css');


// Компиляция SASS в CSS , добавление  авто-префиксов и сжатие CSS
function style () {
    // 1 Где находится мой файл SASS 
    return gulp.src('./src/sass/**/*.sass')
    // 2 Компеляция файла в CSS
    .pipe(sass().on('error', sass.logError))
    // 3 Добавляем автопрефиксы 
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    // 4 Сохраняю файл 
    .pipe(gulp.dest('./src/css'))
    // 5 поток изменений на весь браузер 
    .pipe(browserSync.stream());
}
   // 6 Сжатия файла CSS
function mincss() {
    return gulp.src('./src/css/**/*.css')
          .pipe(cleanCSS({
            level: 2
        }))
          .pipe(gulp.dest('./src/build/css'))  
} 
function watch() {
        browserSync.init({
            server: {
                baseDir: "./"
            }
        });
        gulp.watch('./src/sass/**/*.sass', style);
        gulp.watch('./src/css/**/*.css', mincss);
        gulp.watch('./*.html').on('change', browserSync.reload);
        gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
}   
    
    exports.style = style;
    exports.mincss = mincss;
    exports.watch = watch;
