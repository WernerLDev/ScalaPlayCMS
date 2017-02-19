var path = require('path');

module.exports = {
    entry: ['./app/assets/core/javascripts/app.js'],
    output: {
      path: './public/javascripts/',
      filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
        {
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
            presets: ['es2015', 'react']
            }
        }
        ]
  },
};