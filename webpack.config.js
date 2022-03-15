// const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: `[name].[hash:8].js`,
    chunkFilename: '[name].[hash:8].js'
  },
  devServer: {
    client: {
      logging: 'info',
      progress: true
    },
    compress: true,
    open: false, // Super annoying when you keep having to restart the server
    port: 8080 // Should adjust in future to check for open ports
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // test for styl files
        test: /\.styl(us)?$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                includeCSS: true,
                resovleURL: true,
                compress: true,
                import: [
                  path.resolve(__dirname, 'src/styles/variables.styl')
                ]
              }
            }
          }
        ]
      },
      {
        // test for css, scss, and sass files
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: true
    })
  ]
}