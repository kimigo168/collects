'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/': {
        // target: 'https://app.allcitysz.com', // 晶报
        // target: 'https://app.xmrb.com', // 厦门日报
        // target: 'https://b-app.xmrb.com', // 
        // target: 'https://uat-app.xmrb.com', // 厦门uat
        // target: 'https://b-app.jinantimes.com.cn', // 济南uat
        // target: 'https://app.jinantimes.com.cn',
        // target: 'http://172.16.1.237:20001', // 温博文服务器
        // target: 'http://192.168.3.119:8080', // 
        // target: 'http://172.16.1.135:36666', // 马帅服务器
        // target: 'http://172.16.36.111:8081', // 开发环境
        // target: 'http://172.16.1.129:8080', // 陈健菲服务器
        target: 'http://172.16.36.114:9092', // 开发环境
        // target: 'http://oms.bkboole.com:8000', // 线上环境
        changeOrigin: true,
        pathReWrite: {
          '^/': ''
        }
      }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8089, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
