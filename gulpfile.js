var gulp = require("gulp"),
    less = require("gulp-less"),
    nano = require("gulp-cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    gulpIf = require("gulp-if"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    sync = require("browser-sync").create(),
    imageMin = require("gulp-imagemin"),
    fontMin = require("gulp-fontmin");

var isDevelopment = true;

gulp.task("js", function() {
    return gulp.src("src/js/main.js")
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest("dist/js"));
});


gulp.task("css", function() {
    return gulp.src("src/css/main.less")
        .pipe(gulpIf(isDevelopment,sourcemaps.init()))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ["last 3 versions"],
            cascade: false
        }))
        .pipe(nano())
        .pipe(gulpIf(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest("dist/css"))
        .pipe(sync.stream());
});

gulp.task("html", function() {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

gulp.task("image", function () {
    return gulp.src("src/images/*")
        .pipe(imageMin())
        .pipe(gulp.dest("dist/images"))
});


gulp.task('font', function () {
    return gulp.src('src/fonts/*.ttf')
        .pipe(fontMin())
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task("watch", ["build"] ,function () {
    sync.init({
        server: "dist"
    });

    gulp.watch("src/css/**/*.less", ["css:own"]);
    gulp.watch("src/js/*.js", ["js:own"]);
    gulp.watch("dist/js/*.js").on("change", sync.reload);
    gulp.watch("src/*.html", ["html"]);
    gulp.watch("dist/*.html").on("change", sync.reload);
    gulp.watch("src/images/*", ["image"]);
    gulp.watch("dist/images/*").on("change", sync.reload);
    gulp.watch("src/fonts/*.ttf", ["font"]);
    gulp.watch("dist/fonts/*").on("change", sync.reload);
});

gulp.task("build", ["html", "css", "js", "image", "font"]);
gulp.task("default", ["build", "watch"]);