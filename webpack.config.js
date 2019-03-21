/* eslint-disable prefer-template */
// Another way: https://github.com/typescript-eslint/typescript-eslint/issues/109#issuecomment-462179033

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Can uninstall for v4?
const package = require('./package.json');

const curMode = 'development'; // development || production

function getPlugins(theMode) {
  const plugins = [
    // new uglifyJsPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ];

  if (theMode === 'development') {
    plugins.push(
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, 'src/examples/index.html'),
      }),
    );
  }

  plugins.push(new webpack.HotModuleReplacementPlugin());
  // plugins.push(new BundleAnalyzerPlugin());

  return plugins;
}

module.exports = {
  mode: curMode,
  entry: './src/index.ts',
  output: {
    library: 'MemoryForm',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: package.name + '.js',
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: getPlugins(curMode),
};
