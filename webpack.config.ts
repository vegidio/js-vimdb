import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
    target: 'node',
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd',
        filename: './vimdb.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
};

export default config;
