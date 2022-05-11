const { resolve } = require('path')
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  module: {
    rules: [
      { test: /\.(jpe?g|png|webp|gif|svg)$/i, type: 'asset' },
      { test: /\.(css|s[ca]ss)$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html')
    }),
    new DefinePlugin({
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.vue', '.js', 'json']
  },
  devServer: {
    port: 8080,
    open: true,
    compress: true,
    static: {
      directory: resolve(__dirname, 'src')
    }
  }
}