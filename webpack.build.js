const webpack = require('webpack');
const gutil = require('gutil');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

webpack({
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: path.join(__dirname, 'app', 'dist'),
    filename: 'index.min.js',
  },
  module: {
    loaders: [
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?limit=100000000&mimetype=application/font-woff'},
      {
        test: /\.ttf$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.eot$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.svg$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?minimize=true'},
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.gif$/,
        loader: 'url-loader?limit=100000000'},
      {
        test: /\.html$/,
        loader: 'html-loader'},
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'index.js'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules', 'csr-helper'),
        ],
        use: [{loader: 'babel-loader', options: {presets: ['latest']}}],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.min.html',
      inject: true,
      template: './template.ejs',
    }),
    new webpack.optimize.UglifyJsPlugin(
      {
        minimize: true,
        mangle: true,
        compress: {warnings: false},
      }),
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
        VERSION_TIME: Date.now(),
    })],
    externals: ['jsdom', 'openssl-wrapper', 'crypto'],
}, (err, stats) => {
  if (err) {
    throw new gutil.PluginError('webpack:build', err);
  }
  gutil.log('[webpack:build]', stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true,
  }));
});
