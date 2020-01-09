const path = require('path')

module.exports = {
  publicPath: './',
  devServer: {
    host: '127.0.0.1',
    port: 8080
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
  }
}
