import $ from "jquery"
import Vue from "vue";
import eu from 'element-ui';

Vue.use(eu);

export default function $jqAjax(parameters) {
  $.ajax({
    url: parameters.url || '',
    type: parameters.type || "post",
    data: parameters.data || {},
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    timeout: 15000,
    success: function (data) {
      if (parameters.success) parameters.success(data);
      if (data.code == "9001") {
        Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
          confirmButtonText: '确定',
          center: 'true',
          callback: () => {
            location.href = location.pathname;
          }
        })
      }
    },
    error: function (err) {
      if (parameters.error) parameters.error(err);
      if (err.code == "9001") {
        Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
          confirmButtonText: '确定',
          center: 'true',
          callback: () => {
            location.href = location.pathname;
          }
        })
      }
    }
  })
};

