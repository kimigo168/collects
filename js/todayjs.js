// 1.关闭浏览器，监听
window.onbeforeunload = function () {
  console.log('evnet',event);
  event.returnValue = "我在这写点东西...";
}
window.onunload = function (){
  cancelLock();
}
// 2.获取请求参数

/***********************获取URL 参数********************/
var GetRequest = function() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
  }
  return theRequest;
}
// 3.区分ios 和安卓
/*check ios ad*/
  $.check_ios_ad = function(obj) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        try {
            obj.ios.call(this);
        } catch (e) {
            console.log('请用APP浏览!');
        }
    } else if (/(Android)/i.test(navigator.userAgent)) {
        try {
            obj.ad.call(this);
        } catch (e) {
            console.log('请用APP浏览!');
        }
    } else {
        return;
    }
}
$.check_ios_ad({
  "ios": function() {
      $('.page-head').hide();
      $('.main').removeClass('ad');
  },
  "ad": function() {
      //二维码进入
      if (request.headhide) {
          $('.page-head').hide();
          $('.main').removeClass('ad');
      } else {
          $('.page-head').show();
          $('.main').addClass('ad');
      }

  }
});
// 4.substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
// stringObject.substr(start,length) substring() vs substr()
//5.for of for in 