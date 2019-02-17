import Axios from 'axios'

const HttpServer = {};
HttpServer.install = function (Vue) {
    Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
    const AUTH_TOKEN = localStorage.getItem("token");
    this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
    Vue.prototype.$http = Axios
  }
export  default = 