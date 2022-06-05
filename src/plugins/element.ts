/*
 * @Description: element
 * @Author: lanchao
 * @Date: 2022-05-23 16:03:14
 * @LastEditTime: 2022-06-05 11:50:09
 * @LastEditors: lanchao
 * @Reference: element
 */
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css'

export default (app: any) => {
  app.use(ElementPlus)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
