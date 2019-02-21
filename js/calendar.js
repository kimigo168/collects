  //时间转换
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

function createCalendar (date) { // 当前年月 YYYY-M-D
  // 当前
  let y = new Date(date).format('YYYY'); // 年
  let m = new Date(date).format('M'); // 月
  let days = new Date(y, m, 0).getDate(); // 返回所指月份的某一天  m:0代表1月份，1代表2月份，///  0表示上个月最后一天
  let date = date.split('-');
  let lastDate = new Date(date[0], date[1], 0).getDate(); // 当前月多少天
  let indexDate = new Date(date[0]+'/'+date[1]+'/'+1).getDay(); // 获取月份第一天，星期几
  let endDate = 7 - ((lastDate + indexDate) % 7); // 结束日期,星期几
  let newArray = new Array();
  let today = new Date(localStorage.curTime).format('YYYY-MM-DD').split('-');
  // 日期开始空白区域
  for (let i = 0; i < indexDate; i++) {
    newArray.push({
      text: 0,
      num: 0,
      date: 0
    });
  };
  // 显示区域
  for (let j = 0; j < lastDate; j++) {
    newArray.push({
      date: parseInt(date[0]) + '-' + (parseInt(date[1]) <10 ? '0'+parseInt(date[1]):parseInt(date[1])) + '-' + ( (j + 1) <10 ?'0'+(j+1):(j+1)),
      text: parseInt(date[0]) == parseInt(today[0]) && parseInt(date[1]) == parseInt(today[1]) && parseInt(j + 1) == parseInt(today[2]) ? '今天' : (j + 1),
      num: listArr[j].num,
      isCheckIn: dataArr?dataArr[new Date( parseInt(date[0])+'/'+parseInt(date[1])+'/'+(j+1)).format('YYYY-MM-DD')]['ischeckIn']: '',
      isBeforeToday: (this.$GetDateDiff(new Date(localStorage.curTime).format('YYYY-MM-DD'),new Date( parseInt(date[0])+'/'+parseInt(date[1])+'/'+(j+1)).format('YYYY-MM-DD') , 'day') < 0) ? 1 : 0
    });
  };
  // 日期结束填空白
  if (endDate < 7) {
    for (let end = 0; end < endDate; end++) {
      newArray.push({
        date: 0,
        text: 0,
        num: 0
      });
    };
  }
  this.dateList = newArray;
}