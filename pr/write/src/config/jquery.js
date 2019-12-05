import Vue from 'vue'
import $ from 'jquery'
import store from '../store'
import { TOGGLE_LIMITPOP, TOGGLE_LOGINPOP, CLEAR_USERINFO } from '../store/mutation-types'

window.$ = $
Vue.prototype.$ = $
Vue.prototype.$http = function (param) {
  var self = this
  $.ajax({
    url: param.url || '',
    type: param.type || 'POST',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    data: param.data || {},
    dataType: 'json',
    success: function (data) {
      if (param.success) param.success(data)
      if (data.code === '9001') {
        store.commit(CLEAR_USERINFO) // 清除登录过期的用户信息
        setTimeout(() => {
          store.commit(TOGGLE_LOGINPOP, true) // 弹出登录弹窗
        }, 300)
      } else if (data.code === '7004') {
        store.commit(TOGGLE_LIMITPOP, true)
      } else if (data.code === '7003') { // 次数已达到
        store.commit(TOGGLE_LIMITPOP, true)
      }
    },
    error: function (data) {
      if (param.error) param.error(data)
      if (self.loading) self.loading = false
    }
  })
}


Vue.prototype.$exportFile = function (url, param) {
  var form = $('<form>')
  form.attr('id', 'downloadform')
  form.attr('style', 'display:none')
  form.attr('target', '_blank')
  form.attr('method', 'post')
  form.attr('action', url)
  for (var key in param) {
    var input = $('<input>')
    input.attr('type', 'hidden')
    input.attr('name', key)
    input.attr('value', param[key])
    form.append(input)
  }
  $('body').append(form)
  form.submit()
  $('#downloadform').remove()
}



Vue.prototype.GetId = function (str) {
  return str.split('&')[0]
};
Vue.prototype.GetText = function (str) {
  var text = '';
  if (str.split('&').length > 1) {
    text = str.split('&')[1]
  }
  return text;
};
