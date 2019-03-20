const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Can uninstall for v4?
const mode = 'development'; // development || production

function getPlugins(mode) {
  let plugins = [
    // new uglifyJsPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ];

  if (mode === 'development') {
    plugins.push(new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/example/index.html')
    }));
  }

  plugins.push(new webpack.HotModuleReplacementPlugin());
  // plugins.push(new BundleAnalyzerPlugin());

  return plugins;
}

module.exports = {
  mode: mode,
  entry: './src/index.ts',
  output: {
    library: 'MemoryForm',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: require('./package.json').name + '.js'
  },
  module: {
    rules: [{
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: getPlugins(mode)
};
