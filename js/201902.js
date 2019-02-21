// 1. function () {} , prototype来创建一个类，用class
// 2.requestAnimationFrame
window.requestAnimationFrame(callback)
// 取消
window.cancelAnimationFrame()
// requestAnimationFrame不管理回调函数，一帧调用多次，例如：
window.addEventListener('scroll', e => {
  window.requestAnimationFrame(timestamp => {
    Animation(timestamp)
  })
})
// 在上面代码中，scroll 事件可能在一帧内多次触发，所以 animation 函数可能会在一帧内重复绘制，造成不必要的计算和渲染。
// 一般节流函数来解决，因为节流函数是通过时间管理队列的，而 requestAnimationFrame 的触发时间是不固定的，
// 在高刷新频率的显示屏上时间会小于 16.67ms，页面如果被推入后台，时间可能大于 16.67ms。
// 完美的解决方案是通过 requestAnimationFrame 来管理队列，其思路就是保证 requestAnimationFrame 的队列里，同样的回调函数只有一个
const onScroll = e => {
  if (scheduledAnimationFrame) return;
  scheduledAnimationFrame = true;
  window.requestAnimationFrame(timestamp => {
    scheduledAnimationFrame = false
    animation(timestamp)
  })
}
window.addEventListener('scroll', onScroll)
//3.比较两个数组，对象是否相同
// Warn if overriding existing method
if(Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // compare lengths - can save a lot of time 
  if (this.length != array.length)
    return false;
  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;    
    }      
    else if (this[i] != array[i]) { 
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;  
    }      
  }    
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// 比较对象：
Object.prototype.equals = function(object2) {
  //For the first loop, we only check for types
  for (propName in this) {
    //Check for inherited methods and properties - like .equals itself
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    //Return false if the return value is different
    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
      return false;
    }
    //Check instance type
    else if (typeof this[propName] != typeof object2[propName]) {
      //Different types => not equal
      return false;
    }
  }
  //Now a deeper check using other objects property names
  for(propName in object2) {
    //We must check instances anyway, there may be a property that only exists in object2
      //I wonder, if remembering the checked values from the first loop would be faster or not 
    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
      return false;
    }
    else if (typeof this[propName] != typeof object2[propName]) {
      return false;
    }
    //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
    if(!this.hasOwnProperty(propName))
     continue;
    //Now the detail check and recursion
    //This returns the script back to the array comparing
    /**REQUIRES Array.equals**/
    if (this[propName] instanceof Array && object2[propName] instanceof Array) {
          // recurse into the nested arrays
      if (!this[propName].equals(object2[propName]))
            return false;
    }
    else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
          // recurse into another objects
          //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (!this[propName].equals(object2[propName]))
            return false;
    }
    //Normal value comparison for strings and numbers
    else if(this[propName] != object2[propName]) {
      return false;
    }
  }
  //If everything passed, let's say YES
  return true;
}

// 不严谨的方法：
JSON.stringify(a1) == JSON.stringify(a2)
a1.toString() == a2.toString()
// 这种方法在某些情况下是可行的，当两个数组的元素顺序相同且元素都可以转换成字符串的情况下确实可行
//，但是这样的代码存有隐患，比如数字被转换成字符串，数字“1”和字符串“1”会被认为相等，可能造成调试困难，不推荐使用。

