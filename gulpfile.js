var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function(cb){
    gulp.src('./src/*.js',{read: false})
        .pipe(jsdoc(cb));
});
gulp.task('watch', ['doc'], function(){
    gulp.watch('./src/*.js', ['doc']);
});
gulp.task('default', ['doc']);
