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
  new BundleTracker({filename: '../backend/webpack-stats-local.json'})
])

config.js.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}

config.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}

config.js.output = {
  path: path.resolve('../backend/static/bundles/local/'),
  filename: '[name]-[hash].js',
  publicPath: 'http://192.168.9.53:8080/static/bundles/local/' // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
}

// config.styles.plugins = config.styles.plugins.concat([
//   new BundleTracker({filename: '../backend/webpack-stats-css-local.json'})
// ])

// config.styles.devServer = {
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//     'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
//   }
// }

// config.styles.output = {
//   path: path.resolve('../backend/static/bundles/local/css/'),
//   filename: '[name]-[hash].css',
//   publicPath: 'http://192.168.9.53:8080/static/bundles/local/css/' // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
// }

module.exports = [config.js]
