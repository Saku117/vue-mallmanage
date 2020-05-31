/*
 * @Author: your name
 * @Date: 2020-05-26 14:25:40
 * @LastEditTime: 2020-05-31 14:20:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mallmanage\src\main.js
 */ 
import Vue from 'vue'
import App from './App.vue'
import myBread from './components/myBread.vue'
import router from './router'
import store from './store'
import MyHttpServer from './plugins/http'
import './assets/css/reset.css'
import ElementUI from 'element-ui';
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css';
import ElTreeGrid from 'element-tree-grid'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'

Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.component('tree-table', TreeTable)


// import axios from 'axios'
// Vue.prototype.$axios = axios

Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(MyHttpServer)

Vue.component(myBread.name, myBread)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')