/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-05-31 18:59:59
 * @LastEditTime: 2022-06-03 15:42:34
 * @LastEditors: lanchao
 * @Reference:
 */
//左侧 侧边栏树
export interface TreeList {
  index: number //1已打开文件树根节点 2文件树根节点 3目录 4文件
  key: string
  label: string
  src: string
  isLeaf: boolean //是否为文件  false 文件夹 true文件
  state: number //是否编辑状态 0 否 1 是
  children: TreeList[]
}
//右侧tabs
export interface Tabs {
  label?: string
  key?: string
  src?: string
}
