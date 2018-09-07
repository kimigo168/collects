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

// 6.拍照调用

// 开始拍照
var mediaStreamTrack;
function startPic() {
  let that = this;
  that.mediaStreamTrack = '';
  if (navigator.mediaDevices === undefined) { // 针对部分浏览器不支持mediaDevices
    navigator.mediaDevices = {};
  }
  
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices.getUserMedia({audio: true, video: {width:320, height: 320}}).then(stream => {
    mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
    var video = document.querySelector('video');
    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      video.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }
    video.onloadedmetadata = function (e) {
      video.play();
    };
  }).catch(err => {
    console.log(err);
    alert('调取摄像头失败');
  });
}
// 拍照
function shotPic() {
  var video = document.querySelector("#video");
  var context = document.getElementById("canvas").getContext("2d");
  context.drawImage(video, 0, 0, 300, 400);
}

//停止拍照
function stopPic() {
  mediaStreamTrack && mediaStreamTrack.stop();
}
// 将照片上传服务器
function uploadPic() {
  var imgData=document.getElementById("canvas").toDataURL("image/png");
  var mmmd=getBase64Image(document.getElementById("mmm"));

}
function getBase64Image(img) {
  var canvastemp = document.createElement("canvas");
  canvastemp.width = img.width;
  canvastemp.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL
}