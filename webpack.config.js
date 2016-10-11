var webpack = require('webpack');
// NODE_ENV = 'production';
module.exports = {
  entry: [
    // 'webpack/hot/only-dev-server',
    './src/app.js'
  ],
  devtool: 'cheap-module-source-map',
  output: {
    path: './build',
    filename: 'app.js',
    publicPath: './build/'
  },
  module: {
    loaders: [
      { test: /\.css$/, loaders: ['style','css'] },
      { test: /\.scss$/, loaders:['style','css','sass']},
      // { test: /\.jpe?g$|\.gif$|\.png$/i,loader: 'url?limit=100&name=[path][name].[ext]' },
      { test: /\.jpe?g$|\.gif$|\.png$/i,loader: 'file?name=[path][name].[ext]' },
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ }
    ]
  },
  resolve:{
    extensions:['','.js','.json']
  },
  // recordsPath: './record/webpack.records.json',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
