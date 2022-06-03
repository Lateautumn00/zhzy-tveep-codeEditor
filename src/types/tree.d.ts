/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-05-31 18:59:59
 * @LastEditTime: 2022-06-03 15:42:34
 * @LastEditors: lanchao
 * @Reference:
 */
//左侧 侧边栏树
interface TreeList {
  label: string
  src: string
  type: number //是否为文件  0 文件夹 1文件
  state: number //是否编辑状态 0 否 1 是
  children: TreeList[]
}
//右侧tabs
interface Tabs {
  label?: string
  key?: string
  src?: string
}
