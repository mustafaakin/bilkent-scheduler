import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue';

import router from './router'

Vue.use(SuiVue)

Vue.config.productionTip = false
import 'semantic-ui-css/semantic.min.css';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
