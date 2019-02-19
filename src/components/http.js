
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
            config.headers.common['Authorization'] = AUTH_TOKEN
            
          }
          console.log(config)
          //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjozMCwiaWF0IjoxNTUwNTAwMjY3LCJleHAiOjE1NTA1ODY2Njd9.Cu9WQ6f_DNEnXJ1ccRWfed19LAnqR4M7knQfzdI5VY4
          //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjozMCwiaWF0IjoxNTUwNTAwMjY3LCJleHAiOjE1NTA1ODY2Njd9.Cu9WQ6f_DNEnXJ1ccRWfed19LAnqR4M7knQfzdI5VY4
          return config
        },
        function(error) {
           
          return Promise.reject(error)
        }
      )
     
  
    Vue.prototype.$http = axios
  }
  export default HttpServer
