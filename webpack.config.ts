import * as path from 'path'
import * as webpack from 'webpack'
import * as CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
    target: 'node',
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd',
        filename: './vimdb.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loaders: 'ts-loader' }
        ]
    },
    externals: [
        // Comment out the line below if you want to include node_modules in the bundle
        // nodeExternals()
    ],
    plugins: [
        // Comment out the lines below if you don't want to copy files to the build folder
        new CopyPlugin({ patterns: [
            { from: 'package.json', to: '.' }
        ]})
    ]
}

export default config