var webpack = require("webpack");
var gutil = require("gutil");
var HtmlWebpackPlugin = require('html-webpack-plugin');

webpack({
  entry: './index.js',
  watch: true,
  output: {
    path: './app/dist',
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=100000000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "url-loader?limit=100000000" },
      { test: /\.eot$/,    loader: "url-loader?limit=100000000" },
      { test: /\.svg$/,    loader: "url-loader?limit=100000000" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000000" },
      { test: /\.jpg$/, loader: "url-loader?limit=100000000" },
      { test: /\.gif$/, loader: "url-loader?limit=100000000" },
      { test: /\.html$/, loader: "html" }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
      title: 'csr-generator',
      filename: 'index.html',
      inject: true,
      template: './template.ejs'
    })],
  externals: ["jsdom"]
}, function(err, stats) {
        if (err) { throw new gutil.PluginError('webpack:build', err); }
        gutil.log('[webpack:build]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
});
