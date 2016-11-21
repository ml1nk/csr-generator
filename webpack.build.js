var webpack = require("webpack");
var gutil = require("gutil");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

webpack({
  entry: './index.js',
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
      title: 'Schlüssel- und CSR Generator',
      filename: 'index.html',
      inject: true,
      template: './template.ejs'
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true})],
  externals: ["jsdom","openssl-wrapper","crypto"],
  resolve : {
    alias: {
      "node-forge" : path.join(__dirname, 'node_modules','csr-helper','forge.bundle.js')
    }
  }
}, function(err, stats) {
        if (err) { throw new gutil.PluginError('webpack:build', err); }
        gutil.log('[webpack:build]', stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
});
