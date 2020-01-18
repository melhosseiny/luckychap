const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './app/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*','!img/**','!vid/**','!**.pdf','!**.txt'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.m?js$/,
        include: [
          path.resolve(__dirname, 'node_modules/lit-html'),
          path.resolve(__dirname, 'node_modules/pwa-helpers'),
          path.resolve(__dirname, 'node_modules/yall-js')
        ],
        loader: 'babel-loader'
      }
    ]
  }
};
