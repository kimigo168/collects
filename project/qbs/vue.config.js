module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '',
  productionSourceMap: false,
  devServer: {
    port: '8080',
    host: 'localhost',
    // host: '172.16.1.78',
    https: false,
    open: true,
    // proxy: 'http://localhost:4000' // 配置跨域处理，只有一个代理
    proxy: {
      '/': {
        ws: false,
        // target: 'http://172.16.36.114:9094', // 测试环境
        target: 'http://app.bkboole.com:8000', // 线上环境
        // target: 'http://172.16.1.135', // 马帅服务器
        // target: 'http://172.16.1.129:8083', // 陈健菲服务器
        // target: 'http://172.16.1.237', // 温博文服务器
        // target: 'http://114.119.5.9:9000', // uat测试
        changeOrigin: true,
        pathReWrite: {
          '^/': ''
        }
      }
    }
  }
}
