/**
 * @file webpack configuration for dev
 * @author leon<ludafa@outlook.com>
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const atomStyleCompiler = require('./atom-style-compiler');

const port = process.env.PORT || 9000;
const root = path.join(__dirname, '..');
const pages = glob.sync('src/**/index.atom').map(page => {
    let name = page.slice(4, -11).replace(/\//g, '-').toLowerCase();
    return {
        origin: page,
        path: path.join(root, page),
        name: name
    };
});

const entries = pages.reduce((entries, page) => {
    entries[page.name] = page.path;
    return entries;
}, {});

module.exports = {
    entry: entries,
    output: {
        path: path.resolve('output/static'),
        filename: '[name].[chunkhash:8].js',
        umdNamedDefine: true,
        library: {
            root: 'main',
            amd: 'atom-webpack-starter/[name]'
        },
        libraryTarget: 'umd',
        publicPath: '/'
    },
    resolve: {
        alias: {
            atom: 'vip-server-renderer/js/atom.min.js'
        }
    },
    module: {
        rules: [
            {
                test: /index\.atom$/,
                use: [
                    'babel-loader',
                    path.resolve('tools/entry-loader.js')
                ]
            },
            {
                test: /\.atom$/,
                use: [
                    {
                        loader: 'atom-loader',
                        options: {
                            compile: {
                                compileJSComponent(val, key) {
                                    return `require("${val}")`;
                                },
                                compilePHPComponent(val, key) {
                                    return ''
                                        + 'dirname(__FILE__) . "/" '
                                        + '. ' + JSON.stringify(val + '.php');
                                },
                                compileStyle: atomStyleCompiler
                            },
                            resolvePhpOutputPath(filePath) {
                                let outputFilePath = filePath
                                    .replace(root, '.')
                                    .replace('src', 'output/template');
                                return `${outputFilePath}.php`;
                            },
                            loaders: {
                                css: ExtractTextPlugin.extract({
                                    fallback: 'style-loader',
                                    use: 'css-loader'
                                })
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules|tools/
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg|png|jpe?g|gif)$/,
                loader: 'file-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash:8].js',
            minChunks: 0
        }),
        new ExtractTextPlugin('[name].[contenthash:8].css'),
        // 为每个页面创建一个 template php 模板
        ...pages.map(({name, origin}) => {

            let filename = path.join(
                __dirname,
                '../output/template',
                `${origin.slice(4).replace(/\.atom$/, '.template.php')}`
            );

            return new HtmlWebpackPlugin({
                template: 'tools/template.js',
                filename: filename,
                chunks: ['vendor', name],
                source: origin,
                name: name
            });

        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ]
};
