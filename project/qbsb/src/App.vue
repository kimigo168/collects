<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {}
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
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    background-color: $main-bc-color;
  }
</style>
