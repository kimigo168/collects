//1.cancel mouseRight context menu
window.document.oncontextmenu = function(){return false;}
//watch mouseRight event
obj.oncontextmenu = function(){myScript};
//2.in vue @mouseup/mousedown,@keyup/@keyup.enter = "login",in js mousewheel,mouseover,mouseout
//3.Base,js-base64 plugin,define global object of vue instance
Vue.prototype.$base64 = Base;
Vue.prototype.$global = global;
//4.how to define a vue plugin
exports.install = function(){}
//5.Date.prototype.format = function(formatStr)
//6.Regex,toGBK,toUTF-8
//7.define vue filter
Vue.filter("filterName", function(value) {});
//8.netstat -a -n 
Date.prototype.format = function(formatStr) {
  var date = {
      year: this.getFullYear(),
      month: this.getMonth() + 1,
      date: this.getDate(),
      day: this.getDay(),
      hours: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds(),
      time: this.getHours() >= 12 ? ["am", "\u4e0a\u5348"] : ["pm", "\u4e0b\u5348"]
    },
    reg = {
      year: /Y+/,
      date: /D+/,
      month: /M+/,
      day: /W/,
      hours: /h+/i,
      minutes: /m+/,
      seconds: /s+/,
      time: /t/i,
    },
    dateList = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"],
    k, _p
  for (k in reg) {
    _p = reg[k];
    formatStr = formatStr.replace(_p, function(segment, index, originStr) {
      var l = segment.length,
        value = date[k],
        str;
      switch (k) {
        case "day":
          str = dateList[value];
          break;
        case "hours":
          str = (segment.toLowerCase() === segment ? value % 12 : value).toString();
          break;
        case "time":
          str = segment.toLowerCase() === segment ? value[0] : value[1]
          break;
      }
      if (k != "day" && k != "time") {
        if (l === 1) {
          str = value
        } else {
          str = ("000" + value).slice(-l);
        }
      }
      return str;
    })
  }
  return formatStr
}
//10.
function PrefixInteger(num, length) {
  return (num/Math.pow(10,length)).toFixed(length).substr(2);
}
function PrefixInteger(num, length) {
  return ( "0000000000000000" + num ).substr( -length );
 }
