var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./app/assets/core/javascripts/app.js'],
    output: {
      path: './public/javascripts/',
      filename: 'bundle.js',
      sourceMapFilename: 'bundle.js.map'
    },
    devtool: 'cheap-module-source-map',
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
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false,
        screw_ie8: true
    },
    comments: false,
    sourceMap: false
    })
    ],
    */