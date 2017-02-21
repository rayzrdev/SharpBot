const gulp = require('gulp');
const eslint = require('gulp-eslint');
const spawn = require('child_process').spawn;

var bot;

const paths = {
    srcFiles: 'src/**/!(_)*.js',
    configFiles: 'src/**/!(_)*.json',
    gulpFile: 'gulpfile.js'
};

gulp.task('lint', () =>
    gulp.src([
        paths.srcFiles,
        paths.gulpFile
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('main', ['lint'], () => {
    if (bot) bot.kill();
    bot = spawn('node', ['src/bot.js'], { 'stdio': 'inherit' });
    bot.on('close', (code) => {
        if (code === 8) {
            console.error('Error detected, attempting to restart the bot...');
            gulp.start('main');
        } else {
            console.log('Bot has gracefully exited. Waiting for changes...');
        }
    });
});

gulp.task('watch', () => {
    gulp.watch([
        paths.srcFiles,
        paths.configFiles
    ], ['main']);
});

gulp.task('default', ['main', 'watch']);

process.on('exit', () => {
    if (bot) bot.kill();
});