
const webpack = require('webpack')
const merge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const baseConfig = require('./webpack.production.new.config')

const productionConfiguration = function (env) {
  const NODE_ENV = 'production'
  return {
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) }),
      new OptimizeCssAssetsPlugin()
    ]
  }
}

module.exports = merge.smart(baseConfig, {
  minimizer: [
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          inline: false
        }
      }
    })
  ],
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      default: false,
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor_app',
        chunks: 'all',
        minChunks: 2
      }
    }
  }
}, productionConfiguration)
