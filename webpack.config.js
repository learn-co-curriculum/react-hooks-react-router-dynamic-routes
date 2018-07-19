const path = require('path');
const webpack = require('webpack');

// env
const buildDirectory = './dist/';
var APP_DIR = path.resolve(__dirname, 'src/');
module.exports = {
  entry: APP_DIR + '/index.js',
  devServer: {
    hot: true,
    inline: true,
    port: 7700,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(buildDirectory),
    filename: 'app.js',
    publicPath: 'http://localhost:7700/dist',
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['airbnb', 'react', 'env', 'stage-0', 'stage-1'],
      },
    }],
  },
  plugins: [],
};
