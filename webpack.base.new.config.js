const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  // TODO: Add common Configuration
  module: {}
}

const jsConfig = Object.assign({}, config, {
  context: __dirname,
  devtool: 'inline-sourcemap',
  name: 'js',
  entry: {
    // home: './apps/home/app.js',
    // admin: './apps/admin/app.js',
    sales: './apps/sales/app.js',
    seller: './apps/seller/app.js',
    // credits: './apps/credits/app.js',
    // workshop: './apps/workshop/app.js',
    // inventories: './apps/inventories/app.js',
    // purchases: './apps/purchases/app.js',
    // payables: './apps/payables/app.js',
    // returns: './apps/returns/app.js',
    // restaurant: './apps/restaurant/app.js',
    // notes: './apps/notes/app.js'
  },
  module: {
    rules: [
      {
        test: /\.(sass|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader'
        ]

      }
    ]
  },

  plugins: []

})

// const stylesConfig = Object.assign({}, config, {
//   context: __dirname,
//   devtool: debug ? 'inline-sourcemap' : '',
//   name: 'styles',
//   entry: {
//     home: './apps/home/appstyles/main.sass',
//     // // reports: './apps/reports/appstyles/main.sass',
//     // admin: './apps/admin/appstyles/main.sass',
//     // sales: './apps/sales/appstyles/main.sass',
//     // credits: './apps/credits/appstyles/main.sass',
//     // inventories: './apps/inventories/appstyles/main.sass',
//     // workshop: './apps/workshop/appstyles/main.sass',
//     // purchases: './apps/purchases/appstyles/main.sass',
//     // payables: './apps/payables/appstyles/main.sass',
//     // seller: './apps/seller/appstyles/main.sass',
//     // returns: './apps/returns/appstyles/main.sass',
//     // restaurant: './apps/restaurant/appstyles/main.sass',
//     // notes: './apps/notes/appstyles/main.sass'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(sass|css)$/,
//         loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
//       }
//     ]
//   },

//   plugins: [
//     new ExtractTextPlugin({filename: '[name]-[hash].css', allChunks: true, ignoreOrder: true})
//   ]

// })

module.exports = {js: jsConfig}