function PrefixInteger(num, length) {
return (Array(length).join('0') + num).slice(-length);
}
//
//数字滚动
! function($, undefined) {
  var NumScroller = function(arg) {
    this.box = document.querySelector(arg.box);
    this.maxNum = arg.maxNum + 1;
    this.minNum = arg.minNum || 0;
    this.step = arg.step || 1;
    this.sideCount = arg.sideCount;
    this.itemHeight = parseInt(window.getComputedStyle(this.box).height);
    this.curNum = arg.curNum || this.minNum;
    this.deg = 360 / this.sideCount;
    this.tick = 0;
    this.callback = arg.callback || function() {};
    this.multiple = arg.multiple || 1;
    // debugger;
    this.init(arg.originNum);
  }

  NumScroller.prototype = {
    constructor: NumScroller,
    init: function(originNum) {
      var self = this,
        rad = (2 * Math.PI) / this.sideCount,
        line_a = this.itemHeight / 2,
        transZ = line_a / Math.tan(rad / 2),
        box = this.box,
        _tick = Math.floor((originNum - this.minNum) / this.step) || 0,
        i,
        sideCount;
      this.transZ = transZ;
      sideCount = this.sideCount = Math.floor(this.sideCount / 4) * 2 + 3;
      this.offset = Math.floor(this.sideCount / 2);
      box.style["-webkit-transform"] = "perspective(1000px) translateZ(0) rotateX(" + _tick * self.deg + "deg)";
      box.style["transform"] = "perspective(1000px) translateZ(0) rotateX(" + _tick * self.deg + "deg)";
      box.innerHtml = "";
      if (box.children.length == 0) {
        for (i = 0; i < sideCount; i++) {
          //添加 li　　
          var li = document.createElement("li");
          box.appendChild(li);
        }
      }

      this.bindEvent();
      this.freshSide();
      for (i = 0; i < _tick; i++) {
        this.ticker(1)
      }
    },
    getValue: function() {
      return this.curNum;
    },
    count: function(num) {
      var rang = this.maxNum - this.minNum,
        min = this.minNum,
        num = (((num - min) % rang + rang) % rang + min);
      // num = ((this.curNum + this.step - min) % rang + rang) % rang + min;
      return num;
    },
    freshSide: function() {
      var self = this,
        tick = this.tick,
        transZ = this.transZ,
        child = this.box.children,
        childCount = child.length;
      for (var i = 0; i < this.box.children.length; i++) {
        var _index = i - self.offset,
          _deg = self.deg * (_index + tick) * -1;
        this.box.children[i].style["-webkit-transform"] = "rotateX(" + _deg + "deg) translateZ(" + transZ + "px)";
        this.box.children[i].style["transform"] = "rotateX(" + _deg + "deg) translateZ(" + transZ + "px)";
        this.box.children[i].innerHTML = self.count((i - self.offset) * self.step + self.curNum) * this.multiple;
      };
    },
    ticker: function(direction) {
      this.tick += direction;
      // console.log(document.createElement("li"));

      // direction > 0 ? this.box.insertBefore(this.box) : this.box.appendChild(this.box);


      var box = this.box,
        // target = direction > 0 ? box.children().first().appendTo(box) : box.children().last().prependTo(box),
        target = direction > 0 ? box.children[0] : box.children[box.children.length - 1],
        _num = this.count(direction * this.step * (this.offset + 1) + this.getValue()),
        _deg = (this.offset * direction + this.tick) * -1 * this.deg;

      this.curNum = this.count(this.curNum += direction * this.step);
      target.style["-webkit-transform"] = "rotateX(" + _deg + "deg) translateZ(" + this.transZ + "px)";
      target.style["transform"] = "rotateX(" + _deg + "deg) translateZ(" + this.transZ + "px)";
      if (target && target.innerText) {
        target.innerHTML(_num);
      }

      // debugger;
    },
    bindEvent: function() {
      var box = this.box,
        o_deg = parseFloat(box.style.cssText.match(/rotateX\((\d*)deg\)/)[1]),
        p_start = 0,
        self = this,
        new_deg = 0,
        p_last = 0,
        distance,
        setTime
      box.addEventListener("mousewheel", function(e) {
        var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
          (e.detail && (e.detail > 0 ? -1 : 1)); // firefox
        var _tick;
        p_last += delta * 7;
        distance = p_last - p_start;
        new_deg = (-distance * 180) / (Math.PI * self.transZ) + o_deg;
        _tick = Math.round(new_deg / self.deg);

        // debugger
        box.style["-webkit-transform"] = "perspective(1000px) translateZ(0) rotateX(" + new_deg + "deg)";
        box.style["transform"] = "perspective(1000px) translateZ(0) rotateX(" + new_deg + "deg)";

        if (self.tick != _tick) {
          self.ticker(_tick - self.tick)
          self.tick = _tick;
        }
        self.freshSide() //fix
        window.clearInterval(setTime);
        setTime = setInterval(function() {
          o_deg = new_deg;
          p_last = 0;
          if (distance) {
            var _deg = Math.round(new_deg / self.deg) * self.deg;
            box.style["-webkit-transform"] = "perspective(1000px) translateZ(0) rotateX(" + _deg + "deg)";
            box.style["transform"] = "perspective(1000px) translateZ(0) rotateX(" + _deg + "deg)";
          }
          self.callback.call()
          window.clearInterval(setTime);
        }, 1000);
      }, false);

    }
  }
  window.NumScroller = NumScroller;
}(document)

