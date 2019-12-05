import axios from "./axios-ajax"
import Vue from "vue";
import eu from 'element-ui';

Vue.use(eu);

const $http = function (parameters) {
  var url = parameters.url;
  var data = parameters.data;
  var type = parameters.type;
  var success = parameters.success || function () {
    console.log(error);
  };
  var error = parameters.error || function () {};
  if (type == "get" || type == "GET") {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data
      }).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
    }).then(r => {
      success(r);
      if (r.code == "9001") {
        Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
          confirmButtonText: '确定',
          center: 'true',
          callback: () => {
            location.href = location.pathname;
          }
        })
      }
    }).catch(e => {
      error(e);
      if (e.code == "9001") {
        Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
          confirmButtonText: '确定',
          center: 'true',
          callback: () => {
            location.href = location.pathname;
          }
        })
      }
    })
  } else {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
          .then(response => {
            resolve(response.data);
          }, err => {
            reject(err);
          });
      })
      .then(r => {
        if (success) success(r);
        if (r.code == "9001") {

          Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
            confirmButtonText: '确定',
            center: 'true',
            callback: () => {
              location.href = location.pathname;
            }
          })
        }
      })
      .catch(e => {
        if (error) error(e);
        if (e.code == "9001") {
          Vue.prototype.$alert('登录失效, 请重新登录', '提示', {
            confirmButtonText: '确定',
            center: 'true',
            callback: () => {
              location.href = location.pathname;
            }
          })
        }
      })
  }
}

export default $http;

