const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const { resolve } = require('path')

const webpackDevServerUrl = `http://${process.env.UI_HOST}`

const isProduction = process.env.NODE_ENV === 'production'

const src = resolve(__dirname, 'src')
const build = resolve(__dirname, 'build')

const plugins = require('@instructure/ui-webpack-config/config/plugins')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'
const ALLOWED_ENV = [
  'NODE_ENV',
  'OUTCOMES_HOST',
  'PUBLIC_SENTRY_DSN'
].concat(isProduction ? [] : [
  'CREATE_TOKEN',
  'CREATE_KINDERGARTEN_TOKEN',
  'CREATE_FIRST_GRADE_TOKEN',
  'REPORT_TOKEN',
  'INDIVIDUAL_REPORT_USER_UUID',
  'INDIVIDUAL_REPORT_TOKEN',
  'DEFAULT_HIGH_CONTRAST'
]).reduce((env, key) => {
  return Object.assign(env, {[`process.env.${key}`]: JSON.stringify(process.env[key])})
}, {})

Object.assign(exports, {
  context: src,
  entry: {
    bundle: ['./demo']
  },
  resolve: {
    extensions: ['.js', '.scss', '.json', '.svg'],
    modules: [resolve(__dirname), 'node_modules'],
    fallback: { 'process/browser': require.resolve('process/browser') }
  },
  output: {
    chunkFilename: '[name].[hash].js',
    filename: '[name].[hash].js',
    path: build,
    pathinfo: true,
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: src,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }]
      },
      {
        test: /\.(png|gif|svg|jpe?g)$/,
        include: src,
        loader: 'url-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: src,
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'application/font-woff'
        }
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: src,
        loader: 'file-loader'
      }
    ].concat(require('@instructure/ui-webpack-config/config/module/rules'))
  },
  plugins: plugins.concat([
    new webpack.DefinePlugin(ALLOWED_ENV),
  ]),
  resolveLoader: {
    modules: ['node_modules']
  }
})

if (isProduction) {
  // cloudgate deployed environments
  Object.assign(exports, {
    mode: 'production',
    bail: true,
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // once inst-ui generates var names differently
        // mangle can be set to true
        mangle: false,
        comments: false,
        compress: {
          screw_ie8: true,
          warnings: false
        }
      }),
      ...exports.plugins
    ]
  })
} else {
  // development, test, etc
  Object.assign(exports, {
    mode: 'development',
    devtool: 'cheap-source-map',
    devServer: {
      port: 8080,
      static: {
        directory: 'src/'
      },
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: true,
      hot: true,
      server: 'http',
      watchFiles: {
        paths: ['src/'],
        options: {
          usePolling: true,
          aggregateTimeout: 300,
          poll: 500
        },
      },
      allowedHosts: ['ui', 'api', '.docker', '.local.inseng.net', '.test'],
      webSocketServer: false,
      host: '0.0.0.0'
    },
    output: Object.assign(exports.output, {
      publicPath: webpackDevServerUrl
    }),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: 'index.html',
        minify: {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeScriptTypeAttributes: true,
          removeOptionalTags: true
        }
      }),
      ...exports.plugins
    ]
  })
}