//action
showDateSet() { // 显示日期设置弹窗
  let that = this;
  let calendarY, calendarM, calendarD; // 年月日
  //拼凑年月日，根据日期
  let ymdArr = new Date(this.orderInfo.fwddzb.zdqxsj).format("YYYY-M-D").split('-');
  let lastDay = new Date(ymdArr[0], ymdArr[1], 0).getDate(); //该月多少天
  this.$set(this, 'popObj', {
    show: true,
    popo: {
        title: '',
        type: '',
        msgHtml: `
        <div style='margin:3rem 0;position: relative;border-top:1px solid #dfdfe2;border-bottom:1px solid #dfdfe2;float:left;width:100%;'>
            <span style="position:absolute;left:0.3rem;top:0;width:4rem;font-size:.9rem;color:#000;line-height:2rem;margin-left:-1rem;"></span>
            <div id="calendarY" class="scroller" style="margin-left:-1rem;margin-right:3rem;">
                <span style="position:absolute;width:2rem;font-size:.9rem;color:#000;line-height:2rem;left:2.2rem;">年</span>
                <ul class="scrollBox"></ul>
            </div>
            <div id="calendarM" class="scroller" style="margin-left:-1rem;margin-right:3rem;">
                <span style="position:absolute;width:2rem;font-size:.9rem;color:#000;line-height:2rem;left:2rem;">月</span>
                <ul class="scrollBox"></ul>
            </div>
             <div id="calendarD" class="scroller" style="margin-left:-1rem">
                <span style="position:absolute;width:2rem;font-size:.9rem;color:#000;line-height:2rem;left:2rem;">日</span>
                <ul class="scrollBox"></ul>
            </div>
        </div>`,
        btnList: [
          {
            name: '取消',
            btnCls: 'white', //白色按钮
            handle: function() { //取消
              that.$set(that.popObj, 'show', false); //关闭输入取消订单弹窗
            }
          },
          {
            name: '确定',
            btnCls: 'green', //绿色按钮
            handle: function() { //确定
              that.$set(that.popObj, 'show', false); //关闭弹窗
              that.$set(that.setCalendar, 'year', that.setCalendar.calendarY.getValue()); // 年
              that.$set(that.setCalendar, 'month', that.setCalendar.calendarM.getValue());// 月
              that.$set(that.setCalendar, 'day', that.setCalendar.calendarD.getValue());// 日
              that.$set(that.setCalendar,'setCheckOutYear',that.setCalendar.year+'-'+that.setCalendar.month+'-'+that.setCalendar.day);
              that.$set(that,'date1',new Date(that.setCalendar.setCheckOutYear).format("YYYY-MM-DD"));
              console.log('setCheckOutYear', that.setCalendar.setCheckOutYear);
            }
          }
        ]
    }
  });
  setTimeout(function() {
    if (document.querySelector('#calendarY .scrollBox').children.length==0) {
        that.setCalendar.calendarY = new window.NumScroller({
          box: "#calendarY .scrollBox",
          maxNum: 9999,
          minNum: 1900,
          sideCount: 10,
          curNum: parseInt(ymdArr[0]),
          multiple: 1,
          callback: function() {
            console.log('YYYY',that.setCalendar.calendarY.getValue());
            that.updateDay(); // 更新日
            }
        });
    }
    if (document.querySelector('#calendarM .scrollBox').children.length==0) {
        that.setCalendar.calendarM = new window.NumScroller({
            box: "#calendarM .scrollBox",
            maxNum: 12,
            minNum: 1,
            sideCount: 10,
            curNum: parseInt(ymdArr[1]),
            multiple: 1,
            callback: function() { 
              console.log('MM',that.setCalendar.calendarM.getValue());
              that.updateDay(); // 更新日
            }
        });
    }
    that.updateDay(parseInt(ymdArr[2])); // 默认为2017-12-31
  }, 200);
}

updateDay(curNum){ // 年和月更改，日变化
  let that = this;
  that.setCalendar.calendarD = new window.NumScroller({
      box: "#calendarD .scrollBox",
      maxNum: new Date(that.setCalendar.calendarY.getValue(), that.setCalendar.calendarM.getValue(), 0).getDate(),
      minNum: 1,
      sideCount: 10,
      curNum: curNum || 1,
      multiple: 1,
      callback: function() { 
        console.log('DD',that.setCalendar.calendarD.getValue())
      }
  });
}

