const BundleTracker = require('webpack-bundle-tracker')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const config = require('./webpack.base.config.js')

config.js.plugins = config.js.plugins.concat([
  new LiveReloadPlugin(),
  new BundleTracker({filename: '../backend/webpack-stats-local.json'})
])

config.styles.plugins = config.styles.plugins.concat([
  new LiveReloadPlugin(),
  new BundleTracker({filename: '../backend/webpack-stats-css-local.json'})
])

module.exports = [config.js, config.styles]
