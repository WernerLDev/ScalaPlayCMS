var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./app/assets/core/javascripts/app.js'],
    output: {
      path: './public/javascripts/',
      filename: 'bundle.js',
      sourceMapFilename: 'bundle.js.map'
    },
    devtool: 'source-map',
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



/*
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        }
        })
    ],
    */