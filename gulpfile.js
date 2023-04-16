const autoprefixer = require("gulp-autoprefixer");
const babel = require('gulp-babel');
const browserSync = require("browser-sync").create();
const csso = require("gulp-csso");
const { dest, parallel, src, series, watch, } = require("gulp");
const mode = require("gulp-mode")();
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const terser = require('gulp-terser');
const webpack = require('webpack-stream');

const css = () => {
  return src("src/scss/index.scss")
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename("styles.css"))
    .pipe(mode.production(csso()))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest("dist"))
    .pipe(mode.development(browserSync.stream()));
}

// js task
const js = () => {
  return src('src/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(webpack({
      mode: 'development',
      devtool: 'inline-source-map'
    }))
    .pipe(mode.development(sourcemaps.init({ loadMaps: true })))
    .pipe(rename('app.js'))
    .pipe(mode.production(terser({ output: { comments: false } })))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(mode.development(browserSync.stream()));
}

// copy font to dist
const copyFonts = () => {
  return src("src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}")
    .pipe(dest("dist/assets/fonts"));
}

// watch task
const watchForChanges = () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", js);
  watch("**/*.html").on("change", browserSync.reload);
  watch("src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}", series(copyFonts));
}

// public tasks
exports.default = series(parallel(css, js, copyFonts), watchForChanges);
exports.build = series(parallel(css, js, copyFonts));