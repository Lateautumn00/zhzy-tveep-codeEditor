/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-05-24 11:04:43
 * @LastEditors: lanchao
 * @Reference:
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')
