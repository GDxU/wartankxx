var webpack = require('webpack');

module.exports = {
	entry: './entry.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=../images/[name].[ext]' } 
		]
	},
	plugins: [
		new webpack.BannerPlugin('this file is create by sad')
	]
};