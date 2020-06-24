import * as path from 'path'
import * as webpack from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
import * as CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
    target: 'node',
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './app.bundle.js'
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
        nodeExternals()
    ],
    plugins: [
        // Comment out the lines below if you don't want to copy files to the build folder
        new CopyPlugin({ patterns: [
            { from: 'config/', to: 'config/' },
            { from: 'package.json', to: '.' }
        ]})
    ]
}

export default config