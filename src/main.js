import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './plugins/store'
import './plugins/axios'
import './plugins/element.js'
Vue.config.productionTip = false

//const & url
import const_ from "../config/const"
import url from "../config/url"
Vue.prototype.$const = const_
Vue.prototype.$url = url

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
