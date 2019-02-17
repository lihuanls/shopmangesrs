// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import router from './router'
import moment from 'moment'
import http from './components/http'
import cusBread from './components/cusBread.vue'
 
Vue.use(ElementUI)
Vue.use(http)

Vue.config.productionTip = false


Vue.filter('fmData',function (v) {
  return moment(v).format('YYYY-MM-DD')
})

Vue.component(cusBread.name, cusBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
