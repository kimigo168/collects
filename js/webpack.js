// 打包多页面应用，html-webpack-plugin,一个对象只能打出一个html页面
module.exports = {
  entry: {
    index: './src/index.js', // 指定打包输出的chunk 名为index
    foo: './src/foo.js' // 指定打包输出的chunk名为foo
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 要打包输出哪个文件，可以使用相对路径
      filename: 'index.html', // 打包输出后该html文件的名称
      chunks: ['index'] // 数组元素为chunk名称，及entry属性值为对象的时候指定的名称，index页面只引入index.js
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // 要打包输出哪个文件，可以使用相对路径
      filename: 'foo.html', // 打包输出后该html文件的名称
      chunks: ['foo'] // 数组元素为chunk名称，即entry属性值为对象的时候指定的名称，foo页面只引入foo.js
    })
  ]
}