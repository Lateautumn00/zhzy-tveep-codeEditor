/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-05-31 18:59:59
 * @LastEditTime: 2022-05-31 19:00:04
 * @LastEditors: lanchao
 * @Reference:
 */
//左侧 侧边栏树
interface TreeList {
  label: string
  src: string
  type: number
  children: TreeList[]
}
//右侧tabs
interface Tabs {
  label?: string
  key?: string
  src?: string
}
