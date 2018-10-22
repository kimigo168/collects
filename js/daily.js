// 1.zepto.fn是一个对象，拥有zepto对象上所有可用的方法，如addClass(),在这个对象上添加一个方法，所有zepto对象上都能用到。
$.fn.empty = function(){return this.each(function(){this.innerHTML = ''})}
// 2.$.fx 全局的动画设置：
// $.fx.off:在支持css transition的浏览器中默认false,用true来禁止所有的animate()的transition;
// $.fx.speeds:用来设置动画时间对象
// 3.transitionend 在css完成过渡后修改<div>元素样式及文字，document.getElementById("myDiv").addEventListener("transitionend",myFun)
//4.animationend 在css动画完成之后，document.getElementById("myDiv").addEventListener("animationend",myFun)
// CSS 动画播放时，会发生以下三个事件：
// animationstart - CSS 动画开始后触发
// animationiteration - CSS 动画重复播放时触发
// animationend - CSS 动画完成后触发
//5.$.each遍历数组元素或以key value的形式遍历对象 $.each(['a','b'],function(index,item){console.log(item)})
//6.$.isFunction(object) 如果object是function,返回true,否则false
//7.$.isPlainObject(object) object = {} 或 new Object() 创建，返回true
// H5拖拽，如果被拖动元素有别元素覆盖，只能拖动部分，其余的显示的是覆盖的元素，解决？

{/* <panel id="panel" style="opacity: 0.6">
  <description id="pb">Drag Me</description>
</panel>  */}

<vbox align="start" style="border: 1px solid black;" ondragstart="startDrag(event)">
  <description>Drag Me</description>
</vbox>

function startDrag(event) {
  event.dataTransfer.setData("text/plain", "<strong>Body</strong>");
  event.dataTransfer.setDragImage(document.getElementById("panel"), 20, 20);
}
//8. ~1，~2 的二进制又不是 -2 ，-3 ，怎么会转换成这么奇怪的值？

// 网友解答：

// 按位取反还真和boolean没多大关系，大体流程是这样的：

// 就来看看~1的计算步骤：

// 将1(这里叫：原码)转二进制 ＝ 00000001
// 按位取反 ＝ 11111110
// 发现符号位(即最高位)为1(表示负数)，将除符号位之外的其他数字取反 ＝ 10000001
// 末位加1取其补码 ＝ 10000010
// 转换回十进制 ＝ -2
//9.for of vs for in ,[object Object] is not iterable! 
// 10.placeHolder颜色

let feeType = [];
for(let key in result) {
  feeType.push({
    'type': result[key],
    'action': false,  // 默认都不选中
    'status': key
  });
}
console.log('处理后的费用类别',feeType);
for(let index in this.houseList) { // 给房间数据附上费用类别选项
  this.$set(this.houseList[index], 'feeType', []);
  for(let i in feeType) {
    this.houseList[index].feeType.push({
      'type': feeType[i].type,
      'action': feeType[i].action,
      'status': feeType[i].status
    });
  }
}
// substring()只接受非负数
// slice,substr()
// new Date(2016, 7, 0).getDate();