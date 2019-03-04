var path    = require('path');
var hwp     = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
		let index = '/src/dev-index.js';
		if (argv.mode === "production") {
			index = '/src/index.js';
		}
		return {
			entry: path.join(__dirname, index),
			output: {
					filename: 'build.js',
					path: path.join(__dirname, '/dist')
			},
			resolve: {
				extensions: ['.js', '.jsx']
			},
			module:{
					rules:[
						{
								exclude: /node_modules/,
								test: /\.js$|\.jsx$/,
								loader: 'babel-loader',
								query: {
									presets: ['es2015', 'react']
								}
						},
						{
							test: /\.css$/,
							use: ['style-loader', 'css-loader'],
						},
						{
							test: /\.(png|svg|jpg|gif)$/,
							use: [
							 'file-loader'
							]
						},
					]
			},
			plugins:[
					new hwp({template:path.join(__dirname, '/src/index.html')}),
					new CopyPlugin([
						{ from: 'public/img/', to: 'img/' },
						{ from: 'public/manifest.json', to: '' },
						{ from: 'public/favicon.ico', to: '' },
						{ from: 'fbapp-config.json', to: '' },
					]),
			]
		};
}
