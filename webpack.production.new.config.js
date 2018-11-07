const BundleTracker = require('webpack-bundle-tracker')
const config = require('./webpack.base.new.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

config.js.plugins = config.js.plugins.concat([
  new ExtractTextPlugin({
    filename: '[name]-[hash].css',
    allChunks: true,
    disable: true
  }),
  new BundleTracker({filename: '../backend/webpack-stats-production.json'}),
])

config.js.output = {
  path: path.resolve('../backend/static/bundles/production/'),
  filename: '[name]-[hash].js'
}

module.exports = [config.js]
