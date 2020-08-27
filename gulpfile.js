var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer')
var minCss = require('gulp-minify-css')
var rename = require('gulp-rename')
var minJs = require("gulp-babel-minify");


/* task for compiling just the scc.less file */
gulp.task('minifycss', function () {
    console.log('Compiling LESS ...');
    return gulp.src('./src/scc.less')
        .pipe(less())
        .pipe(autoprefixer())
        

        // output the minified version
      .pipe(minCss())
      .pipe(rename({ extname: '.min.css' }))
      .pipe(gulp.dest('./dist'))
});

gulp.task("minifyjs", function(){
    console.log('Compiling JS ...');
    return gulp.src("./src/scc.js")
    .pipe(minJs({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest("./dist"));
});

/* task for compiling main.less if ANY .less file changes */
/* start with 'gulp watch' */
gulp.task('watch', function(){
    gulp.watch(['./src/*.less','./src/*.js'], gulp.series('minifycss', 'minifyjs')); 
})

/* Default Task */
/* start with 'gulp' */
gulp.task('default', gulp.parallel('minifycss', 'minifyjs', 'watch'));