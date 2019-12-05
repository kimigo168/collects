import Vue from 'vue'
import store from './../vuex/store'

Vue.prototype.$isWeixin = !!navigator.userAgent.match(/MicroMessenger/gi);
Vue.prototype.$ = $;


Vue.prototype.$getTime = function () {
  var now = new Date();
  var y = now.getFullYear();
  var M = now.getMonth() + 1;
  if (M < 10) M = "0" + M;
  var d = now.getDate();
  if (d < 10) d = "0" + d;
  var h = now.getHours();
  if (h < 10) h = "0" + h;
  var m = now.getMinutes();
  if (m < 10) m = "0" + m;
  var s = now.getSeconds();
  if (s < 10) s = "0" + s;
  return y + "-" + M + "-" + d + ' ' + h + ':' + m + ':' + s;
};


Vue.prototype.$http = function (param) {
  $.ajax({
    url: param.url || '',
    type: param.type || 'POST',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    data: param.data || {},
    success: function (data) {
      if (param.success) param.success(data);
      if (data.code == "7004") {
        store.commit('setToolTip', '您今天的免费体验次数已用尽！');
      } else if (data.code == "9001") {
        location.href = location.href.split('#')[0];
      }
    },
    error: function (data) {
      if (param.error) param.error(data);
      // store.commit('setToolTip', '服务器错误！');
      store.commit('setLoading', false);
    }
  });
};

//获取url参数,并转换成对象
Vue.prototype.$getSearchPamara = function () {
  var str = location.search.slice(1);
  var res = {};
  if (!str) {
    return res;
  }
  str.split("&").forEach(function (v, k, arr) {
    var param = v.split('=');
    res[param[0]] = param[1];
  });
  return res;
};

//随机生成32位字符串
Vue.prototype.$generateUUID = function () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//PV,UV等 数据统计
Vue.prototype.$updateStcLog = function (param) {
  $.ajax({
    url: adminApiHost + "/stc/log/upload.do",
    type: 'POST',
    xhrFields: {
      withCredentials: true,
    },
    crossDomain: true,
    data: param,
  })
};


//检测敏感词
Vue.prototype.$checkSensitiveWord = function (content, callback) {
  store.commit("setLoading", "正在检测中…");
  Vue.prototype.$http({
    url: apiHost + '/sensitiveWord/check.do',
    data: {
      content: content
    },
    success: function (data) {
      store.commit("setLoading", false);
      var length = 0;
      if (data.code == 0) {
        if (data.data && data.data.length > 0) {
          for (var i = 0; i < data.data.length; i++) {
            if (data.data[i].words) length += data.data[i].words.length
          }
        }
      }
      if (callback) callback(data, length)
    }
  })
};

