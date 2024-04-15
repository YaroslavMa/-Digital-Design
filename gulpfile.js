const gulp = require("gulp");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const cleanCSS = require("gulp-clean-css");
const gulpClean = require("gulp-clean");
const { watch } = require("browser-sync");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const htmlMin = require("gulp-htmlmin");

const fonts = () => {
  return gulp.src("./src/fonts/*.ttf").pipe(gulp.dest("./fonts"));
};

const html = () => {
  return gulp
    .src("./src/**/*.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist/"));
};

const js = () => {
  return gulp
    .src("./src/scripts/**/*.js")
    .pipe(concat("script.js"))
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest("./dist/script"));
};

const css = () => {
  return gulp
    .src("./src/styles/**/*.css")
    .pipe(concat("style.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/styles"));
};

const scss = () => {
  return gulp
    .src("./src/styles/**/*.{css,scss}")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))

    .pipe(gulp.dest("./dist/styles"));
};

const cleanDist = () => {
  return gulp.src("./dist", { read: false }).pipe(gulpClean());
};

const watcher = () => {
  gulp.watch("./src/**/*.html", html).on("all", browserSync.reload);

  gulp
    .watch("./src/styles/**/*.{scss,sass,css}", scss)
    .on("all", browserSync.reload);

  gulp.watch("./src/script/*.js", js).on("all", browserSync.reload);
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
};

const image = () => {
  return gulp.src("./src/image/**/*.*").pipe(gulp.dest("./dist/image/"));
};

gulp.task("html", html);
gulp.task("script", js);
gulp.task("style", css);
gulp.task("browser-sync", server);

gulp.task("scss", scss);
gulp.task("image", image);

gulp.task("build", gulp.series(cleanDist, gulp.parallel(html, scss, js)));

gulp.task(
  "dev",
  gulp.series(
    gulp.parallel(html, scss, js, image, fonts),
    gulp.parallel(server, watcher)
  )
);
