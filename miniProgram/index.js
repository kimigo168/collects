// 小程序的逻辑层和渲染层是分开的，逻辑层运行在JSCore中，并没有一个完整浏览器对象，缺少DOM和BOM api

// 网页开发需要面对各式各样的浏览器，PC端需要面对IE,Chrome,QQ浏览器，移动端需要面对Safari,Chrome以及iOS、Android系统中的各式WebView。而小程序需要面对两大操作系统，iOS和Android微信端，以及辅助开发者工具。

// 1.iOS
// 逻辑层: JavaScriptCore
// 渲染层： WKWebView
// 2.安卓
// 逻辑层： V8
// 渲染层：chromium定制内核
// 3.小程序开发者工具
// 逻辑层：NWJS
// 渲染层：Chrome WebView

// 小程序的渲染层和逻辑层分别由2个线程管理：渲染层的界面使用了WebView进行渲染，逻辑层采用JsCore线程运行JS脚本.

// onload,onshow 页面
// var obj = wx.getLaunchOptionsSync() 获取场景值

// onLoad => onShow => onReady,都可以拿到app实例

// 调用共同的方法，数据：
// (1) behaviors可以让多个页面有相同的数据字段和方法（2.9.2开始）
module.exports = Behavior({
  data: {
    sharedText: 'this is a piece of data shared between pages.'
  },
  methods: {
    sharedMethod: function () {
      this.data.sharedText === 'this is a piece of data shared between pages.'
    }
  }
})
// page-a.js
var myBehavior = require('./my-behavior.js')
Page({
  behavior: [myBehavior],
  onLoad: function () {
    this.data.sharedText === 'This is a piece of data shared between pages.'
  }
})
// (2) app.js 中绑定事件，globalData定义数据

// 页面生命周期：
start => create => created => onLoad => onShow => onReady => onHide => onShow => destory => onUnload

// 页面路由：
// 打开新页面, wx.navigateTo <navigator open-type="navigateTo" />
// 页面重定向，wx.redirectTo <navigator open-type="redirectTo" />
// 页面返回，wx.navigateBack <navigator open-type="navigateBack" />
// Tab 切换， wx.switchTab() <navigator open-type="switchTab" />
// 重启动, wx.reLaunch <navigator open-type="reLaunch" />

// navigateTo, redirectTo 只能打开非 tabBar 页面。
// switchTab 只能打开 tabBar 页面。
// reLaunch 可以打开任意页面。


// common.js
function sayHello (name) {
  console.log(`Hello ${name}!`)
}
function sayGoodbye (name) {
  console.log(`Goodbye ${name}!`)
}
moudule.exports.sayHello = sayHello
exports.sayGoodbye = sayGoodbye

var common = require('common.js')
Page({
  helloMina: function () {
    common.sayHello('MINA')
  }
})

// 模板和组件引用

// rpx
// iphone6,屏幕宽度375px,共750个物理像素，750rpx = 375px = 750物理像素
// 1rpx = 0.5px = 1物理像素
// 像素分为物理像素和逻辑像素
// 物理像素：设备像素，如iphone 6, 1334 * 750,横向750个物理像素，纵向1334个
// 逻辑像素：css像素，如chrome调试工具，iphone6 是 667 x 375,和物理像素比，长宽减少了2倍，面积减少了4倍。经常说retine屏幕用四个物理像素表示一个逻辑像素

// PPI, Pixels per inch,每英寸像素，也称像素密度,PPI = dp / di，物理像素取决于ppi

// DPR Device Pixel Ratio，设备像素比
// 物理像素 = 逻辑像素 * dpr

