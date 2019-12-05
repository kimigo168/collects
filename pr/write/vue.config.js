module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // mode:history
  publicPath: process.env.NODE_ENV === 'production' ? '' : '', // mode: hash
  productionSourceMap: false,
  devServer: {
    port: '8080',
    host: 'localhost',
    // host: '172.16.1.27',
    https: false,
    open: true,
    // proxy: 'http://localhost:4000' // 配置跨域处理，只有一个代理
    proxy: {
      '/': {
        ws: false,
        // target: 'http://aiwriter.giiso.com',
        // target: 'http://aiwriter-uat.giiso.com',
        // target: 'https://www.giiso.com',
        // target: 'https://pre-cworks.giiso.com',
        // target: 'http://aiwriter-uat.giiso.com',
        // target: 'http://172.16.1.135:9090', // 马帅服务器
        // target: 'http://172.16.1.145:9090', // 李勇斌服务器
        // target: 'http://172.16.1.237', // 温博文服务器
        target: 'http://172.16.1.147:9090', // 付永乐服务器
        changeOrigin: true,
        pathReWrite: {
          '^/': ''
        }
      }
    }
  }
}