//calendar.js
$(function() {
  //��������ģ��
  $('#calendarWindow').each(function() {
      var pageJself = $(this);
      pageJself.find('.btn-cancel').onTouchEnd(function() {
          UIcontroler.toggle_cover();
      });
  });



  var startYear, startMonth, startDay, endYear, endMonth, endDay;

  function upDate() {
      $("#calendarWindow #startBox").attr('date', addZero(startYear.getValue()) + "-" + addZero(startMonth.getValue()) + "-" + addZero(startDay.getValue()));
      $("#calendarWindow #endBox").attr('date', addZero(endYear.getValue()) + "-" + addZero(endMonth.getValue()) + "-" + addZero(endDay.getValue()));
  }

  function startUpDateDay(curNum) {
      startDay = new $.NumScroller({
          box: "#calendarStratDay .scrollBox",
          maxNum: new Date(startYear.getValue(), startMonth.getValue(), 0).getDate(),
          minNum: 1,
          sideCount: 10,
          curNum: curNum || 1,
          callback: function() {
              upDate();
          }
      })
  };

  function endUpdateDay(curNum) {
      endDay = new $.NumScroller({
          box: "#calendarEndDay .scrollBox",
          maxNum: new Date(endYear.getValue(), endMonth.getValue(), 0).getDate(),
          minNum: 1,
          sideCount: 10,
          curNum: curNum || 2,
          callback: function() {
              upDate();
          }
      })
  };
  window.showSelectWin = function(stratDate) {
      var stratArray = stratDate.split('-');
      var lastDay = new Date(stratArray[0], stratArray[1], 0).getDate();
      var endYearC, endMonC, endDayC;


      if (stratArray[2]) {
          if (lastDay == stratArray[2]) {
              endDayC = 1;
              if (stratArray[1] == 12) {
                  endMonC = 1;
                  endYearC = parseInt(stratArray[0]) + 1;
              } else {
                  endMonC = parseInt(stratArray[1]) + 1;
                  endYearC = stratArray[0];
              }
          } else {
              endDayC = parseInt(stratArray[2]) + 1
              endMonC = stratArray[1];
              endYearC = stratArray[0];
          }
      } else {
          endDayC = 2;
          endMonC = stratArray[1];
          endYearC = stratArray[0];
      }


      startYear = new $.NumScroller({
          box: "#calendarStratYear .scrollBox",
          maxNum: 9999,
          minNum: 1900,
          curNum: parseInt(stratArray[0]),
          sideCount: 10,
          callback: function() {
              startUpDateDay();
              upDate();
          }
      });

      startMonth = new $.NumScroller({
          box: "#calendarStratMonth .scrollBox",
          maxNum: 12,
          minNum: 1,
          sideCount: 10,
          curNum: parseInt(stratArray[1]),
          callback: function() {
              startUpDateDay();
              upDate();
          }
      })


      endYear = new $.NumScroller({
          box: "#calendarEndYear .scrollBox",
          maxNum: 9999,
          minNum: 1900,
          curNum: parseInt(endYearC),
          sideCount: 10,
          callback: function() {
              endUpdateDay();
              upDate();
          }
      });

      endMonth = new $.NumScroller({
          box: "#calendarEndMonth .scrollBox",
          maxNum: 12,
          minNum: 1,
          sideCount: 10,
          curNum: parseInt(endMonC),
          callback: function() {
              endUpdateDay()
              upDate();
          }
      });
      endUpdateDay(endDayC);
      startUpDateDay(parseInt(stratArray[2]));
      upDate();
      UIcontroler.toggle_cover("calendarWindow");
  }
})

