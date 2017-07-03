// @flow

import path from 'path';
import webpack from 'webpack';
import FlowBabelWebpackPlugin from 'flow-babel-webpack-plugin';


module.exports = {
    entry: './js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: "/public/"
    },
    module: {
        rules: [
            {   
                test: /\.(js|jsx)$/,
                use: ['babel-loader', 'source-map-loader'], 
                exclude: /node_modules/ 
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new FlowBabelWebpackPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true
    },
};
