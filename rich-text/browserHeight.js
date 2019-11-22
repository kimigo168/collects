let obj = document.getElementById('obj')
let objRect = obj.getBoundingClientRect(); // 获取该标签距视口（页面）上下左右的距离
let top = objRect.top
let left = objRect.left

{/* <div id="wrap" style="height:100px;overflow:auto;">
  <div id="inner" style="height:200px;">content</div>
</div> */}

// onscroll,当元素的滚动条滚动时触发的事件

// scrollTop: 
// 元素滚动条内隐藏部分高度,只有dom元素才有，window/document没有

var top = element.scrollTop; // 返回数字
element.scrollTop = 200; // 设置值

// 获取整个文档的scrollTop
var scrollTop = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop // FF,CH || IE

// scrollHeight:
// 元素滚动条的内容高度，scrollHeight同scrollTop属性一样，只有DOM元素才有，window/document没有。
// 不同的是scrollHeight是只读，不可设置。
var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight
// scrollLeft, scrollWidth同理

// window.scroll(),window.scrollBy(),window.scrollTo()

// window.scroll(x,y)是让window滚动条滚动到那个x,y坐标。//x是水平坐标，y是垂直坐标。
// window.scrollBy(-x,-y)是让window滚动条相对滚动到某个坐标，- 10即相对向左/向上滚动10像素。
// window.scrollTo(x,y)和window.scroll(x,y)一样。

// clientWidth:
// Element.clientWidth,元素内部宽度，包括内边距 width + padding
// offsetWidth:
// 实际宽度 + 左右padding + 左右border
// offsetHeight:
// 实际高度 + 上下padding + 上下border

// offsetTop:
// 当前元素上边框外边缘到最近已定位父级上边框内边缘的距离，如果父元素没有定位，到body顶部
// offsetLeft： 同理


// 获取设备显示屏的高度：
// window.screen.height
// 屏幕的可用高度：
window.screen.availHeight // window.screen.height - 底部工具栏

// 当前文档中，body元素高度：
document.body.clientHeight


// document.documentElement返回的是一个文档对象，html对象
document.documentElement.clientHeight // html的可用高度