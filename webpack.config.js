const path = require ('path')
const nodeExternals = require('webpack-node-externals')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const clientConfig = {
	target: 'web',
	mode: 'development',
	entry: {
		main: path.resolve(__dirname, 'src', 'index.js')
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'js/index.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.node$/,
				use: 'node-loader'
			},
			{
				test: /\.vue$/,
				use: {
					loader: 'vue-loader',
					options: {
						extractCSS: true,
						loaders: {
							sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
							scss: 'vue-style-loader!css-loader!sass-loader'
						}
					}
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000,
						name: 'imgs/[name]--[folder].[ext]'
					}
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/[name]--[folder].[ext]'
				}
			},
			{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000,
						name: 'fonts/[name]--[folder].[ext]'
					}
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'style.css'
		})
	],
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.js'
		},
		extensions: ['.js', '.vue', '.json', '.css', '.node']
	},
	devtool: 'source-map',
	watch: true
}

const serverConfig = {
	target: 'node',
	node: {
		__dirname: true
	},
	externals: [nodeExternals()],
	mode: 'development',
	entry: {
		main: path.resolve(__dirname, 'server.js')
	},
	output: {
		path: path.resolve(__dirname),
		filename: 'server.bundle.js'
	},
	devtool: 'source-map',
	watch: true
}

module.exports = [ clientConfig, serverConfig ]