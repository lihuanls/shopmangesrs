
import axios from 'axios'
const HttpServer ={};
// Vue插件自定义
HttpServer.install = function(Vue) {
    // 插件要封装的功能
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // 拦截器
    axios.interceptors.request.use(
        function(config) {
           
          if (config.url !== 'login') {
            const AUTH_TOKEN = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
          }
          
          return config
        },
        function(error) {
           
          return Promise.reject(error)
        }
      )
     
  
    Vue.prototype.$http = axios
  }
  export default HttpServer
