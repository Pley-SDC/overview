const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  plugins: [
    new CompressionPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        loaders: 'babel-loader',
        test: /\.jsx?$/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
};
