// @flow

import path from 'path';
import webpack from 'webpack';

module.exports = {
    entry: './lib',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, use: ['babel-loader', 'source-map-loader'], exclude: /node_modules/},
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};
