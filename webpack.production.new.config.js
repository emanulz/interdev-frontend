const BundleTracker = require('webpack-bundle-tracker')
const config = require('./webpack.base.new.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')

config.js.plugins = config.js.plugins.concat([
  new ExtractTextPlugin({
    filename: '[name]-[hash].css',
    allChunks: true,
    disable: true
  }),
  new BundleTracker({filename: '../backend/webpack-stats-production.json'}),
  new OptimizeCssAssetsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new BrotliPlugin({
    asset: '[path].br[query]',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8
  })
])

config.js.devtool = ''

config.js.output = {
  path: path.resolve('../backend/static/bundles/production/'),
  filename: '[name]-[hash].js'
}

config.js.optimization = {
  nodeEnv: 'production',
  minimize: true,
  minimizer: [
    new UglifyJsPlugin({
      sourceMap: true,
      extractComments: 'all',
      uglifyOptions: {
        output: {
          comments: false
        },
        warnings: false,
        drop_console: true
      }
    })
  ]
}

module.exports = [config.js]
