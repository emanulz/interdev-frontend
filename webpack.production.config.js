const BundleTracker = require('webpack-bundle-tracker')
const webpack = require('webpack')
const path = require('path')

const config = require('./webpack.base.config.js')

config.js.output = {
  path: path.resolve('../backend/static/bundles/production/'),
  filename: '[name]-[hash].js'
}
config.js.plugins = config.js.plugins.concat([
  new BundleTracker({filename: '../backend/webpack-stats-production.json'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  // new JavaScriptObfuscator({
  //   rotateUnicodeArray: true
  // }, []),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      // remove warnings
      warnings: false,

      // Drop console statements
      drop_console: true
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
])

config.styles.plugins = config.styles.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      // remove warnings
      warnings: true,
      // Drop console statements
      drop_console: true
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
])

module.exports = [config.js, config.styles]
