import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import htmlinclude from 'gulp-file-include'
import browserSync from 'browser-sync'
import sassGlob from 'gulp-sass-glob'
import postCss from 'gulp-postcss'
import pimport from 'postcss-import'
import minmax from 'postcss-media-minmax'
import csso from 'postcss-csso'
import replace from 'gulp-replace'
import postcssPresetEnv from 'postcss-preset-env'
import { deleteAsync } from 'del'
import buffer from 'vinyl-buffer'
import gutil from 'gulp-util'
import sourcemaps from 'gulp-sourcemaps'
import gulpif from 'gulp-if'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import imagemin from 'gulp-imagemin'

//svg
import svgSprite from 'gulp-svg-sprite'
import svgmin from 'gulp-svgmin'
import cheerio from 'gulp-cheerio'

// JS
import webpack from 'webpack-stream'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import terser from 'gulp-terser'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

// CSS

import gulpSass from 'gulp-sass'
import * as dartSass from 'sass'

// DATA
let isProduction = process.env.NODE_ENV === 'production'


const config = {
    source: './source',
    public: './build',
    assets: '/img',
    sprite_svg: '/img/svg/icon',
    sprite_name: '/img/svg/sprite.svg',
    scss: '/scss',
    css: '/css',
    js: '/js/pages'
}

const toCopy = [
    `${config.source}/fonts/**/*`,
    `${config.source}/**/*.ico`
]


export const spriteSvg = () => {
    return gulp
    .src(`${config.source}${config.sprite_svg}/**/*.svg`)
    .pipe(
        svgmin({
            js2svg: {
                pretty: true
            }
        })
    )
    .pipe(
        cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill')
                $('[stroke]').removeAttr('stroke')
                $('[style]').removeAttr('style')
            },
            parserOptions: { xmlMode: true }
        })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
        svgSprite({
            mode: {
                symbol: {
                    sprite: `../${config.sprite_name}`
                }
            }
        })
    )
    .pipe(gulp.dest(`${config.public}`))
    .pipe(browserSync.reload({ stream: true }))
}

export const html = () => {
    return gulp
    .src(`${config.source}/*.html`)
    .pipe(
        htmlinclude({
            prefix: '@@'
        })
    )
    .pipe(
        htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })
    )
    .pipe(gulp.dest(`${config.public}`))
    .pipe(browserSync.reload({ stream: true }))
}

export const js = () => {
    return gulp
    .src(`${config.source}${config.js}/*.js`)
    .pipe(
        webpack({
            mode: isProduction ? 'production' : 'development',
            devtool: isProduction ? false : 'eval-cheap-module-source-map',
            watch: !isProduction,
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserWebpackPlugin({
                        extractComments: false,
                        parallel: true,
                        terserOptions: {
                            warnings: false,
                            ecma: undefined,
                            parse: {},
                            compress: {},
                            mangle: true,
                            module: false,
                            output: {
                                comments: false
                            },
                            format: null,
                            toplevel: false,
                            nameCache: null,
                            ie8: false,
                            keep_classnames: false,
                            keep_fnames: false,
                            safari10: false
                        }
                    })
                ]
            },
            entry: {
                index: [`${config.source}${config.js}/index.page.js`],
                catalog: [`${config.source}${config.js}/catalog.page.js`],
                productPage: [`${config.source}${config.js}/product.page.js`],
                reg: [`${config.source}${config.js}/reg.page.js`],
                contacts: [`${config.source}${config.js}/contacts.page.js`],
                activate: [`${config.source}${config.js}/activate.page.js`],
                recovery: [`${config.source}${config.js}/recovery.page.js`],
                selection: [`${config.source}${config.js}/selection.page.js`],
                cart: [`${config.source}${config.js}/cart.page.js`],
                order: [`${config.source}${config.js}/order.page.js`],
                profile: [`${config.source}${config.js}/profile.page.js`],
                search: [`${config.source}${config.js}/search.page.js`],
                admin: [`${config.source}${config.js}/admin.page.js`]
            },
            output: {
                filename: '[name].js'
            },
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: 'babel-loader'
                                // options: {
                                //     presets: [['@babel/env']],
                                //     plugins: ['@babel/plugin-proposal-class-properties']
                                // }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new CircularDependencyPlugin(),
                new DuplicatePackageCheckerPlugin()
            ]
        })
    )
    .pipe(gulp.dest(`${config.public}${config.js}`))
    .pipe(browserSync.reload({ stream: true }))
}

export const clear = () => {
    return deleteAsync(config.public)
}

export const copy = () => {
    return gulp.src(toCopy, {
        base: config.source,
        encoding: false
    })
    .pipe(gulp.dest(config.public), { buffer: true })
    .pipe(browserSync.reload({ stream: true }))
}


const sass = gulpSass(dartSass)

export const css = () => {
    return gulp
    .src(`${config.source}${config.scss}/*.scss`)
    /*.pipe(plumber())*/
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass({
        outputStyle: 'expanded' // Другие опции: 'compressed', 'nested', 'compact'
    }).on('error', sass.logError))
    .pipe(
        postCss([
            postcssPresetEnv({
                autoprefixer: { grid: true }
            }),
            pimport,
            minmax,
            csso
        ])
    )
    .pipe(replace(/(..\/){2,100}/, '../'))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(`${config.public}${config.css}`))
    .pipe(browserSync.reload({ stream: true }))
}

export const images = () => {
    return gulp
    .src([
        `${config.source}${config.assets}/**/*.*`,
        `!${config.source}/${config.sprite_svg}/**/*.svg`
    ], { encoding: false })
    // .pipe(buffer())
    .pipe(gulpif(isProduction, imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({
            quality: 75,
            progressive: true
        }),
        imagemin.optipng({ optimizationLevel: 7 }),
        imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
    ])))
    .pipe(gulp.dest(`${config.public}${config.assets}`))
    .pipe(browserSync.reload({ stream: true }))
}


export const server = () => {
    browserSync.init({
        notify: false,
        port: 8080,
        online: true,
        tunnel: true,
        browser: 'chrome',
        server: {
            baseDir: config.public
        }
    })
}


if (!isProduction) {
    gulp.watch(`${config.source}/**/*.html`, { usePolling: true }, gulp.series(html))
    gulp.watch(`${config.source}${config.scss}/**/*.scss`, { usePolling: true }, gulp.series(css))
    gulp.watch([`${config.source}${config.assets}/**/*.*`, `!${config.source}${config.assets}/!**!/!*.svg`], { usePolling: true }, gulp.series(images))
    gulp.watch(toCopy, gulp.series(copy))
    gulp.watch(`${config.source}/${config.sprite}/**/*.svg`, { usePolling: true }, gulp.series(spriteSvg))
}


export const build = gulp.series(
    gulp.parallel(clear),
    gulp.parallel(html, css, images, copy, spriteSvg, js)
)

export const watch = gulp.series(build) // server
