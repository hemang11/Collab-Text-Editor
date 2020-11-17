const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    quill: './quill.js'
  },
  //watch:true,  // Now webpack will watch the file for changes so no need to rebuild again and again
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].bundle.js',
    publicPath: '/quill/dist/'
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    publicPath: '/dist/'
  }
}
