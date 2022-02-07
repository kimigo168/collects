
import axios from 'axios';

axios.defaults.timeout = 15000;
axios.defaults.baseURL = apiHost;
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

axios.interceptors.request.use(
    config => {
      config.data = JSON.stringify(config.data);
      config.headers = {
        // 'Content-Type': 'application/json;charset=utf-8;application/vnd.ms-excel',
        'Content-Type': 'application/json;charset=utf-8;',
        // 'Accept': '*/*',
        // get: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // }
      };
      return config;
    },
    error => {
      return Promise.reject(error);
    }
)

axios.interceptors.response.use()
export default axios;
