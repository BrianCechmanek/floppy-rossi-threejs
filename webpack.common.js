const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		index: ['./public/index.ts']
	},
	plugins: [
		new CleanWebpackPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: './font/[hash].[ext]',
					}
				}
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.m?jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					}
				}
			}
		]
	}
};