//////
// 相关页面跳转 只需传入pxid
exports.install = function(Vue, options) {
  
      //页面跳转
      Vue.prototype.$toPage = function(pxid) {
          let that = this;
          // if (this.$route.name == "orderConfirm") {
          //     this.$router.go(-1);
          //     setTimeout(function() {
          //         that.$toPage(pxid);
          //     }, 200);
          //     return;
          // };
  
          switch (pxid) {
              /*********房务*********/
              case '2140': //清洁分配
                  this.$router.push({
                      name: 'cleanAllocation'
                  });
                  break;
                  /*********房态*********/
              case '2478': //今日房态
                  this.$router.push({
                      name: 'todayStatus'
                  });
                  break;
              case '2159': //今日订单
                  this.$router.push({
                      name: 'todayOrder'
                  });
                  break;
              case '2162': //查单
                  this.$router.push({
                      name: 'trackOrder'
                  });
                  break;
              case '2160': //订房
                  this.$router.push({
                      name: 'roomReservation'
                  });
                  break;
              case '2479': //门锁管理
                  this.$router.push({
                      name: 'doorManage'
                  });
                  break;
                  /********订单*************/
              case '2502': //团房管理
                  this.$router.push({
                      name: 'groupHouse'
                  });
                  break;
              case '2184': //宾客管理
                  this.$router.push({
                      name: 'clientManage'
                  });
                  break;
              default:
                  this.$message({ 'message': '开发中....' + pxid, 'duration': 1500 });
                  break;
          }
      };
  
      //错误处理
      Vue.prototype.$errorPage = function(res) {
          var loading = this.$loading({ fullscreen: true }); //loading关闭
          setTimeout(function() { loading.close() }, 100);
  
          //刷新服务器时间
          localStorage.curTime = res.currentTime && res.currentTime.replace(/-/g, '/');
          console.log(localStorage.curTime)
          if (res.retCode == 1) {
              return false;
          } else if (res.retCode == -1) { //系统未登录
              this.$notify.error({
                  title: '错误',
                  message: res.msg
              });
              this.$router.push({ name: 'Login' });
              this.$router.options.routers = [];
          } else {
              this.$message({ 'message': res.msg, 'duration': 1500 });
              console.log('错误处理', res.retCode);
              return true;
          }
      };
  
      //base64
      // Vue.prototype.$base64 = function(str) {
      //     var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      //     var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      //         52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      //         15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      //         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
      //     var out, i, len;
      //     var c1, c2, c3;
      //     len = str.length;
      //     i = 0;
      //     out = "";
      //     while (i < len) {
      //         c1 = str.charCodeAt(i++) & 0xff;
      //         if (i == len) {
      //             out += base64EncodeChars.charAt(c1 >> 2);
      //             out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      //             out += "==";
      //             break;
      //         }
      //         c2 = str.charCodeAt(i++);
      //         if (i == len) {
      //             out += base64EncodeChars.charAt(c1 >> 2);
      //             out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      //             out += base64EncodeChars.charAt((c2 & 0xF) << 2);
      //             out += "=";
      //             break;
      //         }
      //         c3 = str.charCodeAt(i++);
      //         out += base64EncodeChars.charAt(c1 >> 2);
      //         out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      //         out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      //         out += base64EncodeChars.charAt(c3 & 0x3F);
      //     }
      //     return out;
      // }
  
      //to Gbk
      Vue.prototype.$toGBK = function(str1) {
              var substr = "";
              var a = "";
              var b = "";
              var c = "";
              var i = -1;
              i = str1.indexOf("%");
              if (i == -1) {
                  return str1;
              }
              while (i != -1) {
                  if (i < 3) {
                      substr = substr + str1.substr(0, i - 1);
                      str1 = str1.substr(i + 1, str1.length - i);
                      a = str1.substr(0, 2);
                      str1 = str1.substr(2, str1.length - 2);
                      if (parseInt("0x" + a) & 0x80 == 0) {
                          substr = substr + String.fromCharCode(parseInt("0x" + a));
                      } else if (parseInt("0x" + a) & 0xE0 == 0xC0) { //two byte
                          b = str1.substr(1, 2);
                          str1 = str1.substr(3, str1.length - 3);
                          var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                          widechar = widechar | (parseInt("0x" + b) & 0x3F);
                          substr = substr + String.fromCharCode(widechar);
                      } else {
                          b = str1.substr(1, 2);
                          str1 = str1.substr(3, str1.length - 3);
                          c = str1.substr(1, 2);
                          str1 = str1.substr(3, str1.length - 3);
                          var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                          widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                          widechar = widechar | (parseInt("0x" + c) & 0x3F);
                          substr = substr + String.fromCharCode(widechar);
                      }
                  } else {
                      substr = substr + str1.substring(0, i);
                      str1 = str1.substring(i);
                  }
                  i = str1.indexOf("%");
              }
  
              return substr + str1;
          }
          //图片处理事件
          //size"176X176","120X120","360X270","750X563"
      Vue.prototype.$urlImg = function(res, size) {
          if (!res) return;
          if (res.indexOf('/WEB-INF/attachment/') > -1) {
              let len = '/WEB-INF/attachment/'.length;
              let fileName = res.substring(len);
              // if (size) {
              //     fileName = fileName.replace('.', ('-' + size + '.'))
              // }
              // console.log(fileName, this.$toGBK(fileName));
              let baseFileName = Base64.encode(this.$toGBK(fileName));
              // console.log(baseFileName);
              baseFileName = baseFileName.replace('+', '|');
              // console.log(baseFileName);
  
              let url = '/engine/showfile.jsp?t=0&f=';
              return url + baseFileName;
          }
      }
  
      //日期事件差 算法
      Vue.prototype.$GetDateDiff = function(startTime, endTime, diffType) {
          startTime = startTime.replace(/\-/g, "/");
          endTime = endTime.replace(/\-/g, "/");
          //将计算间隔类性字符转换为小写
  
          diffType = diffType.toLowerCase();
  
          var sTime = new Date(startTime); //开始时间
          if (endTime == '') {
              var eTime = new Date(); //结束时间
  
          } else {
              var eTime = new Date(endTime); //结束时间
  
          }
  
          //作为除数的数字
          var divNum = 1;
          switch (diffType) {
              case "second":
                  divNum = 1000;
                  break;
              case "minute":
                  divNum = 1000 * 60;
                  break;
              case "hour":
                  divNum = 1000 * 3600;
                  break;
              case "day":
                  divNum = 1000 * 3600 * 24;
                  break;
              default:
                  break;
          }
          return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
      };
  
      //锁房方法
      Vue.prototype.$doLockRoom = function(obj) {
          this.$axios.post(this.$global.HOST.doLockUrl,
              this.$qs.stringify({
                  'type': obj.type || '',
                  'houseGuids': obj.houseGuids || '',
                  'begindates': obj.begindates || '',
                  'enddates': obj.enddates || '',
                  'userName': obj.userName || '',
                  'userId': obj.userId || '',
              })
          ).then((res) => {
              if (this.$errorPage(res.data)) return;
              obj.callback(res);
          }).catch((error) => {
              console.log(error)
          });
      };
  
      //多单支付
      Vue.prototype.$OrderSavePayInfo = function(obj) {
          this.$axios.post(this.$global.HOST.OrderSavePayInfo,
                  this.$qs.stringify({
                      'paydata': obj.paydata,
                  }))
              .then((res) => {
                  console.log('**********************888888888', res);
                  if (this.$errorPage(res.data)) {
                      return
                  };
                  obj.callback(res);
              }).catch((error) => {
                  console.log(error);
              })
      }
  
      //清空 null元素
      Vue.prototype.$delEmpty = function(obj) {
          for (var i in obj) {
              var val = obj[i];
              if (Object.prototype.toString.call(val) === '[object Array]' || Object.prototype.toString.call(val) === '[object Object]') {
  
                  if (Array.isArray(val)) {
                      if (val.length == 0) {
                          delete obj[i];
                          continue;
                      } else {
                          this.$delEmpty(val);
                      }
                  }
  
                  if (this.$isEmpty(val)) {
                      delete obj[i];
                  } else {
                      this.$delEmpty(val);
                  }
              } else {
                  if (val === '' || val === null || val === undefined) {
                      delete obj[i];
                  }
              }
          }
          return obj;
      }
  
      Vue.prototype.$isEmpty = function(obj) {
          if (obj === 0 || obj === '0') return false;
          for (var key in obj) {
              return false;
          }
          return true;
      }
  
      //替换当前页面 跳转
      Vue.prototype.$replacePage = function(obj) {
          this.$global.historyList.splice(this.$global.historyList.length - 1, 1);
          console.log('历史记录', this.$global.historyList);
          sessionStorage.historyList = JSON.stringify(this.$global.historyList);
          this.$router.replace(obj);
      }
  
      //会员计算
      //0 为删除，1为增加，2变更
      Vue.prototype.$vipMatch = function(num, resident, callback) {
          let that = this;
          console.log(resident);
          //计算会员
          that.$axios.post(that.$global.HOST.getOrderPriceByMemberDiscount, that.$qs.stringify({
              guid: resident.guid
          })).then(res => {
              if (that.$errorPage(res.data)) return;
  
              //协议价格
              let xyjg = res.data.result.fwddzb.ffyj * (resident.xyzk ? resident.xyzk : 0);
              console.log('协议价格', resident.xyzk, xyjg);
              if (res.data.result.isConfirm == 1) { //添加会员升降
                  if (num == 0) { //删除
                      that.$msgbox({
                          title: '',
                          type: 'warning',
                          message: that.$createElement('p', {
                              style: 'font-size:1.2rem;text-align:center;color:#000;margin:2rem 0;'
                          }, [
                              that.$createElement('p', null, `删除会员（${res.data.result.fwddzb.vipDiscount?res.data.result.fwddzb.vipDiscount+'%':'无'}折扣）`),
                              that.$createElement('p', null, '将调整房费'),
                              that.$createElement('p', null, `￥${parseFloat((xyjg&&xyjg<=res.data.result.fwddzb.ffxj)?xyjg:resident.ffxj).toFixed(2)}}调整到￥${parseFloat((xyjg&&xyjg>res.data.result.fwddzb.ffxj)?xyjg:res.data.result.fwddzb.ffxj).toFixed(2)}`)
                          ]),
                          showCancelButton: false,
                          showConfirmButton: false,
                          beforeClose: (action, instance, done) => {
                              done();
                          }
                      });
                  } else if (num == 1) {
                      that.$msgbox({ //添加
                          title: '',
                          type: 'warning',
                          message: that.$createElement('p', {
                              style: 'font-size:1.2rem;text-align:center;color:#000;margin:2rem 0;'
                          }, [
                              that.$createElement('p', null, `添加会员（${res.data.result.fwddzb.vipDiscount?res.data.result.fwddzb.vipDiscount+'%':'无'}折扣）`),
                              that.$createElement('p', null, '将调整房费'),
                              that.$createElement('p', null, `￥${parseFloat(resident.ffxj).toFixed(2)}调整到￥${parseFloat((xyjg&&xyjg>res.data.result.fwddzb.ffxj)?xyjg:res.data.result.fwddzb.ffxj).toFixed(2)}`)
                          ]),
                          showCancelButton: false,
                          showConfirmButton: false,
                          beforeClose: (action, instance, done) => {
                              done();
                          }
                      });
                  } else {
                      that.$msgbox({ //变更
                          title: '',
                          type: 'warning',
                          message: that.$createElement('p', {
                              style: 'font-size:1.2rem;text-align:center;color:#000;margin:2rem 0;'
                          }, [
                              that.$createElement('p', null, `变更会员（${res.data.result.fwddzb.vipDiscount?res.data.result.fwddzb.vipDiscount+'%':'无'}折扣）`),
                              that.$createElement('p', null, '将调整房费'),
                              that.$createElement('p', null, `￥${parseFloat(resident.ffxj).toFixed(2)}调整到￥${parseFloat((xyjg&&xyjg>res.data.result.fwddzb.ffxj)?xyjg:res.data.result.fwddzb.ffxj).toFixed(2)}`)
                          ]),
                          showCancelButton: false,
                          showConfirmButton: false,
                          beforeClose: (action, instance, done) => {
                              done();
                          }
                      });
                  }
              } else if (res.data.result.isConfirm == 2) {
                  that.$msgbox({ //低于协议价
                      title: '',
                      type: 'warning',
                      message: that.$createElement('p', {
                          style: 'font-size:1.2rem;text-align:center;color:#000;margin:2rem 0;'
                      }, [
                          that.$createElement('p', null, '会员折扣价不能低于协议价')
                      ]),
                      showCancelButton: true,
                      cancelButtonText: '按协议价',
                      confirmButtonText: '调整房价',
                      beforeClose: (action, instance, done) => {
                          if (action === 'confirm') {
                              //找到房费组件
                              this.$parent.$children.map(item => {
                                  if (item.$el.id == 'todayOrderRight') {
                                      item.$children.map(item2 => {
                                          if (item2.$el.className == 'orderConsumption') {
                                              item2.isShowRoomCharge = true; //显示房费详情弹窗
                                              item2.theRoomInfo.roomInfos = item2.roomData;
                                              item2.theRoomInfo.unitZk = item2.roomData.ddfjxxList[0].xyzk;
                                          }
                                      })
                                  }
                              })
                              done();
                          } else {
                              done();
                          }
                      }
                  });
              }
              //刷新右侧数据
              callback();
          });
      }
  
      //弹窗
      Vue.prototype.$popWindow = function(obj) {
          return;
          //整个弹窗
          let popWindow = document.getElementById('popWindow') || document.createElement("div");
          popWindow.id = 'popWindow';
          // 遮罩层
          let cover = document.getElementById('popCover') || document.createElement("div");
          cover.id = 'popCover';
          //创建弹窗
          let content = document.getElementById('popContent') || document.createElement("div");
          content.id = 'popContent';
          content.className = obj.show ? 'show' : '';
          setTimeout(function() {})
          content.style.display = obj.show ? 'block' : 'none';
  
          //接收传进的值 控制弹窗显示 或 隐藏
          popWindow.style.display = obj.show ? 'block' : 'none';
  
          //添加弹窗
  
  
          //如果弹出被创建 则不执行
          if (!document.getElementById('popWindow')) {
              document.getElementById('app').appendChild(popWindow);
              popWindow.appendChild(cover);
              popWindow.appendChild(content);
  
              //给遮罩层添加点击事件
              cover.addEventListener('click', function() {
                  console.log('我被点击了');
                  popWindow.style.display = 'none';
              }, false);
          }
      }
  
  };
  //////
  function getDaysInOneMonth(year, month){  
    month = parseInt(month, 10);  
    var d= new Date(year, month, 0);  
    return d.getDate();  
  }  
  //鼠标按钮监听，监听是按了哪个键
  //mouseup(e) e.button : 0,左，1中，2右键
  //页面初始加载
  function setPageSize() {
    if (window.innerWidth == 0) {
      setTimeout(function() {
        setPageSize()
      }, 200);;
    } else {
      // var winWidth = window.innerWidth;
      // window.document.documentElement.style.width = winWidth + "px";
      // document.documentElement.style.fontSize = ((window.innerWidth * 20) / 1920).toFixed(2) + "px";
  
      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;
      var fontWidth = (window.innerWidth * 20) / 1920;
      var fontHeight = (window.innerHeight * 20) / 1080;
      window.document.documentElement.style.width = winWidth + "px";
      window.document.documentElement.style.height = winHeight + "px";
  
      document.documentElement.style.fontSize = (fontWidth > fontHeight ? fontHeight : fontWidth).toFixed(2) + "px";
    }
  };
  //页面加载完毕后处理
  setPageSize();
  window.onload = function() {
    setPageSize();
    //禁止鼠标右键菜单显示
    document.oncontextmenu = function() {
      return false
    };
  };
  //页面宽度改变
  window.onresize = function() {
    setPageSize();
  }

  //main.js
  Vue.prototype.$base64 = Base64;
  
  Vue.prototype.$axios = axios;
  Vue.prototype.$qs = qs;
  //公共url
  Vue.prototype.$global = global;
  Vue.prototype.$model = model;


  //
  var bb = /^\/{1}.(\.jpg|png)$/
methods: {
      //点击左侧刷新数据
      clickLeftResData(index) {
        this.$emit('resLeftData', index);
      },
      //滚动事件
      scrollLeft: function(e){
        if((e.srcElement.clientHeight+e.srcElement.scrollTop)==e.srcElement.scrollHeight&&e.srcElement.scrollTop!=0){
          e.srcElement.scrollTop -= 10;
          this.$emit('scrollPushData','');
        }
      }
    },
    mounted() {
      console.log('接收的左侧数据',this.residentsLeft)
      // 左侧滚动加载数据
      let orderLeft = document.querySelector("#residentLeft");
      orderLeft.addEventListener("scroll", this.scrollLeft, false);
    }
