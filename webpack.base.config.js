const debug = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const path = require('path')
// const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const LiveReloadPlugin = require('webpack-livereload-plugin')
// const JavaScriptObfuscator = require('webpack-obfuscator')

const config = {
  // TODO: Add common Configuration
  module: {}
}

const jsConfig = Object.assign({}, config, {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  name: 'js',
  entry: {
    home: './apps/home/app.js',
    reports: './apps/reports/app.js',
    admin: './apps/admin/app.js',
    sales: './apps/sales/app.js',
    seller: './apps/seller/app.js',
    credits: './apps/credits/app.js',
    workshop: './apps/workshop/app.js',
    inventories: './apps/inventories/app.js',
    purchases: './apps/purchases/app.js',
    payables: './apps/payables/app.js',
    returns: './apps/returns/app.js',
    restaurant: './apps/restaurant/app.js',
    notes: './apps/notes/app.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader'
        ]

      }
    ]
  },
  output: {
    path: path.resolve('../backend/static/bundles/local/'),
    filename: '[name]-[hash].js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      // (the commons chunk name)

      filename: 'vendors-[hash].js'
      // (the filename of the commons chunk)

      // minChunks: 3,
      // (Modules must be shared between 3 entries)

      // chunks: ['pageA', 'pageB'],
      // (Only use these entries)
    })
  ]

})

const stylesConfig = Object.assign({}, config, {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : '',
  name: 'styles',
  entry: {
    home: './apps/home/appstyles/main.sass',
    // reports: './apps/reports/appstyles/main.sass',
    admin: './apps/admin/appstyles/main.sass',
    sales: './apps/sales/appstyles/main.sass',
    credits: './apps/credits/appstyles/main.sass',
    inventories: './apps/inventories/appstyles/main.sass',
    workshop: './apps/workshop/appstyles/main.sass',
    purchases: './apps/purchases/appstyles/main.sass',
    payables: './apps/payables/appstyles/main.sass',
    seller: './apps/seller/appstyles/main.sass',
    returns: './apps/returns/appstyles/main.sass',
    restaurant: './apps/restaurant/appstyles/main.sass',
    notes: './apps/notes/appstyles/main.sass'
  },
  module: {
    rules: [
      {
        test: /\.(sass|css)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  output: {
    path: path.resolve('../backend/static/bundles/local/'),
    filename: './[name]-[hash].css'
  },

  plugins: [
    new ExtractTextPlugin({filename: './[name]-[hash].css', allChunks: true, ignoreOrder: true})
  ]

})

module.exports = {js: jsConfig, styles: stylesConfig}
//   jsConfig, stylesConfig
// ]
