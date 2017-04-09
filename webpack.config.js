const webpack = require('webpack');
const path = require('path');
// const nodeExternals = require('webpack-node-externals');
const execSync = require('child_process').execSync;

const version = require('./package.json').version;
const git_rev = execSync("git rev-list --count HEAD", {silent: true}).toString().trim();
const git_hash = execSync("git rev-parse --short HEAD", {silent: true}).toString().trim();
const git_date = execSync("git show -s --format=%ci HEAD", {silent: true}).toString().trim();

module.exports = config = {

    context: path.join(__dirname, 'src'),

    entry: {
        background: './background.coffee',
        popup: './popup.coffee',
        // options: './options.coffee',
        manager: './manager.coffee',
    },

    resolve: {
        extensions: ['.coffee'],
        modules: [__dirname, 'node_modules'],
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        // libraryTarget: 'commonjs2',
    },

    // externals: [nodeExternals()],

    target: 'web',

    stats: "minimal",

    // devtool: 'cheap-module-eval-source-map',
    // watch: true,
    watchOptions: {aggregateTimeout: 500, ignored: /node_modules/},

    module: {
        rules: [
            {test: /\.coffee$/, use:['coffee-loader']},
            {test: /\.yaml$/, use:[{loader:'file-loader', options:{name:'[path][name].json'}}, 'yaml-loader']},
            {test: /\.pug$/, use: [
                {loader: 'file-loader', options: {name: '[name].html'}},
                'extract-loader',
                {loader: 'html-loader', options: {attrs: ['img:src', 'link:href']}},
                {loader: 'pug-html-loader', options: {pretty: true}},
            ]},
            {test: /\.css$/, use: [
                {loader: 'file-loader', options: {name: '[name].css'}},
                'extract-loader',
                'css-loader',
            ]},
            {test: /\.sass$/, use: [
                {loader: 'file-loader', options: {name: '[name].css'}},
                'extract-loader',
                'css-loader',
                {loader: 'sass-loader', options: {indentedSyntax: true}},
            ]},
        ]
    },

};

if(process.env.NODE_ENV == 'production'){

    console.log('----->> Executando em modo PRODUÇÃO <<-----\n');

    config.watch = false;

    config.devtool = 'source-map';

    config.plugins = [
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: true,
            },
        }),

        new webpack.BannerPlugin({
            banner: 'Tagged'
                + '\nrev: ' + git_rev + '-' + git_hash + ' de ' + git_date
                + '\n@author xgvargas'
                + '\n@version ' + version
                + '\n@copyright (C) 2017 Gustavo Vargas'
                + '\n@license MIT',
            raw: false,
            entryOnly: true,
        }),
    ];
}
