import Axios from 'axios'
import {
  Message
} from 'element-ui';
// vue 开发插件方式
const HttpServer = {};
HttpServer.install = function (Vue) {
  Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
  // 所有请求发起之后,进行筛选,请求标识是不是login
  // 如果标识是login,就不需要头部->请求继续发起
  // 当请求标识不是login,先设置头部,再发送请求


  // 请求拦截器
  Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log("请求拦截器被触发了-----");
    // 所有请求发起之后,进行筛选,请求标识是不是login
    // 如果标识是login,不要头部->请求继续发起
    // 当请求标识不是login,先设置头部,再发送请求
    if (config.url !== "login") {
      const AUTH_TOKEN = localStorage.getItem("token");
      //加引号代表属性 不加是变量
      // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //headers也是一个对象
      //   config.headers["Authorization"] = AUTH_TOKEN;
      config.headers.Authorization = AUTH_TOKEN;
      // var per = {};
      // per["Authorization"] = "token";
      // console.log(config);

    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  //响应拦截器
  Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 组件中的所有 status等于200和201之外的响应码提示信息
    const {
      data: {
        meta: {
          status,
          msg
        }
      }
    } = response
    if (status !== '200' || status !== '201') {
      Message.error(msg)
    }

    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  // Vue 是在参数中传过来的 当全局使用插件时候就会函数参数传过来vue
  Vue.prototype.$http = Axios
}
export default HttpServer;
